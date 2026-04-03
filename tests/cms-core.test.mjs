import test from "node:test";
import assert from "node:assert/strict";

import { loadCMS } from "./helpers/load-cms.mjs";

const tick = () => new Promise((resolve) => setTimeout(resolve, 0));

test("reactive effect cleanup and dispose work", async () => {
  const CMS = await loadCMS();
  const [getCount, setCount] = CMS.signal(1);

  let runs = 0;
  let cleanups = 0;

  const stop = CMS.effect((onCleanup) => {
    getCount();
    runs += 1;
    onCleanup(() => {
      cleanups += 1;
    });
  });

  assert.equal(runs, 1);
  assert.equal(cleanups, 0);

  setCount(2);
  assert.equal(runs, 2);
  assert.equal(cleanups, 1);

  stop();
  assert.equal(cleanups, 2);

  setCount(3);
  assert.equal(runs, 2);
});

test("computed tracks only tracked dependencies and ignores untracked reads", async () => {
  const CMS = await loadCMS();
  const [getCount, setCount] = CMS.signal(2);
  const [getDebug, setDebug] = CMS.signal(10);

  let computedRuns = 0;
  const derived = CMS.computed(() => {
    computedRuns += 1;
    const count = getCount();
    const debug = CMS.untracked(() => getDebug());
    return `${count}:${debug}`;
  });

  assert.equal(derived(), "2:10");
  assert.equal(computedRuns, 1);

  setDebug(11);
  assert.equal(derived(), "2:10");
  assert.equal(computedRuns, 1);

  setCount(3);
  assert.equal(derived(), "3:11");
  assert.equal(computedRuns, 2);
});

test("store.signal keeps scopes isolated across prefix and storage", async () => {
  const CMS = await loadCMS();
  const scopeA = { prefix: "A:", storage: "session" };
  const scopeB = { prefix: "B:", storage: "local" };

  const [getA, setA] = CMS.store.signal("shared", 1, scopeA);
  const [getB, setB] = CMS.store.signal("shared", 9, scopeB);

  assert.equal(getA(), 1);
  assert.equal(getB(), 9);

  setA(2);
  await new Promise((resolve) => queueMicrotask(resolve));

  assert.equal(getA(), 2);
  assert.equal(getB(), 9);
  assert.equal(window.sessionStorage.getItem("A:shared"), "2");
  assert.equal(window.localStorage.getItem("B:shared"), "9");

  setB(10);
  await new Promise((resolve) => queueMicrotask(resolve));

  assert.equal(getA(), 2);
  assert.equal(getB(), 10);
  assert.equal(window.localStorage.getItem("B:shared"), "10");
});

test("store.watch callbacks run untracked and do not trigger reactive loop guard", async () => {
  const CMS = await loadCMS();
  const scope = { prefix: "WATCH:", storage: "session" };
  const [getValue, setValue] = CMS.store.signal("count", 0, scope);
  const [getHits, setHits] = CMS.signal(0);

  const stopWatch = CMS.store.watch("count", () => {
    setHits(getHits() + 1);
  }, scope);

  assert.equal(getValue(), 0);
  assert.equal(getHits(), 0);

  setValue(1);
  await new Promise((resolve) => queueMicrotask(resolve));

  assert.equal(getValue(), 1);
  assert.equal(getHits(), 1);

  stopWatch();
  setValue(2);
  await new Promise((resolve) => queueMicrotask(resolve));

  assert.equal(getHits(), 1);
});

test("http request exposes public API, hooks and state surface", async () => {
  const CMS = await loadCMS();
  const calls = [];

  globalThis.fetch = async (url, init) => {
    calls.push({ url: String(url), init });
    return {
      ok: true,
      status: 200,
      url: String(url),
      headers: new Headers({ "Content-Type": "application/json" }),
      async json() {
        return { ok: true, echoedHeader: init.headers.get("X-Test") };
      },
      async text() {
        return JSON.stringify({ ok: true });
      }
    };
  };

  let beforeHits = 0;
  let afterHits = 0;
  const offBefore = CMS.http.onBefore((req) => {
    beforeHits += 1;
    req.headers.set("X-Test", "hooked");
    return req;
  });
  const offAfter = CMS.http.onAfter((res) => {
    afterHits += 1;
    return res;
  });

  const out = await CMS.http.getJSON("/probe", {
    meta: { test: "http-success" },
    retry: { attempts: 0, delay: 0, factor: 1 }
  });

  assert.equal(beforeHits, 1);
  assert.equal(afterHits, 1);
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, "/probe");
  assert.equal(out.ok, true);
  assert.deepEqual(out.data, { ok: true, echoedHeader: "hooked" });

  const state = CMS.http.state();
  assert.equal(state.status(), "success");
  assert.equal(state.isLoading(), false);
  assert.equal(state.lastRequest().meta.test, "http-success");
  assert.equal(state.lastResponse().status, 200);

  offBefore();
  offAfter();
});

