  /* ===============================
     Shared DOM prop bridge
     =============================== */

  function createDomPropBridge(el, options = {}) {
    const {
      isSVG = false,
      normalizeClass: normalizeClassValue = (value) => String(value ?? ""),
      isContentProp: isContent = () => false,
      autoValueTags = new Set(["INPUT", "TEXTAREA", "SELECT"])
    } = options;

    function isBooleanDomProp(name) {
      if (isSVG || !(name in el)) return false;
      try {
        return typeof el[name] === "boolean";
      } catch {
        return false;
      }
    }

    function isAttributeOnlyProp(name) {
      return isSVG || name.startsWith("data-") || name.startsWith("aria-") || !(name in el);
    }

    function setAttributeValue(name, value) {
      if (value == null) {
        el.removeAttribute(name);
        return;
      }
      if (value === false) {
        if (name.startsWith("aria-")) {
          el.setAttribute(name, "false");
          return;
        }
        el.removeAttribute(name);
        return;
      }
      if (value === true && !isSVG && !name.startsWith("aria-") && !name.startsWith("data-")) {
        el.setAttribute(name, "");
        return;
      }
      el.setAttribute(name, String(value));
    }

    function setStyleEntry(name, value) {
      if (name == null) return;
      const styleName = String(name);
      const isCssProperty = styleName.startsWith("--") || styleName.includes("-");
      if (value == null || value === false || value === "") {
        if (isCssProperty) el.style.removeProperty(styleName);
        else el.style[styleName] = "";
        return;
      }
      if (isCssProperty) {
        el.style.setProperty(styleName, String(value));
        return;
      }
      el.style[styleName] = value;
    }

    function setClassValue(value) {
      const normalized = normalizeClassValue(value);
      if (normalized == null || normalized === false || normalized === "") {
        el.removeAttribute("class");
        return;
      }
      el.setAttribute("class", String(normalized));
    }

    function setBooleanProp(name, value) {
      const next = !!value;
      el[name] = next;
      if (next) el.setAttribute(name, "");
      else el.removeAttribute(name);
    }

    function removeProp(name) {
      if (isContent(name)) {
        el[name] = "";
        return;
      }
      if (name === "class") {
        el.removeAttribute("class");
        return;
      }
      if (name === "style") {
        el.removeAttribute("style");
        return;
      }
      if (isBooleanDomProp(name)) {
        try { el[name] = false; } catch { }
        el.removeAttribute(name);
        return;
      }
      el.removeAttribute(name);
      if (!isAttributeOnlyProp(name)) {
        try {
          if (typeof el[name] === "string") el[name] = "";
        } catch { }
      }
    }

    function applyStyleObject(styleObj) {
      if (!styleObj || typeof styleObj !== "object") return;
      Object.entries(styleObj).forEach(([styleName, styleValue]) => {
        setStyleEntry(styleName, styleValue);
      });
    }

    function setProp(name, value) {
      if (isContent(name)) {
        el[name] = value ?? "";
        return;
      }
      if (name === "class") {
        setClassValue(value);
        return;
      }
      if (name === "style") {
        if (value == null || value === false) {
          removeProp(name);
          return;
        }
        if (typeof value === "object") {
          applyStyleObject(value);
          return;
        }
      }
      if (isBooleanDomProp(name)) {
        setBooleanProp(name, value);
        return;
      }
      if (value == null || value === false) {
        removeProp(name);
        return;
      }
      if (isAttributeOnlyProp(name)) {
        setAttributeValue(name, value);
        return;
      }
      el[name] = value;
    }

    function setPathValue(path, value) {
      const parts = String(path).split(".");
      let obj = el;
      for (let i = 0; i < parts.length - 1; i++) {
        obj = obj?.[parts[i]];
        if (!obj) return;
      }
      obj[parts[parts.length - 1]] = value;
    }

    function isBindingValueKey(name) {
      if (!name) return false;
      return name === "auto"
        || name.startsWith("attr:")
        || name.startsWith("@")
        || name.startsWith("style.")
        || name.includes(".");
    }

    function applyBindingValue(name, value) {
      if (!name || name === "auto") {
        if (autoValueTags.has(el.tagName)) {
          setProp("value", value);
        } else {
          el.textContent = value ?? "";
        }
        return;
      }

      if (name.startsWith("attr:")) {
        setAttributeValue(name.slice(5), value);
        return;
      }

      if (name.startsWith("@")) {
        setAttributeValue(name.slice(1), value);
        return;
      }

      if (name.startsWith("style.")) {
        setStyleEntry(name.slice(6), value);
        return;
      }

      if (name.includes(".")) {
        setPathValue(name, value);
        return;
      }

      setProp(name, value);
    }

    return {
      isBooleanDomProp,
      isAttributeOnlyProp,
      isBindingValueKey,
      setAttributeValue,
      setStyleEntry,
      setClassValue,
      setBooleanProp,
      removeProp,
      applyStyleObject,
      setProp,
      setPathValue,
      applyBindingValue
    };
  }
