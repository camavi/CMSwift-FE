  // alias per compatibilità
  CMSwift.signal = CMSwift.reactive.signal;
  CMSwift.effect = CMSwift.reactive.effect;
  CMSwift.computed = CMSwift.reactive.computed;
  CMSwift.untracked = CMSwift.reactive.untracked;
  CMSwift.batch = CMSwift.reactive.batch;

  function normalizeThemeName(theme) {
    if (theme == null) return null;
    const value = String(theme).trim();
    return value || null;
  }

  function normalizeThemeList(input) {
    const values = Array.isArray(input)
      ? input
      : typeof input === "string"
        ? input.split(",")
        : [];
    const out = [];
    const seen = new Set();
    for (const item of values) {
      const value = normalizeThemeName(item);
      if (!value || seen.has(value)) continue;
      seen.add(value);
      out.push(value);
    }
    return out;
  }

  function getThemeRoot() {
    if (typeof document !== "undefined" && document.documentElement) {
      return document.documentElement;
    }
    return CMSwift.dom?.q ? CMSwift.dom.q("html") : null;
  }

  function getThemeStorage() {
    try {
      return typeof globalThis !== "undefined" ? globalThis.localStorage || null : null;
    } catch (_error) {
      return null;
    }
  }

  function getThemeStorageKey() {
    return normalizeThemeName(CMSwift.theme?.storageKey) || "cmswift:theme";
  }

  function readSavedTheme() {
    const storage = getThemeStorage();
    if (!storage) return null;
    try {
      return normalizeThemeName(storage.getItem(getThemeStorageKey()));
    } catch (_error) {
      return null;
    }
  }

  function writeSavedTheme(theme) {
    const storage = getThemeStorage();
    if (!storage) return;
    try {
      if (theme == null) {
        storage.removeItem(getThemeStorageKey());
      } else {
        storage.setItem(getThemeStorageKey(), theme);
      }
    } catch (_error) { }
  }

  function resolveThemeList(themes) {
    const html = getThemeRoot();
    const candidates = [
      themes,
      CMSwift.theme?.themes,
      CMSwift.config?.themes,
      typeof globalThis !== "undefined" ? globalThis.CMSwift_setting?.themes : null,
      typeof globalThis !== "undefined" ? globalThis.CMSwift_setting?.themeList : null,
      html?.getAttribute?.("data-themes"),
    ];

    for (const candidate of candidates) {
      const list = normalizeThemeList(candidate);
      if (list.length) return list;
    }
    return [];
  }

  CMSwift.theme = CMSwift.theme || {};
  CMSwift.theme.storageKey = getThemeStorageKey();
  if (!normalizeThemeList(CMSwift.theme.themes).length) {
    CMSwift.theme.themes = resolveThemeList();
  }

  CMSwift.setTheme = function (theme, opts = {}) {
    const value = normalizeThemeName(theme);
    const html = getThemeRoot();
    if (html) {
      if (value == null) html.removeAttribute("data-theme");
      else html.setAttribute("data-theme", value);
    }
    if (opts.persist !== false) writeSavedTheme(value);
    return html;
  };

  CMSwift.getTheme = function (opts = {}) {
    const html = getThemeRoot();
    const current = normalizeThemeName(html?.getAttribute?.("data-theme"));
    if (current) return current;

    if (opts.storage === false) return null;

    const saved = readSavedTheme();
    if (saved && html && opts.sync !== false) {
      html.setAttribute("data-theme", saved);
    }
    return saved;
  };

  CMSwift.toggleTheme = function (themes, opts = {}) {
    const list = resolveThemeList(themes);
    const activeList = list.length
      ? list
      : normalizeThemeList([CMSwift.getTheme({ sync: false }), "light", "dark"]);
    const current = CMSwift.getTheme({ sync: false });
    const fallback = normalizeThemeName(opts.fallback) || activeList[0] || "light";
    const currentIndex = current ? activeList.indexOf(current) : -1;
    const nextTheme = currentIndex >= 0
      ? activeList[(currentIndex + 1) % activeList.length]
      : fallback;

    CMSwift.theme.themes = activeList.slice();
    CMSwift.setTheme(nextTheme, opts);
    return nextTheme;
  };

  const bootTheme = readSavedTheme();
  if (bootTheme) {
    CMSwift.setTheme(bootTheme, { persist: false });
  }
})();