test("http onError runs when afterResponse throws", async () => {
  const CMS = await loadCMS();

  globalThis.fetch = async (url) => ({
    ok: true,
    status: 200,
    url: String(url),
    headers: new Headers(),
    async json() {
      return { ok: true };
    },
    async text() {
      return "ok";
    }
  });

  let errorHits = 0;
  const offAfter = CMS.http.onAfter((_res, req) => {
    if (req.meta?.forceError) {
      throw new Error("forced-after-error");
    }
    return _res;
  });
  const offError = CMS.http.onError((err, req) => {
    if (req.meta?.forceError) {
      errorHits += 1;
      assert.equal(err.message, "forced-after-error");
    }
  });

  await assert.rejects(
    CMS.http.getJSON("/boom", {
      meta: { forceError: true },
      retry: { attempts: 0, delay: 0, factor: 1 }
    }),
    /forced-after-error/
  );

  assert.equal(errorHits, 1);
  assert.equal(CMS.http.state().status(), "error");

  offAfter();
  offError();
});

test("router navigate updates subscribers, active state and unmounts previous view", async () => {
  const CMS = await loadCMS();
  const outlet = document.createElement("div");
  const disposals = [];
  const seen = [];

  CMS.router.setOutlet(outlet);
  CMS.router.add("/alpha/:id", (ctx) => ({
    node: document.createTextNode(`alpha:${ctx.params.id}`),
    dispose: () => disposals.push(`alpha:${ctx.params.id}`)
  }));
  CMS.router.add("/beta", () => ({
    node: document.createTextNode("beta"),
    dispose: () => disposals.push("beta")
  }));
  CMS.router.notFound((ctx) => document.createTextNode(`404:${ctx.path}`));

  const unsubscribe = CMS.router.subscribe((ctx) => {
    seen.push({
      path: ctx.path,
      params: { ...ctx.params },
      query: { ...ctx.query },
      hash: ctx.hash
    });
  });

  CMS.router.navigate("/alpha/7?tab=main#info");
  await tick();

  assert.equal(seen.at(-1).path, "/alpha/7");
  assert.deepEqual(seen.at(-1).params, { id: "7" });
  assert.deepEqual(seen.at(-1).query, { tab: "main" });
  assert.equal(seen.at(-1).hash, "#info");
  assert.equal(CMS.router.isActive("/alpha/:id"), true);

  CMS.router.navigate("/beta");
  await tick();

  assert.equal(disposals.includes("alpha:7"), true);
  assert.equal(seen.at(-1).path, "/beta");
  assert.equal(CMS.router.isActive("/beta"), true);

  CMS.router.navigate("/missing?x=1#n");
  await tick();

  assert.equal(seen.at(-1).path, "/missing");
  assert.deepEqual(seen.at(-1).query, { x: "1" });
  assert.equal(seen.at(-1).hash, "#n");
  assert.equal(CMS.router.history().at(-1).path, "/missing");

  unsubscribe();
});

test("renderer applies class, style, boolean props and event options", async () => {
  const CMS = await loadCMS();
  const [getOn, setOn] = CMS.signal(true);
  let clicks = 0;

  const input = CMS.input({
    class: ["base", { active: () => getOn() }],
    style: {
      "--cms-probe": () => (getOn() ? "10px" : "20px")
    },
    disabled: () => !getOn(),
    "aria-label": () => (getOn() ? "enabled" : null)
  });

  const onceBtn = CMS.button({
    onClick: {
      handler: () => {
        clicks += 1;
      },
      options: { once: true }
    }
  }, "Once");

  assert.equal(input.getAttribute("class"), "base active");
  assert.equal(input.style.getPropertyValue("--cms-probe"), "10px");
  assert.equal(input.disabled, false);
  assert.equal(input.getAttribute("aria-label"), "enabled");

  setOn(false);

  assert.equal(input.getAttribute("class"), "base");
  assert.equal(input.style.getPropertyValue("--cms-probe"), "20px");
  assert.equal(input.disabled, true);
  assert.equal(input.getAttribute("aria-label"), null);

  onceBtn.dispatchEvent({ type: "click" });
  onceBtn.dispatchEvent({ type: "click" });
  assert.equal(clicks, 1);
});

