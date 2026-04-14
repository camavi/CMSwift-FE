  /* ===============================
     Renderer args parser
     =============================== */

  function applyRendererArgs(args, options = {}) {
    const {
      el,
      isRod = () => false,
      interpolationCursor = null,
      appendChildValue = () => { },
      appendRodText = () => { },
      appendInterpolatedText = () => { },
      appendDynamicChild = () => { },
      bindProp = () => { }
    } = options;

    for (const arg of args) {
      if (arg == null) continue;

      if (Array.isArray(arg)) {
        appendChildValue(arg);
        continue;
      }

      if (typeof arg === "string") {
        const segments = takeInterpolatedSegments(arg, interpolationCursor);
        if (segments) appendInterpolatedText(segments);
        else el.appendChild(document.createTextNode(arg));
        continue;
      }

      if (typeof arg === "number") {
        el.appendChild(document.createTextNode(String(arg)));
        continue;
      }

      if (typeof arg === "function") {
        appendDynamicChild(arg);
        continue;
      }

      if (isRod(arg)) {
        appendRodText(arg);
        continue;
      }

      if (arg.nodeType) {
        el.appendChild(arg);
        continue;
      }

      if (typeof arg === "object") {
        for (const [key, value] of Object.entries(arg)) {
          if (typeof value === "string") {
            const segments = takeInterpolatedSegments(value, interpolationCursor);
            if (segments) {
              bindProp(key, () => renderInterpolatedSegments(segments));
              continue;
            }
          }
          if (key === "class") {
            bindProp(key, value);
            continue;
          }
          if (key === "style" && typeof value === "object" && value !== null && !isRod(value)) {
            bindProp(key, value);
            continue;
          }
          bindProp(key, value);
        }
      }
    }
  }
