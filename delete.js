

const configHTTP = {
  baseURL: opts.baseURL || "",
  timeout: opts.timeout ?? 0, // ms, 0 = no timeout
  retry: opts.retry || { attempts: 0, delay: 250, factor: 2 }, // attempts extra
  headers: opts.headers || {},
  credentials: opts.credentials, // "include" etc (optional)
  debug: opts.debug ?? false
};
const httpState = createHttpReactiveState(app);
const now = () => (typeof performance !== "undefined" && performance.now ? performance.now() : Date.now());

const hooksHTTP = {
  beforeRequest: new Set(),  // (req) => req
  afterResponse: new Set(),  // (res, req) => res
  onError: new Set()         // (err, req) => void
};

function joinURL(base, path) {
  if (!base) return path;
  if (/^https?:\/\//i.test(path)) return path;
  const b = base.endsWith("/") ? base.slice(0, -1) : base;
  const p = path.startsWith("/") ? path : "/" + path;
  return b + p;
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

function isRetryable(err, res) {
  // retry per network error o 5xx o 429
  if (err) return true;
  if (!res) return false;
  return res.status === 429 || (res.status >= 500 && res.status <= 599);
}

function makeAbort(timeoutMs, externalSignal) {
  if (!timeoutMs && !externalSignal) return { signal: undefined, cancel: () => { } };

  const controller = new AbortController();
  const signal = controller.signal;

  let t = null;
  if (timeoutMs > 0) {
    t = setTimeout(() => controller.abort(new Error("timeout")), timeoutMs);
  }

  // bridge external abort
  const onAbort = () => controller.abort(externalSignal.reason || new Error("aborted"));
  if (externalSignal) {
    if (externalSignal.aborted) onAbort();
    else externalSignal.addEventListener("abort", onAbort, { once: true });
  }

  const cancel = () => {
    if (t) clearTimeout(t);
    if (externalSignal) externalSignal.removeEventListener?.("abort", onAbort);
  };

  return { signal, cancel };
}

function normalizeRequest(input, init = {}) {
  const url = typeof input === "string" ? joinURL(configHTTP.baseURL, input) : input;
  const method = (init.method || "GET").toUpperCase();

  const headers = new Headers(configHTTP.headers);
  if (init.headers) new Headers(init.headers).forEach((v, k) => headers.set(k, v));

  const req = {
    url,
    method,
    headers,
    body: init.body,
    credentials: init.credentials ?? configHTTP.credentials,
    signal: init.signal,
    timeout: init.timeout ?? configHTTP.timeout,
    retry: init.retry ?? configHTTP.retry,
    meta: init.meta || {}
  };

  return req;
}

async function runHooks(set, ...args) {
  let x = args[0];
  for (const fn of set) {
    x = (await fn(x, ...args.slice(1))) ?? x;
  }
  return x;
}

async function coreFetch(req) {
  // Auth integration: se esiste auth.fetch usa quello
  const f = (app.auth && typeof app.auth.fetch === "function") ? app.auth.fetch : fetch;
  const init = {
    method: req.method,
    headers: req.headers,
    body: req.body,
    credentials: req.credentials,
    signal: req.signal
  };
  return f(req.url, init);
}

async function request(input, init = {}) {
  let req = normalizeRequest(input, init);

  // hooksHTTP pre
  req = await runHooks(hooksHTTP.beforeRequest, req);
  const requestId = httpState.markStart(req);
  const startAt = now();

  const retryCfg = req.retry || { attempts: 0, delay: 250, factor: 2 };
  const maxAttempts = Math.max(0, Number(retryCfg.attempts || 0));
  let delay = Math.max(0, Number(retryCfg.delay || 0));
  const factor = Math.max(1, Number(retryCfg.factor || 2));

  let lastErr = null;
  let lastRes = null;
  let finalRes = null;
  let finalErr = null;

  try {
    for (let attempt = 0; attempt <= maxAttempts; attempt++) {
      lastErr = null;
      lastRes = null;

      const { signal, cancel } = makeAbort(req.timeout, init.signal);
      const effectiveReq = { ...req, signal };
      const attemptAt = now();

      try {
        if (configHTTP.debug) console.log("[http.request]", effectiveReq.method, effectiveReq.url);

        CMSwift.perf?.inc("httpRequests");
        CMSwift.perf?.mark("http:req", { url: req.url, method: req.method });


        const res = await coreFetch(effectiveReq);
        lastRes = res;

        // hooksHTTP post
        const outRes = await runHooks(hooksHTTP.afterResponse, res, effectiveReq);
        const dt = now() - attemptAt;

        CMSwift.perf?.tick("http:res", dt, { status: res.status, url: req.url });

        // retryable status?
        if (attempt < maxAttempts && isRetryable(null, outRes)) {
          cancel();
          await sleep(delay);
          delay = Math.round(delay * factor);
          continue;
        }

        cancel();
        finalRes = outRes;
        return wrapResponse(outRes, effectiveReq);

      } catch (err) {
        lastErr = err;
        cancel();

        // hooksHTTP error
        for (const fn of hooksHTTP.onError) {
          try { fn(err, effectiveReq); } catch { }
        }

        // retry?
        if (attempt < maxAttempts && isRetryable(err, null)) {
          await sleep(delay);
          delay = Math.round(delay * factor);
          continue;
        }

        finalErr = err;
        throw err;
      }
    }
  } finally {
    const totalDt = now() - startAt;
    httpState.markEnd(requestId, finalRes, finalErr, totalDt);
  }

  // fallback (non dovrebbe arrivare qui)
  if (lastErr) throw lastErr;
  return wrapResponse(lastRes, req);
}

function wrapResponse(res, req) {
  // wrapper comodo: res.jsonStrict(), res.textStrict()
  return {
    ok: res.ok,
    status: res.status,
    headers: res.headers,
    raw: res,
    req,

    async json() {
      // non lancia su !ok, ritorna {data, error}
      let data = null;
      let error = null;
      try { data = await res.json(); } catch { data = null; }
      if (!res.ok) error = data ?? { status: res.status };
      return { data, error, ok: res.ok, status: res.status };
    },

    async jsonStrict() {
      const { data, error } = await this.json();

      if (error) {
        const e = new Error(`HTTP error ${res.status} ${req?.method || ""} ${req?.url || ""}`.trim());
        e.status = res.status;
        e.data = data;
        e.req = {
          url: req?.url,
          method: req?.method,
          meta: req?.meta
        };
        throw e;
      }

      return { data, ok: true, status: res.status };
    },

    async text() {
      let t = "";
      try { t = await res.text(); } catch { }
      return { text: t, ok: res.ok, status: res.status };
    },

    async textStrict() {
      const out = await this.text();
      if (!out.ok) {
        const e = new Error("HTTP error " + res.status);
        e.status = res.status;
        e.text = out.text;
        throw e;
      }
      return out;
    }
  };
}

// shortcuts
function withJSON(method, url, body, init = {}) {
  const headers = new Headers(init.headers || {});
  if (!headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  return request(url, {
    ...init,
    method,
    headers,
    body: body == null ? undefined : JSON.stringify(body)
  });
}

// public API
CMSwift.http = {
  configHTTP,
  state: httpState.state,

  onBefore(fn) { hooksHTTP.beforeRequest.add(fn); return () => hooksHTTP.beforeRequest.delete(fn); },
  onAfter(fn) { hooksHTTP.afterResponse.add(fn); return () => hooksHTTP.afterResponse.delete(fn); },
  onError(fn) { hooksHTTP.onError.add(fn); return () => hooksHTTP.onError.delete(fn); },

  request,

  get(url, init) { return request(url, { ...init, method: "GET" }); },
  del(url, init) { return request(url, { ...init, method: "DELETE" }); },
  post(url, body, init) { return withJSON("POST", url, body, init); },
  put(url, body, init) { return withJSON("PUT", url, body, init); },
  patch(url, body, init) { return withJSON("PATCH", url, body, init); }
};