test("renderer supports dynamic children and SVG text nodes", async () => {
  const CMS = await loadCMS();
  const [getMode, setMode] = CMS.signal("single");

  const host = CMS.div(() => {
    if (getMode() === "single") return CMS.span("A");
    if (getMode() === "array") return [CMS.span("B"), CMS.span("C")];
    return null;
  });

  const childTags = () => host.childNodes
    .filter((node) => node.nodeType === 1)
    .map((node) => node.tagName);

  assert.deepEqual(childTags(), ["SPAN"]);

  setMode("array");
  assert.deepEqual(childTags(), ["SPAN", "SPAN"]);

  setMode("empty");
  assert.deepEqual(childTags(), []);

  const svg = CMS.svg(
    CMS.text({ "aria-label": "probe" }, "Hello")
  );
  const textNode = svg.childNodes[0];

  assert.equal(textNode.tagName, "TEXT");
  assert.equal(textNode.nodeType, 1);
  assert.equal(textNode.getAttribute("aria-label"), "probe");
});

test("mount and component cleanup run on unmount and clear", async () => {
  const CMS = await loadCMS();
  const root = document.createElement("div");
  let componentDisposals = 0;
  let mountDisposals = 0;

  const Probe = CMS.component((props, ctx) => {
    ctx.onDispose(() => {
      componentDisposals += 1;
    });
    return document.createTextNode(`probe:${props.label}`);
  });

  const unmountFirst = CMS.mount(root, () => Probe({ label: "a" }), { clear: true });
  assert.equal(root.childNodes.length, 1);

  const secondUnmount = CMS.mount(root, {
    node: document.createTextNode("b"),
    dispose: () => {
      mountDisposals += 1;
    }
  }, { clear: true });

  assert.equal(componentDisposals, 1);
  assert.equal(root.childNodes.length, 1);

  secondUnmount();
  assert.equal(mountDisposals, 1);
  assert.equal(root.childNodes.length, 0);

  unmountFirst();
  assert.equal(componentDisposals, 1);
});

test("overlay keeps stack, scroll lock and listener cleanup coherent", async () => {
  const CMS = await loadCMS();
  const anchor = document.createElement("button");
  document.body.appendChild(anchor);

  const closed = [];
  const first = CMS.overlay.open(() => CMS.div("first"), {
    backdrop: true,
    lockScroll: true,
    onClose: () => closed.push("first")
  });

  const overlayRoot = document.getElementById("cms-overlay-root");
  assert.ok(overlayRoot);
  assert.equal(CMS.overlay._stack.size, 1);
  assert.equal(document.documentElement.classList.contains("cms-scroll-locked"), true);
  assert.equal(document._listeners.get("mousedown")?.size ?? 0, 1);
  assert.equal(document._listeners.get("keydown")?.size ?? 0, 1);
  assert.equal(first.overlay.parentNode, overlayRoot);

  const second = CMS.overlay.open(() => CMS.div("second"), {
    anchorEl: anchor,
    placement: "bottom-start",
    lockScroll: true,
    onClose: () => closed.push("second")
  });

  assert.equal(CMS.overlay._stack.size, 2);
  assert.equal(document._listeners.get("mousedown")?.size ?? 0, 2);
  assert.equal(document._listeners.get("keydown")?.size ?? 0, 2);
  assert.equal(globalThis.__windowTarget._listeners.get("resize")?.size ?? 0, 1);
  assert.equal(globalThis.__windowTarget._listeners.get("scroll")?.size ?? 0, 1);
  assert.equal(second.panel.style.top, "8px");
  assert.equal(second.panel.style.left, "8px");

  CMS.overlay.closeTop();

  assert.equal(CMS.overlay._stack.size, 1);
  assert.equal(document.documentElement.classList.contains("cms-scroll-locked"), true);
  assert.equal(document._listeners.get("mousedown")?.size ?? 0, 1);
  assert.equal(document._listeners.get("keydown")?.size ?? 0, 1);
  assert.equal(globalThis.__windowTarget._listeners.get("resize")?.size ?? 0, 0);
  assert.equal(globalThis.__windowTarget._listeners.get("scroll")?.size ?? 0, 0);

  CMS.overlay.close(first.id);

  assert.equal(CMS.overlay._stack.size, 0);
  assert.equal(document.documentElement.classList.contains("cms-scroll-locked"), false);
  assert.equal(document._listeners.get("mousedown")?.size ?? 0, 0);
  assert.equal(document._listeners.get("keydown")?.size ?? 0, 0);
  assert.deepEqual(closed, ["second", "first"]);
});

