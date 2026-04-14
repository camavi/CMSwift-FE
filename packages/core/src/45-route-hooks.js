  // useRouter (hook-style)
  // ===============================
  CMSwift.useRouter = function (ctx) {
    const router = CMSwift.router;

    // nessun cleanup necessario ora, ma pronto per future estensioni
    if (ctx && typeof ctx.onDispose === "function") {
      // placeholder per future listener
    }

    return {
      navigate: router.navigate,
      back: () => history.back(),
      forward: () => history.forward(),
      get current() {
        return router;
      }
    };
  };
  // ===============================
  // useRoute (hook-style, reattivo)
  // ===============================
  CMSwift.useRoute = function (ctx) {
    const [getPath, setPath] = CMSwift.reactive.signal("");
    const [getParams, setParams] = CMSwift.reactive.signal({});
    const [getQuery, setQuery] = CMSwift.reactive.signal({});
    const [getHash, setHash] = CMSwift.reactive.signal("");

    // handler aggiornamento
    const update = (routeCtx) => {
      setPath(routeCtx.path || "");
      setParams(routeCtx.params || {});
      setQuery(routeCtx.query || {});
      setHash(routeCtx.hash || "");
    };

    // subscribe router
    const unsubscribe = CMSwift.router.subscribe(update);

    // cleanup automatico
    if (ctx && typeof ctx.onDispose === "function") {
      ctx.onDispose(unsubscribe);
    }

    return {
      path: getPath,
      params: getParams,
      query: getQuery,
      hash: getHash
    };
  };

  // ===============================
  // Permission-based rendering helpers
  // ===============================
