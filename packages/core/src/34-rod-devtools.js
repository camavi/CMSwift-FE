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
        el: b.el?.nodeType === 3 ? "#text" : b.el?.tagName,
        id: b.el?.id || null,
        className: b.el?.className || null,
        isConnected: b.el?.nodeType === 3 ? !!b.el.parentNode : (b.el?.isConnected ?? null)
      })),
      actionsCount: Array.isArray(r._actions) ? r._actions.length : null,
      disposed: !!r._disposed
    };

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
