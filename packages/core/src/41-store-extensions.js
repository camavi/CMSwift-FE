  // ===============================
  // 1) store.computed (derivato, non persistito)
  // ===============================
  CMSwift.store.computed = function (fn) {
    if (typeof fn !== "function") throw new Error("store.computed: fn must be a function");
    return CMSwift.reactive.computed(fn);
  };


  // ===============================
  // 2) store.migrate (versioning + migrazioni)
  // ===============================
  // targetVersion: numero intero (es. 3)
  // steps: object { 0: fn, 1: fn, 2: fn } dove la chiave è la versione "from"
  //   step[v] porta da v -> v+1
  CMSwift.store.migrate = function (targetVersion, steps, opts = {}) {
    const versionKey = opts.versionKey ?? "__version";
    const from = Number(CMSwift.store.get(versionKey, 0) ?? 0);
    const to = Number(targetVersion ?? 0);

    if (!Number.isFinite(to) || to < 0) throw new Error("store.migrate: targetVersion non valido");
    if (from >= to) return { from, to, applied: 0 };

    let applied = 0;

    for (let v = from; v < to; v++) {
      const step = steps?.[v];
      if (typeof step === "function") {
        try {
          step(CMSwift.store);
        } catch (e) {
          console.error("[store.migrate] step error at version", v, e);
          // puoi scegliere se interrompere qui: io continuo ma è discutibile.
          // return { from, to, applied, error: e };
        }
      }
      applied++;
      // salva versione raggiunta (più sicuro step-by-step)
      CMSwift.store.set(versionKey, v + 1);
    }

    return { from, to, applied };
  };


  // ===============================
  // 3) store.model (form persistenti + rodModel)
  // ===============================
  // elOrList: Element | NodeList | Array<Element> (radio group ecc.)
  // key: string per storage
  // initial: valore iniziale se non presente
  // opts: { storage, prefix, event, parse, format }
  CMSwift.store.model = function (elOrList, key, initial, opts = {}) {
    if (typeof key !== "string" || !key) throw new Error("store.model: key deve essere una stringa non vuota");

    // signal persistente
    const [get, set, disposeSignal] = CMSwift.store.signal(key, initial, {
      storage: opts.storage,
      prefix: opts.prefix,
    });

    // bridge signal <-> rod
    const r = CMSwift.rodFromSignal(get, set);

    // two-way con elementi form (checkbox/radio/select/text/number)
    const unbindModel = CMSwift.rodModel(elOrList, r, {
      event: opts.event,
      parse: opts.parse,
      format: opts.format
    });

    // cleanup totale (utile con component dispose)
    return () => {
      try { unbindModel?.(); } catch { }
      try { disposeSignal?.(); } catch { }
      try { r.dispose?.(); } catch { }
    };
  };

  // ===============================
  // store.bind (DX alias super corto)
  // ===============================
  // selectorOrEl: "#id" | Element | NodeList | Array<Element>
  // key: string storage key
  // initial: valore iniziale
  // opts: { storage, prefix, event, parse, format }
  CMSwift.store.bind = function (selectorOrEl, key, initial, opts = {}) {
    let target = selectorOrEl;

    // risolve selector string
    if (typeof selectorOrEl === "string") {
      // se è un radio group: input[name=...]
      if (selectorOrEl.includes("[") || selectorOrEl.includes(" ")) {
        target = document.querySelectorAll(selectorOrEl);
      } else {
        target = CMSwift.dom.q(selectorOrEl);
      }
    }

    if (!target) {
      if (CMSwift.config?.debug) {
        console.warn("[store.bind] target non trovato:", selectorOrEl);
      }
      return () => { };
    }

    return CMSwift.store.model(target, key, initial, opts);
  };

  // ===============================
  // store.bindAll (form -> store)
  // ===============================
  CMSwift.store.bindAll = function (formEl, schema = {}, opts = {}) {
    if (typeof formEl === "string") formEl = CMSwift.dom.q(formEl);
    if (!formEl || !formEl.querySelectorAll) {
      console.warn("[store.bindAll] form non valido:", formEl);
      return () => { };
    }

    const disposers = [];

    for (const [name, initial] of Object.entries(schema)) {
      const els = formEl.querySelectorAll(`[name="${name}"]`);
      if (!els.length) continue;

      const unbind = CMSwift.store.model(
        els.length === 1 ? els[0] : els,
        name,
        initial,
        opts
      );
      disposers.push(unbind);
    }

    return () => disposers.forEach(fn => fn());
  };

  // ===============================
  // store.inspect (DevTools)
  // ===============================
  CMSwift.store.inspect = function () {
    const info = {
      ...CMSwift.store.stats(),
      keys: Array.from(
        (function () {
          const st = CMSwift.store.stats().storage === "session"
            ? sessionStorage
            : localStorage;
          const out = [];
          for (let i = 0; i < st.length; i++) {
            const k = st.key(i);
            if (k && k.startsWith(CMSwift.store.stats().prefix)) {
              out.push(k.replace(CMSwift.store.stats().prefix, ""));
            }
          }
          return out;
        })()
      )
    };

    console.groupCollapsed("[CMSwift.store.inspect]");
    console.table(info.keys);
    console.log(info);
    console.groupEnd();

    return info;
  };

  // ===============================
  // store.autoForm (autosave + restore)
  // ===============================
  CMSwift.store.autoForm = function (formEl, schema = {}, opts = {}) {
    const unbind = CMSwift.store.bindAll(formEl, schema, opts);

    if (CMSwift.config?.debug) {
      console.log("[store.autoForm] autosave attivo:", schema);
    }

    return unbind;
  };

  // ===============================
  // useStore (hook-style, component-aware)
  // ===============================
  CMSwift.useStore = function (key, initial, ctx, opts = {}) {
    const [get, set, dispose] = CMSwift.store.signal(key, initial, opts);

    // se siamo dentro un component, cleanup automatico
    if (ctx && typeof ctx.onDispose === "function" && typeof dispose === "function") {
      ctx.onDispose(dispose);
    }

    return [get, set];
  };
