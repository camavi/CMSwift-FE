  // ===============================
  // HTTP (fetch wrapper)
  // ===============================
  const {
    createReactiveState: createHttpReactiveState,
    sleep,
    isRetryable,
    makeAbort,
    normalizeRequest,
    runHooks,
    wrapResponse,
    withJSON
  } = CMSwift._httpShared;
  const CMSwiftHttpSetting =
    typeof globalThis !== "undefined" && globalThis.CMSwift_setting
      ? globalThis.CMSwift_setting
      : {};
  const configHTTP = {
    baseURL: CMSwiftHttpSetting.http?.baseURL || "",
    timeout: CMSwiftHttpSetting.http?.timeout ?? 0, // ms, 0 = no timeout
    retry: CMSwiftHttpSetting.http?.retry || { attempts: 0, delay: 250, factor: 2 }, // attempts extra
    headers: CMSwiftHttpSetting.http?.headers || {},
    credentials: CMSwiftHttpSetting.http?.credentials, // "include" etc (optional)
    debug: CMSwiftHttpSetting.debug ?? false
  };
  const httpState = createHttpReactiveState(CMSwift);
  const now = () => (typeof performance !== "undefined" && performance.now ? performance.now() : Date.now());

  const hooksHTTP = {
    beforeRequest: new Set(),  // (req) => req
    afterResponse: new Set(),  // (res, req) => res
    onError: new Set()         // (err, req) => void
  };

  async function coreFetch(req) {
    // Auth integration: se esiste auth.fetch usa quello
    const f = (CMSwift.auth && typeof CMSwift.auth.fetch === "function")
      ? CMSwift.auth.fetch.bind(CMSwift.auth)
      : fetch;
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
    let req = normalizeRequest(configHTTP, input, init);

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

  // shortcuts
  CMSwift.http = {};
  CMSwift.http.request = request;
  CMSwift.http.state = () => httpState.state;
  CMSwift.http.get = (url, init) => request(url, { ...init, method: "GET" });
  CMSwift.http.del = (url, init) => request(url, { ...init, method: "DELETE" });
  CMSwift.http.post = (url, body, init) => withJSON(request, "POST", url, body, init);
  CMSwift.http.put = (url, body, init) => withJSON(request, "PUT", url, body, init);
  CMSwift.http.patch = (url, body, init) => withJSON(request, "PATCH", url, body, init);

  CMSwift.http.getJSON = async (url, init) => (await request(url, { ...init, method: "GET" })).jsonStrict();
  CMSwift.http.delJSON = async (url, init) => (await request(url, { ...init, method: "DELETE" })).jsonStrict();
  CMSwift.http.postJSON = async (url, body, init) => (await withJSON(request, "POST", url, body, init)).jsonStrict();
  CMSwift.http.putJSON = async (url, body, init) => (await withJSON(request, "PUT", url, body, init)).jsonStrict();
  CMSwift.http.patchJSON = async (url, body, init) => (await withJSON(request, "PATCH", url, body, init)).jsonStrict();

  CMSwift.http.onBefore = function (fn) { hooksHTTP.beforeRequest.add(fn); return () => hooksHTTP.beforeRequest.delete(fn); };
  CMSwift.http.onAfter = function (fn) { hooksHTTP.afterResponse.add(fn); return () => hooksHTTP.afterResponse.delete(fn); };
  CMSwift.http.onError = function (fn) { hooksHTTP.onError.add(fn); return () => hooksHTTP.onError.delete(fn); };

  // shortcuts per browser global
  window._http = CMSwift.http;
  // ===============================
