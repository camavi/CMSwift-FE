(() => {

  /* ===============================
     CMSwift core mini (ready + dom + reactive)
     =============================== */

  window.CMSwift = {};
  window.cms = window.CMSwift; // alias
  const CMSwift = window.CMSwift;


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

    function effect(fn) {
      CURRENT_EFFECT = fn;
      try { fn(); } finally { CURRENT_EFFECT = null; }
    }

    function signal(initial) {
      let value = initial;
      const subs = new Set();

      function get() {
        if (CURRENT_EFFECT) subs.add(CURRENT_EFFECT);
        return value;
      }

      function set(v) {
        value = v;
        subs.forEach(fn => fn());
      }

      return [get, set];
    }

    return { signal, effect };
  })();

  CMSwift.overlay = (() => {
    let seq = 0;
    const stack = new Map(); // id -> entry
    let root = null;
    const ensureRoot = () => {
      if (root && root.isConnected) return root;
      let el = document.getElementById("cms-overlay-root");
      if (!el && document?.body) {
        el = document.createElement("div");
        el.id = "cms-overlay-root";
        el.className = "cms-overlay-root";
        document.body.appendChild(el);
      }
      if (!document.body && !el) {
        CMSwift.ready(() => {
          let readyEl = document.getElementById("cms-overlay-root");
          if (!readyEl) {
            readyEl = document.createElement("div");
            readyEl.id = "cms-overlay-root";
            readyEl.className = "cms-overlay-root";
            document.body.appendChild(readyEl);
          }
          root = readyEl;
        });
      }
      root = el;
      return root;
    };

    let scrollLockCount = 0;
    const lockScroll = () => {
      scrollLockCount++;
      if (scrollLockCount === 1) {
        document.documentElement.classList.add("cms-scroll-locked");
      }
    };
    const unlockScroll = () => {
      scrollLockCount = Math.max(0, scrollLockCount - 1);
      if (scrollLockCount === 0) {
        document.documentElement.classList.remove("cms-scroll-locked");
      }
    };

    const getTop = () => {
      let top = null;
      for (const e of stack.values()) top = e; // insertion order
      return top;
    };

    const focusFirst = (container) => {
      const sel = [
        "button:not([disabled])",
        "[href]",
        "input:not([disabled])",
        "select:not([disabled])",
        "textarea:not([disabled])",
        "[tabindex]:not([tabindex='-1'])"
      ].join(",");
      const node = container.querySelector(sel);
      node?.focus?.();
    };

    const trapFocus = (e, container) => {
      if (e.key !== "Tab") return;
      const sel = [
        "button:not([disabled])",
        "[href]",
        "input:not([disabled])",
        "select:not([disabled])",
        "textarea:not([disabled])",
        "[tabindex]:not([tabindex='-1'])"
      ].join(",");
      const nodes = Array.from(container.querySelectorAll(sel)).filter(n => n.offsetParent !== null);
      if (!nodes.length) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      const active = document.activeElement;

      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    const open = (content, opts = {}) => {
      const id = `ov_${++seq}`;

      const entry = {
        id,
        opts,
        isOpen: true,
        anchorEl: opts.anchorEl || null,
        placement: opts.placement || "bottom-start",
        onClose: typeof opts.onClose === "function" ? opts.onClose : null
      };

      const overlay = document.createElement("div");
      overlay.className = ["cms-overlay", opts.type ? `type-${opts.type}` : ""].filter(Boolean).join(" ");
      overlay.dataset.id = id;

      const backdrop = document.createElement("div");
      backdrop.className = "cms-overlay-backdrop";
      if (!opts.backdrop) backdrop.style.display = "none";

      const panel = document.createElement("div");
      panel.className = ["cms-overlay-panel", opts.className].filter(Boolean).join(" ");
      panel.tabIndex = -1;

      // mount content
      const node = (typeof content === "function") ? content({ close: () => close(id) }) : content;
      const normalized = CMSwift.ui.slot(node);
      if (Array.isArray(normalized)) normalized.forEach(n => n && panel.appendChild(n));
      else if (normalized) panel.appendChild(normalized);

      overlay.appendChild(backdrop);
      overlay.appendChild(panel);
      const host = ensureRoot();
      if (!host) return { id, close: () => close(id), panel, overlay };
      host.appendChild(overlay);

      // stack bookkeeping
      stack.set(id, { ...entry, overlay, panel, backdrop });

      // scroll lock + focus
      if (opts.lockScroll) lockScroll();
      if (opts.autoFocus !== false) setTimeout(() => focusFirst(panel), 0);

      // positioning (for menus/tooltips)
      const position = () => {
        if (!opts.anchorEl) return;
        const a = opts.anchorEl;
        const r = a.getBoundingClientRect();
        const pr = panel.getBoundingClientRect();

        // naive placement (good enough, you can improve later)
        let top = r.bottom + (opts.offsetY ?? 8);
        let left = r.left + (opts.offsetX ?? 0);

        if (opts.placement?.startsWith("top")) top = r.top - pr.height - (opts.offsetY ?? 8);
        if (opts.placement?.includes("end")) left = r.right - pr.width;

        panel.style.position = "fixed";
        panel.style.top = `${Math.max(8, Math.min(top, window.innerHeight - pr.height - 8))}px`;
        panel.style.left = `${Math.max(8, Math.min(left, window.innerWidth - pr.width - 8))}px`;
      };

      if (opts.anchorEl) {
        position();
        const onResize = () => position();
        window.addEventListener("resize", onResize);
        window.addEventListener("scroll", onResize, true);
        entry._positionCleanup = () => {
          window.removeEventListener("resize", onResize);
          window.removeEventListener("scroll", onResize, true);
        };
      }

      // click outside
      const onDocClick = (e) => {
        const top = getTop();
        if (!top || top.id !== id) return;
        if (opts.closeOnOutside === false) return;
        if (!panel.contains(e.target)) close(id);
      };
      document.addEventListener("mousedown", onDocClick, true);

      // ESC + focus trap
      const onKeyDown = (e) => {
        const top = getTop();
        if (!top || top.id !== id) return;

        if (opts.trapFocus) trapFocus(e, panel);
        if (e.key === "Escape" && opts.closeOnEsc !== false) {
          e.preventDefault();
          close(id);
        }
      };
      document.addEventListener("keydown", onKeyDown, true);

      // backdrop click
      backdrop.addEventListener("click", () => {
        if (opts.closeOnBackdrop === false) return;
        close(id);
      });

      // store cleanup
      entry._cleanup = () => {
        document.removeEventListener("mousedown", onDocClick, true);
        document.removeEventListener("keydown", onKeyDown, true);
        entry._positionCleanup?.();
      };

      // z-index stacking
      const z = 1000 + stack.size * 10;
      overlay.style.zIndex = String(z);

      return {
        id,
        close: () => close(id),
        panel,
        overlay
      };
    };

    const close = (id) => {
      const entry = stack.get(id);
      if (!entry) return;
      stack.delete(id);

      entry._cleanup?.();

      if (entry.opts.lockScroll) unlockScroll();

      entry.overlay?.remove();

      entry.onClose?.();
    };

    const closeTop = () => {
      const top = getTop();
      if (top) close(top.id);
    };

    return { open, close, closeTop, root, _stack: stack };
  })();

  /* ===============================
     _h hyperscript (usa CMSwift.reactive.effect)
     =============================== */

  const SVG_NS = "http://www.w3.org/2000/svg";
  const SVG_TAGS = new Set([
    "svg",
    "g",
    "path",
    "circle",
    "ellipse",
    "line",
    "rect",
    "polygon",
    "polyline",
    "text",
    "tspan",
    "defs",
    "linearGradient",
    "radialGradient",
    "stop",
    "use",
    "symbol",
    "clipPath",
    "mask",
    "pattern",
    "filter",
    "feGaussianBlur",
    "feOffset",
    "feBlend",
    "feColorMatrix"
  ]);

  function normalizeClass(v) {
    if (Array.isArray(v)) return v.join(" ");
    return v;
  }

  function createElement(tag, ...args) {
    const isSVG = SVG_TAGS.has(tag);
    const el = tag === "text"
      ? document.createTextNode("")
      : isSVG
        ? document.createElementNS(SVG_NS, tag)
        : document.createElement(tag);

    const isRod = (v) => !!v && v.type === "rod";

    function setProp(key, value) {
      if (key === "class") {
        el.setAttribute("class", normalizeClass(value));
        return;
      }
      if (key === "style" && typeof value === "object") {
        Object.assign(el.style, value);
        return;
      }
      if (isSVG) {
        el.setAttribute(key, value);
        return;
      }
      if (key in el) el[key] = value;
      else el.setAttribute(key, value);
    }

    function bindProp(key, value) {
      if (typeof value === "function") {
        CMSwift.reactive.effect(() => {
          setProp(key, value());
        });
        return;
      }
      if (isRod(value)) {
        CMSwift.rodBind(el, value, { key });
        return;
      }
      setProp(key, value);
    }

    for (const arg of args) {
      if (arg == null) continue;

      // array di children (anche nidificati)
      if (Array.isArray(arg)) {
        const stack = [...arg];
        while (stack.length) {
          const item = stack.shift();
          if (item == null) continue;

          if (Array.isArray(item)) {
            // flatten
            stack.unshift(...item);
            continue;
          }

          if (typeof item === "string" || typeof item === "number") {
            el.appendChild(document.createTextNode(item));
            continue;
          }

          if (typeof item === "function") {
            const t = document.createTextNode("");
            el.appendChild(t);
            CMSwift.reactive.effect(() => { t.textContent = item(); });
            continue;
          }

          if (item.nodeType) {
            el.appendChild(item);
            continue;
          }
        }
        continue;
      }

      if (typeof arg === "string" || typeof arg === "number") {
        el.appendChild(document.createTextNode(arg));
        continue;
      }

      // reactive text binding
      if (typeof arg === "function") {
        const t = document.createTextNode("");
        el.appendChild(t);

        CMSwift.reactive.effect(() => {
          t.textContent = arg();
        });
        continue;
      }

      if (arg.nodeType) {
        el.appendChild(arg);
        continue;
      }

      if (typeof arg === "object") {
        for (const [key, value] of Object.entries(arg)) {
          if (key.startsWith("on") && typeof value === "function") {
            el.addEventListener(key.slice(2).toLowerCase(), value);
            continue;
          }
          if (key === "class") {
            bindProp(key, value);
            continue;
          }
          if (key === "style" && typeof value === "object" && value !== null && !isRod(value)) {
            for (const [styleKey, styleVal] of Object.entries(value)) {
              if (typeof styleVal === "function") {
                CMSwift.reactive.effect(() => {
                  el.style[styleKey] = styleVal() ?? "";
                });
                continue;
              }
              if (isRod(styleVal)) {
                CMSwift.rodBind(el, styleVal, { key: `style.${styleKey}` });
                continue;
              }
              el.style[styleKey] = styleVal;
            }
            continue;
          }
          bindProp(key, value);
        }
      }
    }

    return el;
  }

  const _h = {};
  const DOM_ELEMENTS = [

    // ─────────────────────────────
    // Document & Metadata
    // ─────────────────────────────
    "html",
    "head",
    "title",
    "base",
    "link",
    "meta",
    "style",

    // ─────────────────────────────
    // Sectioning
    // ─────────────────────────────
    "body",
    "header",
    "footer",
    "main",
    "section",
    "article",
    "aside",
    "nav",

    // ─────────────────────────────
    // Headings
    // ─────────────────────────────
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",

    // ─────────────────────────────
    // Text content
    // ─────────────────────────────
    "p",
    "div",
    "span",
    "pre",
    "blockquote",
    "hr",
    "br",
    "address",

    // ─────────────────────────────
    // Inline text semantics
    // ─────────────────────────────
    "a",
    "abbr",
    "b",
    "bdi",
    "bdo",
    "cite",
    "code",
    "data",
    "dfn",
    "em",
    "i",
    "kbd",
    "mark",
    "q",
    "rp",
    "rt",
    "ruby",
    "s",
    "samp",
    "small",
    "strong",
    "sub",
    "sup",
    "time",
    "u",
    "var",
    "wbr",

    // ─────────────────────────────
    // Lists
    // ─────────────────────────────
    "ul",
    "ol",
    "li",
    "dl",
    "dt",
    "dd",

    // ─────────────────────────────
    // Tables
    // ─────────────────────────────
    "table",
    "caption",
    "colgroup",
    "col",
    "thead",
    "tbody",
    "tfoot",
    "tr",
    "th",
    "td",

    // ─────────────────────────────
    // Forms
    // ─────────────────────────────
    "form",
    "label",
    "input",
    "textarea",
    "button",
    "select",
    "option",
    "optgroup",
    "fieldset",
    "legend",
    "datalist",
    "output",
    "progress",
    "meter",

    // ─────────────────────────────
    // Embedded content
    // ─────────────────────────────
    "img",
    "picture",
    "source",
    "iframe",
    "embed",
    "object",
    "param",

    // ─────────────────────────────
    // Media
    // ─────────────────────────────
    "audio",
    "video",
    "track",

    // ─────────────────────────────
    // Interactive
    // ─────────────────────────────
    "details",
    "summary",
    "dialog",

    // ─────────────────────────────
    // Scripting
    // ─────────────────────────────
    "script",
    "noscript",
    "canvas",
    "template",
    "slot",

    // ─────────────────────────────
    // SVG (principali)
    // ─────────────────────────────
    "svg",
    "g",
    "path",
    "circle",
    "ellipse",
    "line",
    "rect",
    "polygon",
    "polyline",
    "text",
    "tspan",
    "defs",
    "linearGradient",
    "radialGradient",
    "stop",
    "use",
    "symbol",
    "clipPath",
    "mask",
    "pattern",
    "filter",
    "feGaussianBlur",
    "feOffset",
    "feBlend",
    "feColorMatrix"
  ];
  DOM_ELEMENTS.forEach(tag => {
    _h[tag] = (...args) => createElement(tag, ...args);
  });
  window._h = _h;

  _h.fragment = (...children) => children;
  _h.dynamic = function (renderFn) {
    const anchor = document.createComment("dyn");
    const parent = document.createDocumentFragment();
    parent.appendChild(anchor);

    let current = null;

    CMSwift.reactive.effect(() => {
      const next = renderFn();

      // rimuovi current
      if (current && current.parentNode) current.parentNode.removeChild(current);
      current = null;

      if (next == null) return;

      // normalizza: node o string
      let node = next;
      if (typeof next === "string" || typeof next === "number") {
        node = document.createTextNode(String(next));
      }

      // inserisci dopo anchor
      const p = anchor.parentNode;
      if (p && node && node.nodeType) {
        p.insertBefore(node, anchor.nextSibling);
        current = node;
      }
    });

    return parent; // fragment con anchor
  };

  /* ===============================
     ROD v3 PRO (batch + bindings + dispose hooks + key mapping)
     =============================== */

  function createMicrotaskScheduler() {
    let queued = false;
    const queue = new Set();
    function flush() {
      queued = false;
      CMSwift.debug?.inc("rodFlushes");
      CMSwift.perf?.inc("rodFlushes");
      CMSwift.perf?.mark("rod:flush");
      const jobs = Array.from(queue);
      queue.clear();
      for (const fn of jobs) {
        try { fn(); } catch (e) { console.error("[rod] flush error:", e); }
      }
    }
    return function schedule(fn) {
      queue.add(fn);
      if (!queued) {
        queued = true;
        queueMicrotask(flush);
      }
    };
  }
  const rodSchedule = createMicrotaskScheduler();

  function rodApplyBinding(el, key, value) {
    if (!el) return;

    if (el.nodeType === 3) {
      el.textContent = value ?? "";
      return;
    }

    if (key === "class") {
      el.setAttribute("class", normalizeClass(value));
      return;
    }

    if (!key || key === "auto") {
      const tag = el.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") el.value = value ?? "";
      else el.textContent = value ?? "";
      return;
    }

    if (key === "value") {
      el.value = value ?? "";
      return;
    }

    if (key.startsWith("attr:")) {
      CMSwift.dom.attr(el, key.slice(5), value);
      return;
    }
    if (key.startsWith("@")) {
      CMSwift.dom.attr(el, key.slice(1), value);
      return;
    }

    if (key.startsWith("style.")) {
      el.style[key.slice(6)] = value ?? "";
      return;
    }

    if (key.includes(".")) {
      const parts = key.split(".");
      let obj = el;
      for (let i = 0; i < parts.length - 1; i++) {
        obj = obj?.[parts[i]];
        if (!obj) return;
      }
      obj[parts[parts.length - 1]] = value;
      return;
    }

    CMSwift.dom.attr(el, key, value);
  }

  function rodCreateComponent(initialValue) {
    const comp = {
      type: "rod",
      value: initialValue,

      _bindings: [],
      _actions: [],
      _disposeHooks: [],

      _disposed: false,
      _silentDepth: 0,
      _pending: false,

      bindings() {
        return this._bindings.map(b => ({ el: b.el, key: b.key }));
      },

      onDispose(fn) {
        if (typeof fn === "function") this._disposeHooks.push(fn);
        return this;
      },

      _bind(el, config = { key: "auto" }) {
        if (this._disposed) return () => { };
        if (!el) return () => { };

        const b = { el, key: (config?.key ?? "auto") };

        const exists = this._bindings.some(x => x.el === b.el && x.key === b.key);
        if (!exists) this._bindings.push(b);

        rodApplyBinding(b.el, b.key, this.value);

        return () => {
          this._bindings = this._bindings.filter(x => !(x.el === b.el && x.key === b.key));
        };
      },

      action(fn) {
        if (!this._disposed && typeof fn === "function") this._actions.push(fn);
        return this;
      },

      _setSilent(v) {
        this._silentDepth++;
        try { this.value = v; } finally { this._silentDepth--; }
        return this;
      },

      _scheduleNotify() {
        if (this._disposed || this._pending) return;
        this._pending = true;
        rodSchedule(() => {
          this._pending = false;
          this._notifyNow();
        });
      },

      _notifyNow() {
        if (this._disposed) return;
        const __t0 = performance.now();

        CMSwift.perf?.inc("rodNotifies");

        this._bindings = this._bindings.filter(b => {
          const el = b.el;
          if (!el) return false;
          if (el.nodeType === 3) return !!el.parentNode;
          return el.isConnected !== false;
        });

        for (const b of this._bindings) {
          rodApplyBinding(b.el, b.key, this.value);
        }

        if (this._silentDepth > 0) return;

        for (const fn of this._actions) {
          try { fn(this.value); } catch (e) { console.error("[rod] action error:", e); }
        }
        CMSwift.debug?.inc("rodNotifies");
        CMSwift.perf?.tick("rod:notify", performance.now() - __t0, {
          bindings: this._bindings?.length || 0,
          actions: this._actions?.length || 0
        });
      },

      dispose() {
        if (this._disposed) return;
        this._disposed = true;
        for (const fn of this._disposeHooks) {
          try { fn(); } catch (e) { console.error("[rod] dispose hook error:", e); }
        }
        this._bindings.length = 0;
        this._actions.length = 0;
        this._disposeHooks.length = 0;
      }
    };
    return comp;
  }

  function rodMakeReactive(obj, key = "value") {
    let _val = obj[key];
    let _get = null;
    let _set = null;

    if (CMSwift?.reactive?.signal) {
      [_get, _set] = CMSwift.reactive.signal(_val);
    }

    Object.defineProperty(obj, key, {
      get() { return _get ? _get() : _val; },
      set(v) {
        if (_set) _set(v);
        else _val = v;
        obj._scheduleNotify();
      },
      configurable: true
    });

    if (typeof obj.val !== "function") {
      Object.defineProperty(obj, "val", {
        value(v) {
          if (arguments.length) {
            this.value = v;
            return v;
          }
          return this.value;
        },
        configurable: true
      });
    }

    if (!obj[Symbol.toPrimitive]) {
      Object.defineProperty(obj, Symbol.toPrimitive, {
        value(hint) {
          const v = this.value;
          if (v == null) return v;
          const t = typeof v;
          if (t === "string" || t === "number" || t === "boolean" || t === "bigint" || t === "symbol") return v;
          return hint === "number" ? Number(v) : String(v);
        },
        configurable: true
      });
    }

    if (!obj.valueOf) {
      Object.defineProperty(obj, "valueOf", {
        value() { return this.value; },
        configurable: true
      });
    }

    if (!obj.toString) {
      Object.defineProperty(obj, "toString", {
        value() { return String(this.value); },
        configurable: true
      });
    }

    return obj;
  }

  window._rod = function _rod(data, key = "value") {
    const comp = rodCreateComponent(data);
    rodMakeReactive(comp, key);

    CMSwift.rod._all = CMSwift.rod._all || new Set();
    CMSwift.rod._all.add(comp);

    if (typeof comp.onDispose === "function") {
      comp.onDispose(() => CMSwift.rod._all.delete(comp));
    }
    return comp;
  };

  CMSwift.rodBind = function (el, react, config = { key: "auto" }) {
    CMSwift.debug?.inc("rodBinds");

    if (!el) {
      CMSwift.debug?.inc("rodBindNull");
      CMSwift.debug?.warn("rodBind: target element è null/undefined", config);
      return () => { };
    }
    if (!react || react.type !== "rod") {
      throw new Error("CMSwift.rodBind: react must be a rod object");
    }
    return react._bind(el, config);
  };


  CMSwift.rodFromSignal = function (get, set) {
    const r = _rod(get());
    let syncing = false;

    r.action((v) => {
      if (syncing) return;
      if (get() === v) return;
      syncing = true;
      try { set(v); } finally { syncing = false; }
    });

    CMSwift.reactive.effect(() => {
      const v = get();
      if (r.value === v) return;
      syncing = true;
      try { r._setSilent(v); } finally { syncing = false; }
    });

    return r;
  };

  // ===============================
  // Two-way binding: input <-> rod
  // ===============================
  // ===============================
  // Two-way binding avanzato
  // input / checkbox / radio / select
  // ===============================

  function getInputKind(el) {
    if (!el || !el.tagName) return null;

    const tag = el.tagName.toLowerCase();

    if (tag === "input") {
      const type = (el.type || "text").toLowerCase();
      if (type === "checkbox") return "checkbox";
      if (type === "radio") return "radio";
      if (type === "number") return "number";
      return "text";
    }

    if (tag === "select") {
      return el.multiple ? "select-multiple" : "select";
    }

    return null;
  }

  CMSwift.rodModel = function (target, rodObj, opts = {}) {
    if (!rodObj || rodObj.type !== "rod") {
      throw new Error("[CMSwift.rodModel] rodObj deve essere un rod");
    }

    // Supporta singolo elemento o lista (radio)
    const elements = Array.isArray(target) || target instanceof NodeList
      ? Array.from(target)
      : [target];

    const eventName = opts.event ?? "change";
    const parse = opts.parse ?? (v => v);
    const format = opts.format ?? (v => v);

    let syncing = false;
    const disposers = [];

    // === ROD → DOM ===
    const updateDOM = (value) => {
      for (const el of elements) {
        if (!el) continue;
        const kind = getInputKind(el);

        switch (kind) {
          case "checkbox":
            el.checked = !!value;
            break;

          case "radio":
            el.checked = el.value == value;
            break;

          case "select":
            el.value = value ?? "";
            break;

          case "select-multiple":
            const arr = Array.isArray(value) ? value.map(String) : [];
            for (const opt of el.options) {
              opt.selected = arr.includes(opt.value);
            }
            break;

          case "number":
          case "text":
          default:
            el.value = value ?? "";
        }
      }
    };

    // bind rod → DOM (usa rod.action)
    rodObj.action((v) => {
      if (syncing) return;
      syncing = true;
      try {
        updateDOM(format(v));
      } finally {
        syncing = false;
      }
    });

    // sync iniziale
    updateDOM(format(rodObj.value));

    // === DOM → ROD ===
    for (const el of elements) {
      if (!el) continue;

      const kind = getInputKind(el);

      const handler = () => {
        if (syncing) return;

        let next;

        switch (kind) {
          case "checkbox":
            next = el.checked;
            break;

          case "radio":
            if (!el.checked) return;
            next = el.value;
            break;

          case "select":
            next = el.value;
            break;

          case "select-multiple":
            next = Array.from(el.selectedOptions).map(o => o.value);
            break;

          case "number":
            next = parse(el.value === "" ? null : Number(el.value));
            break;

          case "text":
          default:
            next = parse(el.value);
        }

        syncing = true;
        try {
          if (rodObj.value !== next) rodObj.value = next;
        } finally {
          syncing = false;
        }
      };

      el.addEventListener(eventName, handler);
      disposers.push(() => el.removeEventListener(eventName, handler));
    }

    // cleanup automatico
    if (typeof rodObj.onDispose === "function") {
      rodObj.onDispose(() => disposers.forEach(fn => fn()));
    }

    return () => disposers.forEach(fn => fn());
  };


  // input <-> signal (sugar)
  CMSwift.signalModel = function (inputEl, get, set, opts = {}) {
    const r = CMSwift.rodFromSignal(get, set);
    return CMSwift.rodModel(inputEl, r, opts);
  };

  // ===============================
  // CMSwift.mount (Node | array | string | function)
  // ===============================
  // ===============================
  // CMSwift.mount (target singolo o array) + component cleanup
  // content può essere:
  // - Node | array | string/number
  // - function -> uno dei precedenti
  // - { node, dispose }
  // - function -> { node, dispose }  (component instance)
  // ===============================
  CMSwift.mount = function (target, content, opts = {}) {

    const toEl = (t) => (typeof t === "string" ? CMSwift.dom.q(t) : t);
    const targets = Array.isArray(target) ? target.map(toEl).filter(Boolean) : [toEl(target)].filter(Boolean);

    const clear = opts.clear ?? true;
    const isMulti = targets.length > 1;

    if (isMulti && typeof content !== "function" && disposers.length) {
      CMSwift.debug?.warn("mount multi-target con dispose: usa content come function per istanze separate.");
    }

    if (targets.length === 0) {
      console.warn("[CMSwift.mount] nessun target valido:", target);
      return () => { };
    }

    // helper: normalizza output in { nodes[], disposers[] }
    const normalize = (x) => {
      const nodes = [];
      const disposers = [];

      const add = (v) => {
        if (v == null) return;

        // component function / factory
        if (typeof v === "function") {
          add(v());
          return;
        }

        // { node, dispose }
        if (v && typeof v === "object" && "node" in v) {
          if (typeof v.dispose === "function") disposers.push(v.dispose);
          add(v.node);
          return;
        }

        // array / nested
        if (Array.isArray(v)) {
          for (const item of v) add(item);
          return;
        }

        // string/number
        if (typeof v === "string" || typeof v === "number") {
          nodes.push(document.createTextNode(String(v)));
          return;
        }

        // DOM Node
        if (v.nodeType) {
          nodes.push(v);
          return;
        }

        console.warn("[CMSwift.mount] contenuto non supportato:", v);
      };

      add(x);
      return { nodes, disposers };
    };

    const mounted = []; // [{ root, nodes, disposers }]

    for (const root of targets) {
      if (clear) {
        while (root.firstChild) root.removeChild(root.firstChild);
      }

      // per multi-target: se non passi una function, cloneremo i nodi (ma NON possiamo clonare cleanup)
      // quindi: consigliamo content come function quando mounti su più target.
      const { nodes: rawNodes, disposers } = normalize(content);

      let nodes = rawNodes;

      if (isMulti && typeof content !== "function") {
        nodes = rawNodes.map(n => n.cloneNode(true));
        if (disposers.length) {
          console.warn("[CMSwift.mount] multi-target con dispose: usa content come function per istanze separate.");
        }
      }

      for (const n of nodes) root.appendChild(n);

      mounted.push({ root, nodes, disposers });

      // registra cleanup automatico per ogni nodo root montato
      for (const n of nodes) {
        if (!n || !n.nodeType) continue;

        const list = CMSwift._cleanupRegistry.get(n) || [];
        for (const d of disposers) list.push(d);
        CMSwift._cleanupRegistry.set(n, list);
      }
    }

    // unmount: rimuove DOM e chiama cleanup
    const unmount = () => {
      for (const m of mounted) {
        // remove nodes
        for (const n of m.nodes) {
          if (n && n.parentNode === m.root) m.root.removeChild(n);
        }
        // cleanup (solo per la relativa istanza)
        for (const d of m.disposers) {
          try { d(); } catch (e) { console.error("[CMSwift.mount] dispose error:", e); }
        }
      }
    };

    return unmount;
  };

  // ===============================
  // Rod DevTools micro
  // ===============================
  CMSwift.rod = CMSwift.rod || {};

  CMSwift.rod.inspect = function (r, label = "rod") {
    if (!r || r.type !== "rod") {
      console.warn("[CMSwift.rod.inspect] non è un rod:", r);
      return null;
    }

    const bindings = typeof r.bindings === "function" ? r.bindings() : [];
    const info = {
      label,
      value: r.value,
      bindingsCount: bindings.length,
      bindings: bindings.map(b => ({
        key: b.key,
        // per non stampare l'intero elemento enorme, riassunto:
        el: b.el?.nodeType === 3 ? "#text" : b.el?.tagName,
        id: b.el?.id || null,
        className: b.el?.className || null,
        isConnected: b.el?.nodeType === 3 ? !!b.el.parentNode : (b.el?.isConnected ?? null)
      })),
      actionsCount: Array.isArray(r._actions) ? r._actions.length : null,
      disposed: !!r._disposed
    };

    // stampa carina
    if (CMSwift.config.debug) {
      console.groupCollapsed(`[CMSwift.rod.inspect] ${label}`);
      console.log(info);
      console.groupEnd();
    } else {
      console.log(info);
    }

    return info;
  };

  CMSwift.rod.inspectAll = function () {
    const all = CMSwift.rod._all ? Array.from(CMSwift.rod._all) : [];
    all.forEach((r, i) => CMSwift.rod.inspect(r, `rod#${i + 1}`));
    return all.length;
  };


  // ===============================
  // CMSwift.component (istanza con cleanup)
  // ===============================
  CMSwift.component = function (renderFn) {
    if (typeof renderFn !== "function") throw new Error("CMSwift.component: renderFn must be a function");

    // ritorna una factory: props -> { node(s), dispose }
    return function ComponentInstance(props = {}) {
      const disposers = [];

      const ctx = {
        onDispose(fn) {
          if (typeof fn === "function") disposers.push(fn);
        }
      };

      const out = renderFn(props, ctx);

      // supporta:
      // - Node / array / string/number
      // - { node, dispose }
      if (out && typeof out === "object" && "node" in out) {
        const userDispose = typeof out.dispose === "function" ? out.dispose : null;
        return {
          node: out.node,
          dispose: () => {
            if (userDispose) {
              try { userDispose(); } catch (e) { console.error("[component] dispose error:", e); }
            }
            for (const fn of disposers) {
              try { fn(); } catch (e) { console.error("[component] onDispose error:", e); }
            }
          }
        };
      }

      return {
        node: out,
        dispose: () => {
          for (const fn of disposers) {
            try { fn(); } catch (e) { console.error("[component] onDispose error:", e); }
          }
        }
      };
    };
  };

  // ===============================
  // Auto cleanup observer (opt-in)
  // ===============================
  CMSwift.enableAutoCleanup = function () {
    if (CMSwift._autoCleanupEnabled) return;
    CMSwift._autoCleanupEnabled = true;

    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        for (const node of m.removedNodes) {
          cleanupNodeTree(node);
        }
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    CMSwift._cleanupObserver = observer;
  };

  function cleanupNodeTree(node) {
    if (!node) return;

    // cleanup diretto
    const disposers = CMSwift._cleanupRegistry.get(node);
    if (disposers) {
      for (const d of disposers) {
        try { d(); } catch (e) { console.error("[cleanup] error:", e); }
      }
      CMSwift._cleanupRegistry.delete(node);
    }

    // cleanup figli
    if (node.childNodes && node.childNodes.length) {
      for (const child of node.childNodes) {
        cleanupNodeTree(child);
      }
    }
  }

  // ===============================
  // Debug utilities
  // ===============================
  CMSwift.debug = (() => {
    const counters = {
      rodFlushes: 0,
      rodNotifies: 0,
      rodBinds: 0,
      rodBindNull: 0,
      rodBindDup: 0,
    };

    function enabled() {
      return !!CMSwift.config.debug;
    }

    function log(...a) { if (enabled()) console.log("[CMSwift]", ...a); }
    function warn(...a) { if (enabled()) console.warn("[CMSwift]", ...a); }
    function error(...a) { console.error("[CMSwift]", ...a); } // error sempre

    function inc(name, by = 1) {
      if (!counters[name]) counters[name] = 0;
      counters[name] += by;
    }

    function stats() {
      // snapshot immutabile
      return { ...counters };
    }

    function reset() {
      for (const k of Object.keys(counters)) counters[k] = 0;
    }

    return { enabled, log, warn, error, inc, stats, reset };
  })();

  // ===============================
  // Performance DevTools
  // ===============================
  CMSwift.perf = (() => {
    let enabled = false;

    const counters = {
      effectsRun: 0,
      effectsSlow: 0,
      rodNotifies: 0,
      rodFlushes: 0,
      domWrites: 0,
      httpRequests: 0
    };

    const timeline = []; // {t,type,ms,meta}
    const slow = [];     // {ms, meta}

    const cfg = {
      timelineMax: 200,
      slowEffectMs: 8,   // soglia "lento"
    };

    function now() {
      return (typeof performance !== "undefined" && performance.now) ? performance.now() : Date.now();
    }

    function pushEvent(type, ms = 0, meta = null) {
      if (!enabled) return;
      timeline.push({ t: Date.now(), type, ms, meta });
      if (timeline.length > cfg.timelineMax) timeline.shift();
    }

    function inc(name, by = 1) {
      if (!enabled) return;
      counters[name] = (counters[name] || 0) + by;
    }

    function trackSlow(ms, meta) {
      if (!enabled) return;
      slow.push({ t: Date.now(), ms, meta });
      if (slow.length > 100) slow.shift();
    }

    // --- patch reactive.effect ---
    let _origEffect = null;

    function patchEffect() {
      if (_origEffect) return;
      _origEffect = CMSwift.reactive.effect;

      CMSwift.reactive.effect = function (fn, meta) {
        // meta opzionale (string/object) per identificare
        const wrapped = () => {
          const t0 = now();
          inc("effectsRun");
          try { return fn(); }
          finally {
            const dt = now() - t0;
            if (dt >= cfg.slowEffectMs) {
              inc("effectsSlow");
              trackSlow(dt, meta || fn.name || "effect");
              pushEvent("effect:slow", dt, meta || fn.name || null);
            } else {
              pushEvent("effect", dt, meta || fn.name || null);
            }
          }
        };
        return _origEffect(wrapped);
      };
    }

    function unpatchEffect() {
      if (_origEffect) {
        CMSwift.reactive.effect = _origEffect;
        _origEffect = null;
      }
    }

    // Public API
    function enable(on = true) {
      enabled = !!on;
      if (enabled) patchEffect();
      else unpatchEffect();
      return enabled;
    }

    function reset() {
      for (const k of Object.keys(counters)) counters[k] = 0;
      timeline.length = 0;
      slow.length = 0;
    }

    function stats() {
      return {
        enabled,
        ...counters,
        slowEffectMs: cfg.slowEffectMs,
        timelineSize: timeline.length
      };
    }

    function getTimeline() {
      return timeline.slice();
    }

    function slowEffects(minMs = cfg.slowEffectMs) {
      return slow.filter(x => x.ms >= minMs).slice().sort((a, b) => b.ms - a.ms);
    }

    // helper per misurare manualmente
    function time(label, fn) {
      const t0 = now();
      try { return fn(); }
      finally {
        const dt = now() - t0;
        pushEvent("time:" + label, dt, label);
      }
    }

    // hook utili da chiamare in rod/http
    function mark(type, meta) { pushEvent(type, 0, meta); }
    function tick(type, ms, meta) { pushEvent(type, ms, meta); }

    return {
      enable,
      reset,
      stats,
      timeline: getTimeline,
      slowEffects,
      time,
      mark,
      tick,
      inc,
      cfg
    };
  })();


  // ===============================
  // CMSwift.store v1 (persisted reactive state)
  // ===============================
  CMSwift.store = (() => {
    const config = {
      prefix: "CMSwift:",
      storage: "local", // "local" | "session"
      syncTabs: true,
      writeDelay: 0, // ms (0 = microtask)
    };

    const mem = new Map();          // key -> value (runtime cache)
    const watchers = new Map();     // key -> Set(fn)
    const pendingWrites = new Set();// key
    let writeQueued = false;

    function getStorage() {
      return config.storage === "session" ? window.sessionStorage : window.localStorage;
    }

    function fullKey(key) {
      return config.prefix + key;
    }

    function safeParse(str) {
      try { return JSON.parse(str); } catch { return undefined; }
    }

    function safeStringify(v) {
      try { return JSON.stringify(v); } catch { return undefined; }
    }

    function emit(key, value) {
      const set = watchers.get(key);
      if (!set) return;
      for (const fn of set) {
        try { fn(value); } catch (e) { console.error("[store] watcher error:", e); }
      }
    }

    function flushWrites() {
      writeQueued = false;
      const st = getStorage();
      for (const key of Array.from(pendingWrites)) {
        pendingWrites.delete(key);
        const v = mem.get(key);
        const s = safeStringify(v);
        if (s === undefined) continue;
        try { st.setItem(fullKey(key), s); }
        catch (e) { console.error("[store] write error:", e); }
      }
    }

    function scheduleWrite(key) {
      pendingWrites.add(key);
      if (writeQueued) return;
      writeQueued = true;

      if (config.writeDelay > 0) {
        setTimeout(flushWrites, config.writeDelay);
      } else {
        queueMicrotask(flushWrites);
      }
    }

    function readFromStorage(key) {
      const st = getStorage();
      const raw = st.getItem(fullKey(key));
      if (raw == null) return undefined;
      return safeParse(raw);
    }

    function get(key, fallback) {
      if (mem.has(key)) return mem.get(key);
      const v = readFromStorage(key);
      if (v !== undefined) {
        mem.set(key, v);
        return v;
      }
      return fallback;
    }

    function set(key, value) {
      mem.set(key, value);
      scheduleWrite(key);
      emit(key, value);
      return value;
    }

    function remove(key) {
      mem.delete(key);
      pendingWrites.delete(key);
      try { getStorage().removeItem(fullKey(key)); } catch { }
      emit(key, undefined);
    }

    function clear() {
      // rimuove solo chiavi col prefix
      const st = getStorage();
      const keys = [];
      for (let i = 0; i < st.length; i++) {
        const k = st.key(i);
        if (k && k.startsWith(config.prefix)) keys.push(k);
      }
      for (const k of keys) st.removeItem(k);

      mem.clear();
      pendingWrites.clear();
      watchers.clear();
    }

    function watch(key, fn) {
      if (typeof fn !== "function") return () => { };
      if (!watchers.has(key)) watchers.set(key, new Set());
      watchers.get(key).add(fn);
      return () => watchers.get(key)?.delete(fn);
    }

    // Signal persistente (core feature)
    function signal(key, initial, opts = {}) {
      const storageMode = opts.storage ?? config.storage; // per-signal override
      const prefix = opts.prefix ?? config.prefix;

      // per-signal config: usiamo un wrapper temporaneo
      const prevStorage = config.storage;
      const prevPrefix = config.prefix;
      config.storage = storageMode;
      config.prefix = prefix;

      // hydrate
      const hydrated = get(key, initial);
      const [getSig, setSig] = CMSwift.reactive.signal(hydrated);

      // quando cambia signal -> store
      CMSwift.reactive.effect(() => {
        const v = getSig();
        set(key, v);
      });

      // quando cambia store (cross-tab o set manuale) -> signal
      const unwatch = watch(key, (v) => {
        // evita loop inutili
        if (getSig() !== v) setSig(v);
      });

      // restore config
      config.storage = prevStorage;
      config.prefix = prevPrefix;

      // cleanup helper
      const dispose = () => unwatch();

      return [getSig, setSig, dispose];
    }

    // cross-tab sync
    if (config.syncTabs) {
      window.addEventListener("storage", (e) => {
        if (!e.key || !e.key.startsWith(config.prefix)) return;
        const key = e.key.slice(config.prefix.length);
        const v = e.newValue == null ? undefined : safeParse(e.newValue);

        // aggiorna cache + watchers (senza forzare write)
        if (v === undefined) mem.delete(key);
        else mem.set(key, v);

        emit(key, v);
      });
    }

    function configure(next = {}) {
      Object.assign(config, next);
    }

    function stats() {
      return {
        prefix: config.prefix,
        storage: config.storage,
        syncTabs: config.syncTabs,
        cacheSize: mem.size,
      };
    }

    return { configure, stats, get, set, remove, clear, watch, signal };
  })();

  // ===============================
  // 1) store.computed (derivato, non persistito)
  // ===============================
  CMSwift.store.computed = function (fn) {
    if (typeof fn !== "function") throw new Error("store.computed: fn must be a function");
    const [get, set] = CMSwift.reactive.signal(undefined);
    CMSwift.reactive.effect(() => {
      set(fn());
    });
    return get; // getter
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


  // ===============================
  // Plugin system (CMSwift.use)
  // ===============================
  CMSwift._plugins = new Set();

  CMSwift.use = function (plugin, options) {
    if (!plugin) return;

    // evita doppia installazione
    if (CMSwift._plugins.has(plugin)) {
      if (CMSwift.config?.debug) {
        console.warn("[CMSwift.use] plugin già installato:", plugin.name || plugin);
      }
      return;
    }

    // funzione-plugin
    if (typeof plugin === "function") {
      plugin(CMSwift, options);
      CMSwift._plugins.add(plugin);
      return;
    }

    // oggetto-plugin { install(app, opts) }
    if (plugin && typeof plugin.install === "function") {
      plugin.install(CMSwift, options);
      CMSwift._plugins.add(plugin);
      return;
    }

    console.warn("[CMSwift.use] plugin non valido:", plugin);
  };

  //-- RESTA come esempio --
  CMSwift.plugins = CMSwift.plugins || {};
  CMSwift.plugins.debug = {
    install(app) {
      app.config.debug = true;
      console.log("[CMSwift] Debug mode ON");
    }
  };

  CMSwift.plugins.router = {
    install(app, opts = {}) {
      if (opts.mode) app.router.setMode(opts.mode);
      if (opts.outlet) app.router.setOutlet(opts.outlet);
      if (opts.base) app.router.setBase(opts.base);
      app.router.start();
    }
  };
  // ===============================
  // Plugin Forms (validation + UX)
  // ===============================
  CMSwift.plugins.forms = {
    install(app) {
      const forms = {};

      app.forms = {
        validate(formEl, rules = {}, opts = {}) {
          if (typeof formEl === "string") formEl = app.dom.q(formEl);
          if (!formEl || !formEl.querySelectorAll) {
            console.warn("[forms.validate] form non valido:", formEl);
            return null;
          }

          const options = {
            mode: opts.mode || "input", // input | change | blur
            showMessages: opts.showMessages ?? true,
            submitGuard: opts.submitGuard ?? true,
            errorClass: opts.errorClass || "is-invalid",
            validClass: opts.validClass || "is-valid",
            messageClass: opts.messageClass || "form-error"
          };

          const fieldState = {}; // name -> { getErr, setErr }

          // setup fields
          for (const [name, rule] of Object.entries(rules)) {
            const els = formEl.querySelectorAll(`[name="${name}"]`);
            if (!els.length) continue;

            const [getErr, setErr] = app.reactive.signal(null);
            fieldState[name] = { getErr, setErr, els };

            // message node (uno per campo)
            let msgNode = null;
            if (options.showMessages) {
              msgNode = document.createElement("div");
              msgNode.className = options.messageClass;
              els[els.length - 1].after(msgNode);
            }

            const validateValue = () => {
              let value;
              const el = els[0];

              if (el.type === "checkbox") value = el.checked;
              else if (el.type === "radio") {
                const c = Array.from(els).find(r => r.checked);
                value = c ? c.value : null;
              } else value = el.value;

              let res = true;
              try {
                res = rule(value);
              } catch (e) {
                res = e.message || "Errore di validazione";
              }

              const error = res === true ? null : (typeof res === "string" ? res : "Valore non valido");
              setErr(error);
              return !error;
            };

            // bind events
            for (const el of els) {
              el.addEventListener(options.mode, validateValue);
            }

            // reactive UI
            app.reactive.effect(() => {
              const err = getErr();
              for (const el of els) {
                el.classList.toggle(options.errorClass, !!err);
                el.classList.toggle(options.validClass, !err);
              }
              if (msgNode) {
                msgNode.textContent = err || "";
                msgNode.style.display = err ? "block" : "none";
              }
            });

            // initial check
            validateValue();
          }

          // computed form validity
          const isValid = app.store.computed(() => {
            return Object.values(fieldState).every(f => !f.getErr());
          });

          // submit guard
          const onSubmit = (e) => {
            let ok = true;
            for (const f of Object.values(fieldState)) {
              const el = f.els[0];
              if (el) el.dispatchEvent(new Event(options.mode, { bubbles: true }));
              if (f.getErr()) ok = false;
            }
            if (!ok && options.submitGuard) {
              e.preventDefault();
              e.stopPropagation();
            }
          };

          if (options.submitGuard) {
            formEl.addEventListener("submit", onSubmit);
          }

          const dispose = () => {
            if (options.submitGuard) {
              formEl.removeEventListener("submit", onSubmit);
            }
          };

          forms[formEl] = { isValid, dispose };
          return { isValid, dispose };
        }
      };
    }
  };

  // ===============================
  // Auth Plugin (store + router guard)
  // Auth Plugin + Roles / Permissions
  // Auth Plugin (async + refresh token)
  // ===============================
  CMSwift.plugins.auth = {
    install(app, opts = {}) {
      const options = {
        key: opts.key || "auth",
        loginRoute: opts.loginRoute || "/login",
        protected: opts.protected || [],
        autoRedirect: opts.autoRedirect ?? true,

        // async config
        endpoints: opts.endpoints || {
          login: "/api/login",
          refresh: "/api/refresh",
          logout: "/api/logout"
        },

        fetchOptions: opts.fetchOptions || {},
        tokenHeader: opts.tokenHeader || "Authorization",
        tokenPrefix: opts.tokenPrefix || "Bearer ",

        refreshMargin: opts.refreshMargin || 30_000 // ms prima della scadenza
      };

      // ---------- STORE ----------
      const [getAuth, setAuth] = app.store.signal(options.key, null);

      const getUser = () => getAuth()?.user || null;
      const isAuth = () => !!getAuth()?.accessToken;

      // ---------- ROLES / PERMS ----------
      const roles = () => getUser()?.roles || [];
      const perms = () => getUser()?.permissions || [];

      const hasRole = (r) => roles().includes(r);
      const can = (p) => perms().includes(p);
      const canAny = (list) => list.some(x => hasRole(x) || can(x));
      const canAll = (list) => list.every(x => hasRole(x) || can(x));

      // ---------- INTERNAL STATE ----------
      let refreshing = false;
      let refreshQueue = [];

      // ---------- HELPERS ----------
      function needsRefresh() {
        const a = getAuth();
        if (!a?.expiresAt) return false;
        return Date.now() > (a.expiresAt - options.refreshMargin);
      }

      async function doRefresh() {
        if (refreshing) {
          return new Promise((res, rej) => refreshQueue.push({ res, rej }));
        }

        refreshing = true;

        try {
          const r = await fetch(options.endpoints.refresh, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken: getAuth()?.refreshToken })
          });

          if (!r.ok) throw new Error("Refresh failed");

          const data = await r.json();
          setAuth({ ...getAuth(), ...data });

          refreshQueue.forEach(q => q.res(true));
          refreshQueue = [];
          return true;

        } catch (e) {
          refreshQueue.forEach(q => q.rej(e));
          refreshQueue = [];
          setAuth(null);
          if (options.autoRedirect) app.router.navigate(options.loginRoute);
          throw e;

        } finally {
          refreshing = false;
        }
      }

      // ---------- ASYNC AUTH API ----------
      async function loginAsync(credentials) {
        const r = await fetch(options.endpoints.login, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(credentials)
        });

        if (!r.ok) throw new Error("Login failed");
        const data = await r.json();
        setAuth(data);
        return data;
      }

      async function logoutAsync() {
        try {
          await fetch(options.endpoints.logout, { method: "POST" });
        } catch { }
        setAuth(null);
        if (options.autoRedirect) app.router.navigate(options.loginRoute);
      }

      // ---------- AUTH FETCH ----------
      async function authFetch(url, opts = {}) {
        if (needsRefresh()) await doRefresh();

        const a = getAuth();
        const headers = new Headers(opts.headers || {});
        if (a?.accessToken) {
          headers.set(options.tokenHeader, options.tokenPrefix + a.accessToken);
        }

        const r = await fetch(url, { ...options.fetchOptions, ...opts, headers });

        if (r.status === 401 && getAuth()?.refreshToken) {
          await doRefresh();
          return authFetch(url, opts);
        }

        return r;
      }

      // ---------- ROUTER GUARD ----------
      app.router.beforeEach((ctx) => {
        const path = ctx.path;
        const protectedMatch = options.protected.some(p =>
          typeof p === "string"
            ? path.startsWith(p)
            : p instanceof RegExp
              ? p.test(path)
              : false
        );

        if (protectedMatch && !isAuth()) {
          return options.loginRoute;
        }
        return true;
      });

      // ---------- PUBLIC API ----------
      app.auth = {
        user: getUser,
        isAuth,
        hasRole,
        can,
        canAny,
        canAll,
        loginAsync,
        logoutAsync,
        fetch: authFetch
      };

      // ---------- HOOK ----------
      app.useAuth = function (ctx) {
        if (ctx && typeof ctx.onDispose === "function") {
          // future-proof
        }

        return app.auth;
      };

      // ===============================
      // Auth DevTools
      // ===============================
      (function attachAuthDevTools(app) {
        if (!app || !app.auth) return;

        const auth = app.auth;
        let tracing = false;

        function safeNow() { return Date.now(); }

        function decodeJWT(token) {
          if (!token || typeof token !== "string") return null;
          const parts = token.split(".");
          if (parts.length < 2) return null;
          try {
            const b64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
            const json = decodeURIComponent(
              atob(b64).split("").map(c => "%" + c.charCodeAt(0).toString(16).padStart(2, "0")).join("")
            );
            return JSON.parse(json);
          } catch {
            return null;
          }
        }

        function getAuthState() {
          // nel plugin async, lo stato è in store sotto key; ma auth espone user/isAuth/fetch.
          // Se hai accesso diretto a getAuth nel plugin, puoi agganciarlo qui.
          // Qui facciamo best-effort: cerchiamo store key "auth" o "user" non possiamo sapere.
          // Quindi: ci basiamo su auth.user() e (se esiste) auth._getState()
          if (typeof auth._getState === "function") return auth._getState();
          return { user: auth.user?.() ?? null };
        }

        function status() {
          const s = getAuthState();
          const user = s.user ?? auth.user?.();
          const name = user?.name || user?.email || user?.id || "anon";
          const ok = !!auth.isAuth?.();
          let exp = s.expiresAt || null;
          let left = null;
          if (exp) left = exp - safeNow();
          return ok
            ? `AUTH ✅ user=${name}${exp ? ` expiresIn=${Math.round(left / 1000)}s` : ""}`
            : `AUTH ❌ user=${name}`;
        }

        function inspect(label = "auth") {
          const s = getAuthState();
          const user = s.user ?? auth.user?.();

          const roles = user?.roles || [];
          const perms = user?.permissions || [];

          const accessToken = s.accessToken || null;
          const refreshToken = s.refreshToken || null;

          const jwt = accessToken ? decodeJWT(accessToken) : null;

          const expiresAt = s.expiresAt || (jwt?.exp ? jwt.exp * 1000 : null);
          const now = safeNow();
          const expiresInMs = expiresAt ? (expiresAt - now) : null;

          const info = {
            label,
            isAuth: !!auth.isAuth?.(),
            user,
            roles,
            permissions: perms,
            has: {
              role: (r) => !!auth.hasRole?.(r),
              can: (p) => !!auth.can?.(p)
            },
            token: {
              hasAccess: !!accessToken,
              hasRefresh: !!refreshToken,
              expiresAt,
              expiresInSec: expiresInMs == null ? null : Math.round(expiresInMs / 1000),
              decodedJWT: jwt
            }
          };

          console.groupCollapsed(`[CMSwift.auth.inspect] ${label}`);
          console.log("status:", status());
          console.log(info);
          if (expiresInMs != null) {
            if (expiresInMs <= 0) console.warn("⚠️ Access token scaduto.");
            else if (expiresInMs < 60_000) console.warn("⚠️ Access token in scadenza (<60s).");
          }
          console.groupEnd();

          return info;
        }

        // tracing: intercetta alcune funzioni se presenti
        function trace(on = true) {
          tracing = !!on;
          console.log("[CMSwift.auth.trace]", tracing ? "ON" : "OFF");
        }

        // wrapper fetch (se esiste) per loggare 401/refresh
        if (typeof auth.fetch === "function" && !auth._fetchWrapped) {
          const orig = auth.fetch.bind(auth);
          auth.fetch = async (...args) => {
            const res = await orig(...args);
            if (tracing) {
              try {
                const url = args[0];
                console.log("[auth.fetch]", res.status, url);
              } catch { }
            }
            return res;
          };
          auth._fetchWrapped = true;
        }

        // aggiungiamo metodi devtools
        auth.decodeJWT = decodeJWT;
        auth.status = status;
        auth.inspect = inspect;
        auth.trace = trace;

      })(CMSwift);
    }
  };

  // ===============================
  // HTTP (fetch wrapper)
  // ===============================
  function createHttpReactiveState() {
    const reactive = CMSwift.reactive;
    const [getInFlight, setInFlight] = reactive.signal(0);
    const [getStatus, setStatus] = reactive.signal("idle");
    const [getLastRequest, setLastRequest] = reactive.signal(null);
    const [getLastResponse, setLastResponse] = reactive.signal(null);
    const [getLastError, setLastError] = reactive.signal(null);
    const [getLastDuration, setLastDuration] = reactive.signal(0);
    const [getLastUpdated, setLastUpdated] = reactive.signal(0);
    let lastStartId = 0;

    function markStart(req) {
      const id = ++lastStartId;
      const ts = Date.now();
      setInFlight(getInFlight() + 1);
      setStatus("pending");
      setLastError(null);
      setLastResponse(null);
      setLastRequest({
        id,
        url: req.url,
        method: req.method,
        meta: req.meta,
        timeout: req.timeout,
        retry: req.retry,
        startedAt: ts
      });
      setLastUpdated(ts);
      return id;
    }

    function markEnd(id, res, err, durationMs) {
      const ts = Date.now();
      setInFlight(Math.max(0, getInFlight() - 1));
      if (id === lastStartId) {
        if (err) {
          setStatus("error");
          setLastError(err);
          setLastResponse(null);
        } else if (res) {
          setStatus("success");
          setLastError(null);
          setLastResponse({
            id,
            status: res.status,
            ok: res.ok,
            headers: res.headers,
            url: res.url,
            receivedAt: ts,
            raw: res
          });
        } else {
          setStatus("idle");
          setLastError(null);
          setLastResponse(null);
        }
        setLastDuration(Math.max(0, Number(durationMs || 0)));
      }
      setLastUpdated(ts);
    }

    const state = {
      inFlight: getInFlight,
      status: getStatus,
      isLoading: CMSwift.store?.computed
        ? CMSwift.store.computed(() => getInFlight() > 0)
        : () => getInFlight() > 0,
      lastRequest: getLastRequest,
      lastResponse: getLastResponse,
      lastError: getLastError,
      lastDuration: getLastDuration,
      lastUpdated: getLastUpdated,
      reset() {
        setInFlight(0);
        setStatus("idle");
        setLastRequest(null);
        setLastResponse(null);
        setLastError(null);
        setLastDuration(0);
        setLastUpdated(Date.now());
      }
    };

    return { state, markStart, markEnd };
  }
  const configHTTP = {
    baseURL: CMSwift_setting?.http?.baseURL || "",
    timeout: CMSwift_setting?.http?.timeout ?? 0, // ms, 0 = no timeout
    retry: CMSwift_setting?.http?.retry || { attempts: 0, delay: 250, factor: 2 }, // attempts extra
    headers: CMSwift_setting?.http?.headers || {},
    credentials: CMSwift_setting?.http?.credentials, // "include" etc (optional)
    debug: CMSwift_setting?.debug ?? false
  };
  const httpState = createHttpReactiveState();
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

  CMSwift.http = {};
  CMSwift.http.request = () => request;
  CMSwift.http.state = () => httpState;
  CMSwift.http.get = (url, init) => request(url, { ...init, method: "GET" });
  CMSwift.http.del = (url, init) => request(url, { ...init, method: "DELETE" });
  CMSwift.http.post = (url, body, init) => withJSON("POST", url, body, init);
  CMSwift.http.put = (url, body, init) => withJSON("PUT", url, body, init);
  CMSwift.http.patch = (url, body, init) => withJSON("PATCH", url, body, init);

  CMSwift.http.getJSON = (url, init) => request(url, { ...init, method: "GET" }).jsonStrict();
  CMSwift.http.delJSON = (url, init) => request(url, { ...init, method: "DELETE" }).jsonStrict();
  CMSwift.http.postJSON = (url, body, init) => withJSON("POST", url, body, init).jsonStrict();
  CMSwift.http.putJSON = (url, body, init) => withJSON("PUT", url, body, init).jsonStrict();
  CMSwift.http.patchJSON = (url, body, init) => withJSON("PATCH", url, body, init).jsonStrict();

  CMSwift.http.onBefore = function (fn) { hooksHTTP.beforeRequest.add(fn); return () => hooksHTTP.beforeRequest.delete(fn); };
  CMSwift.http.onAfter = function (fn) { hooksHTTP.afterResponse.add(fn); return () => hooksHTTP.afterResponse.delete(fn); };
  CMSwift.http.onError = function (fn) { hooksHTTP.onError.add(fn); return () => hooksHTTP.onError.delete(fn); };

  // shortcuts per browser global
  window._http = CMSwift.http;
  // ===============================
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
  CMSwift.ui = CMSwift.ui || {};
  CMSwift.ui.meta = CMSwift.ui.meta || {};

  window._ui = CMSwift.ui;

  CMSwift.ui.slot = function slot(value, opts = {}) {
    const UI = CMSwift.ui;
    const {
      as = "node",          // "node" | "text" | "icon"
      wrap = "span",        // "span" | "text" | null
      iconProps = null,     // props extra per UI.Icon
      filter = true         // filtra null/false
    } = opts;

    const makeTextNode = (v) => document.createTextNode(String(v));
    const makeSpan = (v) => _h.span(String(v));

    const normalizeOne = (v) => {
      if (v == null || v === false) return null;

      // function: IMPORTANT -> non eseguire qui (serve reattività)
      if (typeof v === "function") return v;

      // array: flatten
      if (Array.isArray(v)) return v.flatMap(normalizeOne).filter(Boolean);

      // DOM Node
      if (v && typeof v === "object" && v.nodeType) return v;

      // primitive
      if (typeof v === "string" || typeof v === "number" || typeof v === "boolean") {
        const s = String(v);

        if (as === "icon" && UI.Icon) {
          // se vuoi: allow "tabler:plus" o simili
          return UI.Icon(s, { class: "cms-slot-icon", ...(iconProps || {}) });
        }

        if (wrap === "text") return makeTextNode(s);
        if (wrap === "span") return makeSpan(s);
        return s; // lascia stringa nativa (se il tuo _h la gestisce)
      }

      // fallback: stringify
      if (wrap === "text") return makeTextNode(v);
      if (wrap === "span") return makeSpan(v);
      return String(v);
    };

    const out = normalizeOne(value);
    if (!filter) return out;

    // out può essere null, function, node, string, oppure array
    if (Array.isArray(out)) return out.filter(Boolean);
    return out;
  };
  CMSwift.ui.slots = function slots(...values) {
    const out = [];
    for (const v of values) {
      const r = CMSwift.ui.slot(v);
      if (!r) continue;
      if (Array.isArray(r)) out.push(...r);
      else out.push(r);
    }
    return out;
  };
  // DocTable genera una tabella di documentazione

  CMSwift.ui.DocTable = (name) => {
    if (!CMSwift.isDev()) return _h.div(); // non fa niente in prod

    const meta = CMSwift.ui.meta?.[name];
    if (!meta) return _h.div({ class: "cms-muted" }, `Meta non trovata: ${name}`);

    const propsRows = Object.entries(meta.props || {}).map(([k, v]) =>
      _h.tr(_h.td(_h.code(k)), _h.td(_h.code(String(v))))
    );

    const eventsRows = (meta.events || []).map(ev =>
      _h.tr(_h.td(_h.code(ev)), _h.td(_h.span("DOM event")))
    );

    let slotsRows = [];
    if (meta.slots) {
      if (Array.isArray(meta.slots)) {
        slotsRows = meta.slots.map((slot) =>
          _h.tr(_h.td(_h.code(String(slot))), _h.td(_h.span("Slot")))
        );
      } else {
        slotsRows = Object.entries(meta.slots || {}).map(([k, v]) =>
          _h.tr(_h.td(_h.code(k)), _h.td(_h.span(String(v))))
        );
      }
    }

    return CMSwift.ui.Card(
      _h.h3(`UI.${name}`),
      meta.description ? _h.p({ class: "cms-muted" }, meta.description) : null,
      meta.signature ? _h.p({ class: "cms-muted" }, meta.signature) : null,

      _h.h4("Props"),
      _h.table({ class: "cms-table" },
        _h.thead(_h.tr(_h.th("Name"), _h.th("Type"))),
        _h.tbody(...propsRows)
      ),

      _h.h4({ style: { marginTop: "14px" } }, "Events"),
      _h.table({ class: "cms-table" },
        _h.thead(_h.tr(_h.th("Event"), _h.th("Notes"))),
        _h.tbody(...eventsRows)
      ),

      slotsRows.length ? _h.h4({ style: { marginTop: "14px" } }, "Slots") : null,
      slotsRows.length ? _h.table({ class: "cms-table" },
        _h.thead(_h.tr(_h.th("Name"), _h.th("Notes"))),
        _h.tbody(...slotsRows)
      ) : null,

      meta.returns ? _h.p({ class: "cms-muted", style: { marginTop: "14px" } }, `Returns: ${meta.returns}`) : null
    );
  };

  CMSwift.ui.inspect = (name) => console.log(CMSwift.ui.meta?.[name] || "meta not found");

  CMSwift.ui.can = function (ctx, permOrRole, render, elseRender = null) {
    const auth = CMSwift.useAuth ? CMSwift.useAuth(ctx) : CMSwift.auth;
    if (!auth) return typeof elseRender === "function" ? elseRender() : null;

    const ok =
      typeof permOrRole === "function"
        ? !!permOrRole(auth)
        : (auth.can?.(permOrRole) || auth.hasRole?.(permOrRole));

    if (ok) return typeof render === "function" ? render() : render;
    return typeof elseRender === "function" ? elseRender() : elseRender;
  };

  CMSwift.ui.canAny = function (ctx, list, render, elseRender = null) {
    const auth = CMSwift.useAuth ? CMSwift.useAuth(ctx) : CMSwift.auth;
    const ok = !!auth?.canAny?.(list);
    return ok ? (typeof render === "function" ? render() : render)
      : (typeof elseRender === "function" ? elseRender() : elseRender);
  };

  CMSwift.ui.canAll = function (ctx, list, render, elseRender = null) {
    const auth = CMSwift.useAuth ? CMSwift.useAuth(ctx) : CMSwift.auth;
    const ok = !!auth?.canAll?.(list);
    return ok ? (typeof render === "function" ? render() : render)
      : (typeof elseRender === "function" ? elseRender() : elseRender);
  };

  // ===============================
  // Can component (hyperscript-friendly)
  // ===============================
  CMSwift.Can = function Can(props, ctx) {
    const auth = CMSwift.useAuth ? CMSwift.useAuth(ctx) : CMSwift.auth;

    const pred = () => {
      if (!auth) return false;
      if (props.when && typeof props.when === "function") return !!props.when(auth);
      if (props.perm) return !!auth.can?.(props.perm);
      if (props.role) return !!auth.hasRole?.(props.role);
      if (props.any) return !!auth.canAny?.(props.any);
      if (props.all) return !!auth.canAll?.(props.all);
      return false;
    };

    return pred()
      ? (typeof props.then === "function" ? props.then() : props.then ?? null)
      : (typeof props.else === "function" ? props.else() : props.else ?? null);
  };

  // -- ROUTER --
  CMSwift.router = (() => {
    let mode = "history"; // "history" | "hash" | "auto"
    let routes = [];
    let outlet = null;
    let unmountCurrent = null;
    let base = "";
    let beforeHook = null;

    // --- Router DevTools state ---
    let _currentCtx = null;
    let _history = [];
    let _tracing = false;

    const meta = {
      setOutlet: { description: "imposta il contenitore del router" },
      setBase: { description: "imposta il base path del router" },
      add: { description: "per aggiungere la route" },
      notFound: { description: "imposta la view 404" },
      beforeEach: { description: "hook prima di ogni navigazione" },
      start: { description: "avvia il router" },
      navigate: { description: "naviga verso una route" },
      subscribe: { description: "sottoscrive agli aggiornamenti di route" },
      current: { description: "ritorna l'URL corrente" },
      isActive: { description: "verifica se una route è attiva" },
      status: { description: "stringa di stato router" },
      inspect: { description: "stampa info diagnostiche" },
      trace: { description: "abilita/disabilita tracing" },
      history: { description: "ritorna la history interna" },
      setURLOnly: { description: "aggiorna solo l'URL del browser senza render/meta" }
    };

    function setURLOnly(urlLike, { replace = false } = {}) {
      const url = typeof urlLike === "string" ? new URL(urlLike, window.location.origin) : urlLike;
      const fullPath = url.pathname + url.search + url.hash;

      if (mode === "hash" || mode === "auto") {
        if (history.pushState) {
          const h = "#" + fullPath;
          if (replace) history.replaceState({}, "", h);
          else history.pushState({}, "", h);
          return;
        }
        const h = "#" + fullPath;
        if (replace) window.location.replace(h);
        else window.location.hash = h;
        return;
      }

      if (replace) history.replaceState({}, "", base + fullPath);
      else history.pushState({}, "", base + fullPath);
    }


    function getCurrentURL() {
      if (mode === "hash") {
        const h = window.location.hash || "#/";
        const url = h.startsWith("#") ? h.slice(1) : h;
        return new URL(url, window.location.origin);
      }

      // auto
      if (mode === "auto") {
        if (window.location.hash.startsWith("#/")) {
          const url = window.location.hash.slice(1);
          return new URL(url, window.location.origin);
        }
      }

      return new URL(window.location.href);
    }

    function updateURL(url, replace = false) {
      if (mode === "hash" || (mode === "auto" && !history.pushState)) {
        const h = "#" + (url.pathname + url.search + url.hash);
        if (replace) {
          window.location.replace(h);
        } else {
          window.location.hash = h;
        }
        return;
      }

      if (replace) history.replaceState({}, "", base + url.pathname + url.search + url.hash);
      else history.pushState({}, "", base + url.pathname + url.search + url.hash);
    }

    function setMode(m) {
      mode = m || "history";
    }

    function normalizePath(path) {
      // garantisce leading slash e rimuove trailing slash (tranne root)
      if (!path) return "/";
      if (!path.startsWith("/")) path = "/" + path;
      if (path.length > 1 && path.endsWith("/")) path = path.slice(0, -1);
      return path;
    }

    function stripBase(path) {
      if (base && path.startsWith(base)) {
        const p = path.slice(base.length) || "/";
        return normalizePath(p);
      }
      return normalizePath(path);
    }

    function compilePattern(pattern) {
      // "/users/:id" -> regex + keys
      pattern = normalizePath(pattern);
      const keys = [];
      const regexStr = pattern
        .replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1") // escape regex
        .replace(/\\\/:([A-Za-z0-9_]+)/g, (_, k) => {
          keys.push(k);
          return "\\/([^\\/]+)";
        });
      const regex = new RegExp("^" + regexStr + "$");
      return { pattern, regex, keys };
    }

    function parseQuery(search) {
      const q = {};
      const sp = new URLSearchParams(search || "");
      sp.forEach((v, k) => {
        if (q[k] === undefined) q[k] = v;
        else if (Array.isArray(q[k])) q[k].push(v);
        else q[k] = [q[k], v];
      });
      return q;
    }

    function flattenRoutes() {
      const all = [];
      for (const r of routes) {
        all.push({ ...r, _parent: null });
        if (r.children && r.children.length) {
          for (const c of r.children) {
            all.push({ ...c, _parent: r });
          }
        }
      }
      // ordina: più specifiche prima (path più lungo)
      all.sort((a, b) => b.path.length - a.path.length);
      return all;
    }

    function match(pathname) {
      const path = normalizePath(pathname);
      const all = flattenRoutes();

      for (const r of all) {
        const m = r._compiled.regex.exec(path);
        if (!m) continue;

        const params = {};
        r._compiled.keys.forEach((k, i) => (params[k] = decodeURIComponent(m[i + 1])));

        return { route: r, params, parent: r._parent || null };
      }
      return null;
    }

    function isActive(path) {
      if (!path) return false;
      const currentPath = _currentCtx ? _currentCtx.path : stripBase(getCurrentURL().pathname);
      let pathname = path;

      if (typeof pathname === "string" && (pathname.includes("?") || pathname.includes("#") || pathname.includes("://"))) {
        pathname = new URL(pathname, window.location.origin).pathname;
      }

      const target = stripBase(pathname);
      if (!target.includes(":")) return target === currentPath;
      const compiled = compilePattern(target);
      return compiled.regex.test(currentPath);
    }

    async function render(urlLike, { replace = false } = {}) {
      if (_tracing) {
        console.log("[router.navigate]", url.toString());
      }
      if (!outlet) {
        console.warn("[router] outlet non impostato. Usa CMSwift.router.setOutlet('#app').");
        return;
      }

      const url = typeof urlLike === "string" ? new URL(urlLike, window.location.origin) : urlLike;
      const fullPath = url.pathname + url.search + url.hash;

      // aggiorna address bar
      if (replace) history.replaceState({}, "", base + fullPath);
      else history.pushState({}, "", base + fullPath);

      updateURL(url, replace);

      const pathname = stripBase(url.pathname);
      const m = match(pathname);

      const ctx = {
        path: pathname,
        fullPath,
        params: m ? m.params : {},
        query: parseQuery(url.search),
        hash: url.hash || "",
        navigate, // per navigare dentro view
        outlet
      };

      // beforeEach (redirect/block)
      if (beforeHook) {
        const res = await beforeHook(ctx);
        if (res === false) return;          // blocca
        if (typeof res === "string") {      // redirect
          navigate(res, { replace: true });
          return;
        }
      }

      // unmount view precedente
      if (typeof unmountCurrent === "function") {
        try { unmountCurrent(); } catch (e) { console.error("[router] unmount error:", e); }
        unmountCurrent = null;
      }

      // 404
      if (!m) {
        const view404 = routes._notFound;
        if (view404) {
          unmountCurrent = CMSwift.mount(outlet, () => view404(ctx), { clear: true });
        } else {
          unmountCurrent = CMSwift.mount(outlet, _h.div("404"), { clear: true });
        }
        return;
      }

      // mount view matchata
      // mount view matchata (supporta nested)
      const view = m.route.view;
      const parent = m.parent; // se esiste, questa route è child
      let childMounted = null;

      ctx.renderChild = (target) => {
        if (!ctx._child) return null;

        const childOutlet = typeof target === "string" ? ctx.outlet.querySelector(target) : target;
        if (!childOutlet) {
          console.warn("[router] child outlet non trovato:", target);
          return null;
        }

        // monta child (clear true)
        childMounted = CMSwift.mount(childOutlet, () => ctx._child.view(ctx._child.ctx), { clear: true });
        return childMounted;
      };

      if (parent) {
        // nested: render layout (parent.view) e prepara child
        const childRoute = m.route;

        // ctx child separato (stessi query/hash, params merged)
        const childCtx = {
          ...ctx,
          params: { ...ctx.params }, // include già i params del child match (per come matcha)
        };

        ctx._child = {
          view: childRoute.view,
          ctx: childCtx
        };

        // mount layout sul root outlet
        unmountCurrent = CMSwift.mount(outlet, () => parent.view(ctx), { clear: true });

      } else {
        // non nested
        ctx._child = null;
        unmountCurrent = CMSwift.mount(outlet, () => view(ctx), { clear: true });
      }

      notifyRoute(ctx);
      // devtools state update
      _currentCtx = ctx;
      _history.push({
        at: Date.now(),
        path: ctx.path,
        params: ctx.params,
        query: ctx.query,
        hash: ctx.hash
      });
      if (_history.length > 50) _history.shift(); // cap

    }

    function navigate(to, opts = {}) {
      const url = new URL(to, window.location.origin);
      render(url, opts);
    }

    function start() {
      // back/forward
      window.addEventListener("popstate", () => {
        render(getCurrentURL(), { replace: true });
      });

      window.addEventListener("hashchange", () => {
        if (mode === "hash" || mode === "auto") {
          render(getCurrentURL(), { replace: true });
        }
      });



      // click interception su <a>
      document.addEventListener("click", (e) => {
        const a = e.target?.closest?.("a");
        if (!a) return;

        // rispetta:
        // - new tab / middle click / ctrl/cmd
        if (e.defaultPrevented) return;
        if (e.button !== 0) return;
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

        // rispetta download/target
        if (a.hasAttribute("download")) return;
        if (a.target && a.target !== "_self") return;

        const href = a.getAttribute("href");
        if (!href || href.startsWith("mailto:") || href.startsWith("tel:")) return;

        // esterno
        const url = new URL(href, window.location.origin);
        if (url.origin !== window.location.origin) return;

        // hash-only (stessa pagina)
        // se vuoi gestirlo, puoi farlo qui; per ora: lasciamo default se non cambia path
        const current = new URL(window.location.href);
        const samePath = (url.pathname + url.search) === (current.pathname + current.search);
        if (samePath && url.hash) return;

        // prevent e navigate
        e.preventDefault();
        navigate(url.pathname + url.search + url.hash);
      });

      // render iniziale
      render(getCurrentURL(), { replace: true });
    }

    function setOutlet(target) {
      outlet = typeof target === "string" ? CMSwift.dom.q(target) : target;
      return outlet;
    }

    function setBase(b) {
      base = b ? normalizePath(b) : "";
      // base dovrebbe essere "" oppure "/qualcosa"
      if (base === "/") base = "";
    }

    function add(path, view, children = null) {
      const compiled = compilePattern(path);
      const record = { path: compiled.pattern, view, _compiled: compiled, children: [] };

      if (Array.isArray(children)) {
        // children: array di [subPath, subView] o [subPath, subView, subChildren]
        for (const c of children) {
          const [subPath, subView, subChildren] = c;
          // child path relativo al parent
          const full = normalizePath(compiled.pattern + "/" + (subPath || "").replace(/^\//, ""));
          record.children.push({
            path: full,
            view: subView,
            _compiled: compilePattern(full),
            children: Array.isArray(subChildren) ? subChildren : []
          });
        }
      }

      routes.push(record);
    }


    function notFound(view) {
      routes._notFound = view;
    }

    function beforeEach(fn) {
      beforeHook = fn;
    }

    // --- Router reactive state ---
    let _routeListeners = new Set();

    function notifyRoute(ctx) {
      if (_history.length > 50) _history.shift(); // cap
      for (const fn of _routeListeners) {
        try { fn(ctx); } catch (e) { console.error("[router] listener error:", e); }
      }
    }


    // ===============================
    // Router DevTools
    // ===============================
    function routeStatus() {
      if (!_currentCtx) return "ROUTER ⏳ not ready";
      const q = Object.keys(_currentCtx.query || {}).length ? "?" : "";
      return `ROUTER ${_currentCtx.path}${q} ${_currentCtx.hash || ""
        }`;
    }

    function routeInspect(label = "router") {
      if (!_currentCtx) {
        console.warn("[router.inspect] nessuna route attiva");
        return null;
      }

      const info = {
        label,
        mode: typeof mode !== "undefined" ? mode : "unknown",
        base,
        path: _currentCtx.path,
        params: _currentCtx.params,
        query: _currentCtx.query,
        hash: _currentCtx.hash,
        outlet,
        timestamp: new Date().toISOString()
      };

      console.groupCollapsed(`[CMSwift.router.inspect] ${label}`);
      console.log(info);
      console.log("history:", _history.slice());
      console.groupEnd();

      return info;
    }

    function routeTrace(on = true) {
      _tracing = !!on;
      console.log("[CMSwift.router.trace]", _tracing ? "ON" : "OFF");
    }

    function routeHistory() {
      return _history.slice();
    }


    return {
      meta,
      setOutlet, setBase, add, setURLOnly, notFound, beforeEach, start, navigate, isActive, subscribe(fn) {
        _routeListeners.add(fn);
        return () => _routeListeners.delete(fn);
      },
      current() {
        return getCurrentURL ? getCurrentURL() : new URL(window.location.href);
      },
      status: routeStatus,
      inspect: routeInspect,
      trace: routeTrace,
      history: routeHistory
    };
  })();

  if (CMSwift.config?.debug) {
    window.$router = CMSwift.router;
  }

})();
