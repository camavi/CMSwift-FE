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

  function isContentProp(key) {
    return key === "innerHTML" || key === "innerText" || key === "textContent" || key === "value";
  }

  function createElement(tag, ...args) {
    const isSVG = SVG_TAGS.has(tag);
    const el = tag === "text" && !isSVG
      ? document.createTextNode("")
      : isSVG
        ? document.createElementNS(SVG_NS, tag)
        : document.createElement(tag);

    const isRod = (v) => !!v && v.type === "rod";
    const interpolationCursor = createRodInterpolationCursor();
    const childHelpers = createRendererChildHelpers(el, { isRod, interpolationCursor });
    const {
      appendRodText,
      appendInterpolatedText,
      appendDynamicChild,
      appendChildValue
    } = childHelpers;
    const domBridge = createDomPropBridge(el, { isSVG, normalizeClass, isContentProp });
    const {
      isBooleanDomProp,
      setStyleEntry,
      setProp,
      setClassValue
    } = domBridge;

    function bindProp(key, value) {
      if (isEventProp(key)) {
        bindEventProp(el, key, value, isRod);
        return;
      }
      if (key === "class") {
        if (hasDynamicClassValue(value)) {
          CMSwift.reactive.effect(() => {
            setClassValue(normalizeClass(value));
          });
          return;
        }
        setClassValue(normalizeClass(value));
        return;
      }
      if (key === "style" && value && typeof value === "object") {
        const styleApplier = createStyleObjectApplier(setStyleEntry);
        if (hasDynamicStyleValue(value, isRod)) {
          CMSwift.reactive.effect(() => {
            styleApplier.apply(value, isRod);
          });
          return;
        }
        styleApplier.apply(value, isRod);
        return;
      }
      if (key === "style" && (typeof value === "function" || isRod(value))) {
        const styleApplier = createStyleObjectApplier(setStyleEntry);
        CMSwift.reactive.effect(() => {
          styleApplier.apply(value, isRod);
        });
        return;
      }
      if (typeof value === "function") {
        CMSwift.reactive.effect(() => {
          setProp(key, value());
        });
        return;
      }
      if (key === "value" && isRod(value) && tag === "input") {
        CMSwift.reactive.effect(() => {
          const next = value.value ?? "";
          if (el.value !== String(next)) setProp("value", next);
        });
        el.addEventListener("input", () => {
          const next = el.value;
          if (value.value !== next) value.value = next;
        });
        return;
      }
      if (isContentProp(key) && isRod(value)) {
        CMSwift.reactive.effect(() => {
          setProp(key, value.value);
        });
        return;
      }
      if (isRod(value)) {
        CMSwift.rodBind(el, value, { key });
        return;
      }
      setProp(key, value);
    }

    applyRendererArgs(args, {
      el,
      isRod,
      interpolationCursor,
      appendChildValue,
      appendRodText,
      appendInterpolatedText,
      appendDynamicChild,
      bindProp
    });

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
    window._[tag] = (...args) => createElement(tag, ...args);
  });

  _.fragment = (...children) => children;
  _.dynamic = function (renderFn) {
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
