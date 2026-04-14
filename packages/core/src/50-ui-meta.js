  CMSwift.ui = CMSwift.ui || {};
  CMSwift.ui.meta = CMSwift.ui.meta || {};

  CMSwift.ui.slot = function slot(value, opts = {}) {
    const UI = CMSwift.ui;
    const {
      as = "node",          // "node" | "text" | "icon"
      wrap = "span",        // "span" | "text" | null
      iconProps = null,     // props extra per UI.Icon
      filter = true         // filtra null/false
    } = opts;

    const makeTextNode = (v) => document.createTextNode(String(v));
    const makeSpan = (v) => _.span(String(v));

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

  // docTable genera una tabella di documentazione
  CMSwift.docTable = (name) => {
    if (!CMSwift.isDev()) return _.div(); // non fa niente in prod

    const {
      resolveDocComponents,
      renderMetaItem,
      renderTabGroupFallback,
      normalizeEventRows,
      normalizeSlotRows
    } = CMSwift._uiMetaShared;
    const meta = CMSwift.ui.meta?.[name];
    if (!meta) return _.div({ class: "cms-muted" }, `Meta non trovata: ${name}`);
    const { hasTabPanel, Card, Chip } = resolveDocComponents(_);

    const list = {};
    Object.entries(meta.props || {}).forEach(([k, v]) => {
      const cat = v.category || "general";
      if (!list[cat]) list[cat] = [];
      list[cat].push({
        name: k,
        ...v
      });
    });
    const propsTab = Object.keys(list).map((v) => {
      const rows = list[v].map((p) => {
        return {
          name: p.name,
          wrap: true,
          label: p.name,
          content: renderMetaItem(_, p, Chip)
        };
      });
      return {
        name: v, wrap: true, label: v, content: hasTabPanel ? _.TabPanel({
          orientation: "vertical",
          animated: true,
          radius: "0 0 0 var(--cms-r-default)",
          tabs: rows
        }) : renderTabGroupFallback(_, rows)
      };
    });

    const eventsRows = normalizeEventRows(_, meta.events);
    const slotsRows = normalizeSlotRows(_, meta.slots);
    const tabPanelModel = _.rod(null);
    const taps = [];
    if (slotsRows.length) taps.push({
      name: "Slots",
      wrap: true,
      label: "Slots",
      content: hasTabPanel ? _.TabPanel({
        animated: true,
        radius: "0 0 0 var(--cms-r-default)",
        orientation: "vertical",
        tabs: slotsRows
      }) : renderTabGroupFallback(_, slotsRows)
    });
    if (propsTab.length) taps.push(...propsTab);
    if (eventsRows.length) taps.push({
      name: "Events",
      wrap: true,
      label: "Events",
      content: hasTabPanel ? _.TabPanel({
        animated: true,
        radius: "0 0 0 var(--cms-r-default)",
        orientation: "vertical",
        tabs: eventsRows
      }) : renderTabGroupFallback(_, eventsRows)
    });
    const first = "general";
    taps.sort((a, b) => {
      if (a.name === first) return -1;
      if (b.name === first) return 1;
      return a.name.localeCompare(b.name);
    })
    return Card({ class: "cms-doc-table" },
      _.div({ class: "cms-doc-table-header" },
        _.div({ class: "cms-doc-table-title" }, `_.${name}`),
        meta.signature ? _.div({ class: "cms-doc-table-signature" }, String(meta.signature).replaceAll("UI.", "_.")) : null
      ),
      taps.length
        ? _.div({ class: "cms-doc-table-section-title" }, propsTab.length ? "Props" : "Documentation")
        : _.p({ class: "cms-muted" }, "Nessuna documentazione strutturata disponibile."),
      taps.length
        ? (hasTabPanel ? _.TabPanel({
          border: true,
          animated: true,
          orientation: "horizontal",
          tabs: taps, model: tabPanelModel
        }) : renderTabGroupFallback(_, taps))
        : null,
      meta.returns ? _.p({ class: "cms-muted", style: { marginTop: "14px" } }, `Returns: ${meta.returns}`) : null
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
