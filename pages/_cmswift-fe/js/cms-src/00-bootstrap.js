(() => {

  /* ===============================
     CMSwift core mini (ready + dom + reactive)
     =============================== */

  window.CMSwift = window.CMSwift || {};
  const CMSwift = window.CMSwift;
  window._ = window.CMSwift; // legacy alias, deprecated: use `_.`


  CMSwift.config = CMSwift.config || {};
  CMSwift.config.debug = CMSwift_setting?.modeDev ?? false;

  CMSwift.isDev = function () {
    return CMSwift.config.debug;
  };

  // UTILITIES
  CMSwift.uiNormalizeArgs = function (args) {
    let props = {};
    let children = args;

    if (
      args.length > 0 &&
      typeof args[0] === "object" &&
      args[0] !== null &&
      !args[0].nodeType &&
      !Array.isArray(args[0]) &&
      !(args[0] instanceof Function)
    ) {
      props = args[0];
      children = args.slice(1);
    }
    return { props, children };
  }
  CMSwift.uiSizes = ["xxs", "xs", "sm", "md", "lg", "xl", "xxl", "xxxl"];
  CMSwift.uiColors = ["primary", "secondary", "success", "warning", "danger", "info", "light", "dark"];
  CMSwift.meta = CMSwift.meta || {
    version: "core-draft",
    policy: {
      sourceOfTruth: "readme_CMS.md",
      syncRule: "Quando cambia un modulo core, aggiornare sia questo meta sia readme_CMS.md."
    },
    modules: {
      render: {
        description: "Bridge props -> DOM per hyperscript _, attributi, class, style, eventi e children reattivi.",
        entrypoints: ["createElement", "setProp", "bindProp"],
        status: "milestone-2-closed",
        knownLimits: [
          "createElement resta ancora un punto centrale da tenere sotto controllo, anche se ora e molto piu spezzato internamente.",
          "Gli eventi non hanno ancora delegation o composizione/diff avanzato di listener multipli.",
          "Restano da esplorare edge case avanzati del renderer oltre al primo giro gia coperto dai test."
        ]
      },
      reactive: {
        description: "Core minimale signal/effect usato come base della reattivita.",
        entrypoints: ["CMSwift.reactive.signal", "CMSwift.reactive.effect", "CMSwift.reactive.computed", "CMSwift.reactive.untracked", "CMSwift.reactive.batch"],
        status: "milestone-2-closed",
        knownLimits: [
          "La protezione loop copre i loop sincroni per singolo effect, non ancora i cicli complessi tra effect multipli.",
          "Il batching sincrono ora esiste, ma manca ancora scheduling configurabile oltre il flush immediato a fine batch.",
          "Mancano primitive avanzate per controllare scheduling e transazioni asincrone."
        ]
      },
      rod: {
        description: "Layer reattivo di alto livello per binding DOM, model e interpolazioni.",
        entrypoints: ["_.rod", "CMSwift.rodBind", "CMSwift.rodModel"],
        status: "milestone-2-closed",
        knownLimits: [
          "Va chiarito meglio il rapporto con CMSwift.reactive oltre al primo riallineamento strutturale.",
          "Restano casi avanzati di model/binding da esplorare oltre al primo giro coperto dai test.",
          "Il modulo e piu pulito internamente ma non e ancora il punto finale della convergenza con il renderer."
        ]
      },
      mount: {
        description: "Mount, component instances e cleanup automatico del tree DOM.",
        entrypoints: ["CMSwift.mount", "CMSwift.component", "CMSwift.enableAutoCleanup"],
        status: "milestone-2-closed",
        knownLimits: [
          "Il lifecycle e piu pulito internamente ma resta da chiarire meglio la semantica su multi-mount e cloni.",
          "Restano da esplorare edge case avanzati del cleanup automatico fuori dal primo giro gia coperto."
        ]
      },
      platform: {
        description: "Moduli applicativi nel core: overlay, store, auth, http, router, UI meta.",
        entrypoints: ["CMSwift.overlay", "CMSwift.store", "CMSwift.plugins.auth", "CMSwift.http", "CMSwift.router", "CMSwift.ui.meta"],
        status: "milestone-1-closed",
        knownLimits: [
          "Il file e molto concentrato e va reso piu modulare.",
          "Esiste una demo browser aggregata del blocco platform, ma non ancora demo separate per ogni modulo.",
          "Mancano configurazione pubblica piu coerente e confini piu netti tra auth, http e router.",
          "Il registry UI meta non ha ancora validazione formale del suo shape."
        ]
      }
    }
  };

  CMSwift.omit = (obj, keys) => {
    const out = {};
    const skip = new Set(keys || []);
    for (const k in (obj || {})) {
      if (!skip.has(k)) out[k] = obj[k];
    }
    return out;
  };


  // ===============================
  // Cleanup registry (DOM -> disposers)
  // ===============================
  CMSwift._cleanupRegistry = new WeakMap();
  CMSwift._registerCleanup = function (node, disposer) {
    if (!node || typeof disposer !== "function") return disposer;
    const list = CMSwift._cleanupRegistry.get(node) || [];
    list.push(disposer);
    CMSwift._cleanupRegistry.set(node, list);
    return disposer;
  };


  CMSwift.dom = {
    q(sel, root = document) { return root.querySelector(sel); },
    qa(sel, root = document) { return Array.from(root.querySelectorAll(sel)); },
    attr(el, name, value) {
      if (!el) return null;
      if (value === undefined) return el.getAttribute(name);
      if (value === null) el.removeAttribute(name);
      else el.setAttribute(name, String(value));
      return el;
    }
  };

  // READY definitivo
  (() => {
    let _queue = [];
    let _ready = false;

    function flushReady() {
      if (_ready) return;
      _ready = true;
      const q = _queue.slice();
      _queue.length = 0;
      for (const fn of q) {
        try { fn(); } catch (e) { console.error("[CMSwift.ready] error:", e); }
      }
    }

    CMSwift.ready = function (fn) {
      if (typeof fn !== "function") return;
      if (_ready || document.readyState === "interactive" || document.readyState === "complete") {
        queueMicrotask(() => {
          try { fn(); } catch (e) { console.error("[CMSwift.ready] error:", e); }
        });
      } else {
        _queue.push(fn);
      }
    };

    document.addEventListener("DOMContentLoaded", flushReady, { once: true });
  })();

  // REACTIVE core
  CMSwift.reactive = (() => {
    let CURRENT_EFFECT = null;
    const EFFECT_STACK = [];
    const MAX_SYNC_EFFECT_RERUNS = 100;
    let BATCH_DEPTH = 0;
    let BATCH_FLUSH_MODE = "sync";
    let PENDING_FLUSH_MODE = "sync";
    let MICROTASK_FLUSH_SCHEDULED = false;
    const PENDING_RUNNERS = new Set();

    function normalizeFlushMode(options) {
      const mode = options?.flush;
      if (mode == null || mode === "sync") return "sync";
      if (mode === "microtask") return "microtask";
      throw new Error("CMSwift.reactive.batch: options.flush must be 'sync' or 'microtask'");
    }

    function flushPendingRunners() {
      while (PENDING_RUNNERS.size) {
        const jobs = Array.from(PENDING_RUNNERS);
        PENDING_RUNNERS.clear();
        jobs.forEach((fn) => fn());
      }
    }

    function scheduleMicrotaskFlush() {
      if (MICROTASK_FLUSH_SCHEDULED) return;
      MICROTASK_FLUSH_SCHEDULED = true;

      queueMicrotask(() => {
        MICROTASK_FLUSH_SCHEDULED = false;
        PENDING_FLUSH_MODE = "sync";
        flushPendingRunners();
      });
    }

    function notifySubscribers(subs) {
      const jobs = Array.from(subs);
      if (BATCH_DEPTH > 0 || PENDING_FLUSH_MODE === "microtask") {
        jobs.forEach((fn) => PENDING_RUNNERS.add(fn));
        if (BATCH_DEPTH === 0 && PENDING_FLUSH_MODE === "microtask") {
          scheduleMicrotaskFlush();
        }
        return;
      }
      jobs.forEach((fn) => fn());
    }

    function cleanupEffect(record) {
      if (!record) return;

      if (record._deps.size) {
        record._deps.forEach((dep) => dep.delete(record._runner));
        record._deps.clear();
      }

      if (typeof record._cleanup === "function") {
        const cleanup = record._cleanup;
        record._cleanup = null;
        try { cleanup(); } catch (e) { console.error("[CMSwift.reactive.effect] cleanup error:", e); }
      }
    }

    function runEffect(record) {
      if (!record || !record.active) return;

      cleanupEffect(record);

      EFFECT_STACK.push(record);
      CURRENT_EFFECT = record;

      try {
        const onCleanup = (fn) => {
          record._cleanup = typeof fn === "function" ? fn : null;
        };

        const out = record.fn.length > 0 ? record.fn(onCleanup) : record.fn();
        if (typeof out === "function") {
          record._cleanup = out;
        }
      } finally {
        EFFECT_STACK.pop();
        CURRENT_EFFECT = EFFECT_STACK[EFFECT_STACK.length - 1] || null;
      }
    }

    function effect(fn) {
      if (typeof fn !== "function") return () => { };

      const record = {
        fn,
        active: true,
        _deps: new Set(),
        _cleanup: null,
        _runner: null,
        _running: false,
        _queued: false
      };

      const runner = () => {
        if (!record.active) return;

        if (record._running) {
          record._queued = true;
          return;
        }

        record._running = true;
        let reruns = 0;

        try {
          do {
            record._queued = false;
            runEffect(record);
            reruns++;

            if (reruns >= MAX_SYNC_EFFECT_RERUNS) {
              record._queued = false;
              console.warn("[CMSwift.reactive.effect] loop guard triggered: too many synchronous reruns", {
                max: MAX_SYNC_EFFECT_RERUNS,
                effect: fn.name || "anonymous"
              });
              break;
            }
          } while (record.active && record._queued);
        } finally {
          record._running = false;
        }
      };
      record._runner = runner;

      runner();

      return () => {
        if (!record.active) return;
        record.active = false;
        cleanupEffect(record);
      };
    }

    function signal(initial) {
      let value = initial;
      const subs = new Set();

      function get() {
        if (CURRENT_EFFECT && CURRENT_EFFECT.active) {
          subs.add(CURRENT_EFFECT._runner);
          CURRENT_EFFECT._deps.add(subs);
        }
        return value;
      }

      function set(v) {
        value = v;
        notifySubscribers(subs);
      }

      function dispose() {
        subs.clear();
      }

      return [get, set, dispose];
    }

    function computed(fn) {
      if (typeof fn !== "function") throw new Error("CMSwift.reactive.computed: fn must be a function");

      const [get, set, disposeSignal] = signal(undefined);
      const disposeEffect = effect(() => {
        set(fn());
      });

      const getter = () => get();
      getter.dispose = () => {
        disposeEffect();
        disposeSignal();
      };
      getter.peek = () => get();
      getter.type = "computed";

      return getter;
    }

    function untracked(fn) {
      if (typeof fn !== "function") throw new Error("CMSwift.reactive.untracked: fn must be a function");

      const prevEffect = CURRENT_EFFECT;
      CURRENT_EFFECT = null;
      try {
        return fn();
      } finally {
        CURRENT_EFFECT = prevEffect;
      }
    }

    function batch(fn, options) {
      if (typeof fn !== "function") throw new Error("CMSwift.reactive.batch: fn must be a function");
      const flushMode = normalizeFlushMode(options);

      if (BATCH_DEPTH === 0) {
        BATCH_FLUSH_MODE = flushMode;
      } else if (flushMode === "microtask") {
        BATCH_FLUSH_MODE = "microtask";
      }

      BATCH_DEPTH += 1;
      try {
        return fn();
      } finally {
        BATCH_DEPTH -= 1;
        if (BATCH_DEPTH === 0) {
          const shouldUseMicrotask = BATCH_FLUSH_MODE === "microtask" || PENDING_FLUSH_MODE === "microtask";
          BATCH_FLUSH_MODE = "sync";

          if (shouldUseMicrotask) {
            PENDING_FLUSH_MODE = "microtask";
            scheduleMicrotaskFlush();
          } else {
            flushPendingRunners();
          }
        }
      }
    }

    return { signal, effect, computed, untracked, batch };
  })();