test("auth plugin updates public state for login, role checks and logout", async () => {
  const CMS = await loadCMS();
  const calls = [];

  globalThis.fetch = async (url, init = {}) => {
    calls.push({ url: String(url), method: init.method || "GET" });

    if (String(url) === "/api/login") {
      return {
        ok: true,
        status: 200,
        url: String(url),
        headers: new Headers({ "Content-Type": "application/json" }),
        async json() {
          return {
            user: {
              id: "u1",
              email: "ada@example.test",
              roles: ["admin"],
              permissions: ["posts.write"]
            },
            accessToken: "token-1",
            refreshToken: "refresh-1",
            expiresAt: Date.now() + 60_000
          };
        }
      };
    }

    if (String(url) === "/api/logout") {
      return {
        ok: true,
        status: 204,
        url: String(url),
        headers: new Headers(),
        async json() {
          return {};
        }
      };
    }

    throw new Error(`Unexpected fetch in auth state test: ${url}`);
  };

  CMS.usePlugin(CMS.plugins.auth, {
    autoRedirect: false,
    endpoints: {
      login: "/api/login",
      refresh: "/api/refresh",
      logout: "/api/logout"
    }
  });

  assert.equal(CMS.auth.isAuth(), false);

  await CMS.auth.loginAsync({ email: "ada@example.test", password: "pw" });

  assert.equal(CMS.auth.isAuth(), true);
  assert.equal(CMS.auth.user().email, "ada@example.test");
  assert.equal(CMS.auth.hasRole("admin"), true);
  assert.equal(CMS.auth.can("posts.write"), true);
  assert.equal(CMS.auth.canAny(["users.read", "posts.write"]), true);
  assert.equal(CMS.auth.canAll(["admin", "posts.write"]), true);
  assert.match(CMS.auth.status(), /AUTH ✅/);
  const originalGroupCollapsed = console.groupCollapsed;
  const originalLog = console.log;
  const originalGroupEnd = console.groupEnd;
  console.groupCollapsed = () => { };
  console.log = () => { };
  console.groupEnd = () => { };
  try {
    assert.equal(CMS.auth.inspect("test-auth").token.hasAccess, true);
  } finally {
    console.groupCollapsed = originalGroupCollapsed;
    console.log = originalLog;
    console.groupEnd = originalGroupEnd;
  }

  await CMS.auth.logoutAsync();

  assert.equal(CMS.auth.isAuth(), false);
  assert.deepEqual(
    calls.map((entry) => `${entry.method} ${entry.url}`),
    ["POST /api/login", "POST /api/logout"]
  );
});

test("auth.fetch retries a 401 only once after refresh", async () => {
  const CMS = await loadCMS();
  const calls = [];

  globalThis.fetch = async (url, init = {}) => {
    const headers = new Headers(init.headers || {});
    calls.push({
      url: String(url),
      method: init.method || "GET",
      auth: headers.get("Authorization")
    });

    if (String(url) === "/api/login") {
      return {
        ok: true,
        status: 200,
        url: String(url),
        headers: new Headers({ "Content-Type": "application/json" }),
        async json() {
          return {
            user: { id: "u2", roles: ["editor"], permissions: ["docs.read"] },
            accessToken: "token-old",
            refreshToken: "refresh-old",
            expiresAt: Date.now() + 60_000
          };
        }
      };
    }

    if (String(url) === "/api/refresh") {
      return {
        ok: true,
        status: 200,
        url: String(url),
        headers: new Headers({ "Content-Type": "application/json" }),
        async json() {
          return {
            accessToken: "token-new",
            refreshToken: "refresh-new",
            expiresAt: Date.now() + 120_000
          };
        }
      };
    }

    if (String(url) === "/private") {
      return {
        ok: false,
        status: 401,
        url: String(url),
        headers: new Headers(),
        async json() {
          return { ok: false };
        }
      };
    }

    throw new Error(`Unexpected fetch in auth retry test: ${url}`);
  };

  CMS.usePlugin(CMS.plugins.auth, {
    autoRedirect: false,
    endpoints: {
      login: "/api/login",
      refresh: "/api/refresh",
      logout: "/api/logout"
    }
  });

  await CMS.auth.loginAsync({ email: "editor@example.test", password: "pw" });
  const response = await CMS.auth.fetch("/private");

  assert.equal(response.status, 401);
  assert.deepEqual(
    calls.map((entry) => `${entry.method} ${entry.url} ${entry.auth ?? ""}`.trim()),
    [
      "POST /api/login",
      "GET /private Bearer token-old",
      "POST /api/refresh",
      "GET /private Bearer token-new"
    ]
  );
});
