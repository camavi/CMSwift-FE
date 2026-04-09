const DOC_STATUS_COLORS = {
  stable: "success",
  unstable: "warning",
  experimental: "danger",
  dev: "secondary"
};

const docNodes = (value) => {
  if (value == null || value === false || value === "") return [];
  const out = CMSwift.ui.slot(value);
  return _.asNodeArray(out);
};

const docText = (value, fallback = "") => {
  if (value == null || value === false) return fallback;
  return String(_.uiUnwrap(value) ?? fallback);
};

const docList = (value) => Array.isArray(value) ? value.filter(Boolean) : [];

const renderDocRichItem = (item) => {
  if (item == null || item === false) return null;
  if (typeof item === "string" || typeof item === "number") {
    return _.div({ class: "cms-component-docs-list-item" },
      _.div({ class: "cms-component-docs-list-copy" }, String(item))
    );
  }
  return _.div({ class: "cms-component-docs-list-item" },
    item.kicker ? _.div({ class: "cms-component-docs-list-kicker" }, ...docNodes(item.kicker)) : null,
    _.div({ class: "cms-component-docs-list-copy" },
      item.title ? _.div({ class: "cms-component-docs-list-title" }, ...docNodes(item.title)) : null,
      item.text ? _.div({ class: "cms-component-docs-list-text" }, ...docNodes(item.text)) : null
    )
  );
};

const renderDocGroup = (title, items, opts = {}) => {
  const list = docList(items);
  if (!list.length) return null;
  return _.div({ class: _.uiClass(["cms-component-docs-surface", opts.className]) },
    _.div({ class: "cms-component-docs-surface-head" },
      _.div({ class: "cms-component-docs-surface-title" }, title),
      opts.note ? _.div({ class: "cms-component-docs-surface-note" }, ...docNodes(opts.note)) : null
    ),
    _.div({ class: "cms-component-docs-list" }, ...list.map(renderDocRichItem))
  );
};

const renderDocFact = (item) => _.div({ class: "cms-component-docs-fact" },
  _.div({ class: "cms-component-docs-fact-label" }, docText(item?.label)),
  _.div({ class: "cms-component-docs-fact-value" }, ...docNodes(item?.value))
);

const renderDocProp = (item) => {
  if (!item) return null;
  return _.div({ class: "cms-component-docs-prop" },
    _.div({ class: "cms-component-docs-prop-head" },
      _.Chip({ dense: true, outline: true, color: "primary" }, item.name || "prop"),
      item.default != null && item.default !== ""
        ? _.div({ class: "cms-component-docs-prop-default" }, `Default: ${item.default}`)
        : null
    ),
    item.description ? _.div({ class: "cms-component-docs-prop-text" }, ...docNodes(item.description)) : null,
    docList(item.tags).length
      ? _.div({ class: "cms-component-docs-prop-tags" },
        ...docList(item.tags).map((tag) => _.Chip({ dense: true, outline: true }, tag))
      )
      : null
  );
};

const renderDocPattern = (item) => {
  if (!item) return null;
  return _.div({ class: "cms-component-docs-pattern" },
    _.div({ class: "cms-component-docs-pattern-title" }, ...docNodes(item.title || item.name || "Pattern")),
    item.text ? _.div({ class: "cms-component-docs-pattern-text" }, ...docNodes(item.text)) : null,
    docList(item.tags).length
      ? _.div({ class: "cms-component-docs-pattern-tags" },
        ...docList(item.tags).map((tag) => _.Chip({ dense: true, outline: true, color: "secondary" }, tag))
      )
      : null
  );
};

_.ComponentDocs = (...args) => {
  const { props, children } = CMSwift.uiNormalizeArgs(args);
  const doc = _.isUIPlainObject(props.doc) ? props.doc : {};
  const rawName = props.name || doc.name || doc.component || "";
  const meta = _.meta?.[rawName] || null;
  const title = props.title || doc.title || rawName || "Component";
  const summary = props.summary || doc.summary || meta?.description || "";
  const signatureRaw = props.signature || doc.signature || meta?.signature || "";
  const signature = signatureRaw ? String(signatureRaw).replaceAll("_.", "_.") : "";
  const status = String(props.status || doc.status || "stable").toLowerCase();
  const statusColor = DOC_STATUS_COLORS[status] || "secondary";
  const heroTags = docList(doc.tags || doc.labels || props.tags);
  const quickFacts = docList(doc.quickFacts || props.quickFacts);
  const essentialProps = docList(doc.essentialProps || props.essentialProps);
  const useWhen = docList(doc.useWhen || props.useWhen);
  const avoidWhen = docList(doc.avoidWhen || props.avoidWhen);
  const anatomy = docList(doc.anatomy || props.anatomy);
  const slots = docList(doc.slots || props.slots);
  const patterns = docList(doc.patterns || props.patterns);
  const accessibility = docList(doc.accessibility || props.accessibility);
  const gotchas = docList(doc.gotchas || props.gotchas);
  const apiContent = typeof props.api === "function"
    ? props.api()
    : (props.api || (rawName ? _.docTable(rawName) : null));

  const hero = _.div({ class: "cms-component-docs-hero" },
    _.div({ class: "cms-component-docs-hero-copy" },
      _.div({ class: "cms-component-docs-eyebrow" },
        _.Chip({ dense: true, color: statusColor }, status),
        rawName ? _.span({ class: "cms-component-docs-raw-name" }, `_.${rawName}`) : null
      ),
      _.h1({ class: "cms-component-docs-title" }, title),
      summary ? _.p({ class: "cms-component-docs-summary" }, ...docNodes(summary)) : null,
      signature ? _.div({ class: "cms-component-docs-signature" }, signature) : null,
      heroTags.length
        ? _.div({ class: "cms-component-docs-tags" },
          ...heroTags.map((tag) => _.Chip({ dense: true, outline: true }, tag))
        )
        : null
    ),
    quickFacts.length
      ? _.div({ class: "cms-component-docs-facts" }, ...quickFacts.map(renderDocFact))
      : null
  );

  const overviewContent = _.div({ class: "cms-component-docs-panel" },
    _.div({ class: "cms-component-docs-grid cms-component-docs-grid-two" },
      renderDocGroup("When To Use", useWhen, { note: "Situazioni in cui il componente fa risparmiare markup e decisioni." }),
      renderDocGroup("Avoid When", avoidWhen, { note: "Casi in cui un altro pattern resta piu chiaro o piu onesto." })
    ),
    essentialProps.length
      ? _.div({ class: "cms-component-docs-surface" },
        _.div({ class: "cms-component-docs-surface-head" },
          _.div({ class: "cms-component-docs-surface-title" }, "Props Essenziali"),
          _.div({ class: "cms-component-docs-surface-note" }, "Le leve che cambiano davvero tono, struttura e comportamento.")
        ),
        _.div({ class: "cms-component-docs-props" }, ...essentialProps.map(renderDocProp))
      )
      : null,
    _.div({ class: "cms-component-docs-grid cms-component-docs-grid-two" },
      renderDocGroup("Anatomy", anatomy, { note: "Come leggere il componente senza partire dalla tabella raw delle props." }),
      renderDocGroup("Slots & Extensibility", slots, { note: "Punti in cui puoi rompere il layout standard senza riscrivere il componente." })
    ),
    children && children.length
      ? _.div({ class: "cms-component-docs-surface" }, ...children)
      : null
  );

  const patternsContent = _.div({ class: "cms-component-docs-panel" },
    patterns.length
      ? _.div({ class: "cms-component-docs-surface" },
        _.div({ class: "cms-component-docs-surface-head" },
          _.div({ class: "cms-component-docs-surface-title" }, "Common Patterns"),
          _.div({ class: "cms-component-docs-surface-note" }, "Ricette veloci per i casi veri, non solo per la demo.")
        ),
        _.div({ class: "cms-component-docs-patterns" }, ...patterns.map(renderDocPattern))
      )
      : null,
    _.div({ class: "cms-component-docs-grid cms-component-docs-grid-two" },
      renderDocGroup("Accessibility", accessibility, { note: "Aspetti da non rompere quando cambi copy, tono o dismiss." }),
      renderDocGroup("Gotchas", gotchas, { note: "Cose che conviene sapere prima di abusare del componente." })
    )
  );

  const tabs = [
    {
      name: "overview",
      label: "Overview",
      content: overviewContent
    }
  ];
  if (patterns.length || accessibility.length || gotchas.length) {
    tabs.push({
      name: "patterns",
      label: "Patterns",
      content: patternsContent
    });
  }
  if (apiContent) {
    tabs.push({
      name: "api",
      label: "Full API",
      content: _.div({ class: "cms-component-docs-panel cms-component-docs-api" }, apiContent)
    });
  }

  const tabModel = _.rod("overview");
  const panel = _.TabPanel
    ? _.TabPanel({
      class: "cms-component-docs-tabs",
      border: true,
      animated: true,
      orientation: "horizontal",
      variant: "soft",
      model: tabModel,
      tabs
    })
    : _.div({ class: "cms-component-docs-stack" }, ...tabs.map((tab) => _.div({ class: "cms-component-docs-panel" }, tab.content)));

  const rootProps = CMSwift.omit(props, [
    "doc", "name", "title", "summary", "signature", "status", "tags", "quickFacts",
    "essentialProps", "useWhen", "avoidWhen", "anatomy", "slots", "patterns",
    "accessibility", "gotchas", "api", "class", "style"
  ]);
  rootProps.class = _.uiClass(["cms-component-docs", `is-${status}`, props.class]);
  rootProps.style = props.style;

  return _.section(rootProps, hero, panel);
};

if (CMSwift.isDev?.()) {
  _.meta = _.meta || {};
  _.meta.ComponentDocs = {
    signature: "_.ComponentDocs({ doc, api? })",
    props: {
      doc: "object",
      name: "string",
      title: "string",
      summary: "string|Node|Array|Function",
      signature: "string",
      status: "stable|unstable|experimental|dev",
      tags: "Array<string>",
      quickFacts: "Array<{ label, value }>",
      essentialProps: "Array<object>",
      useWhen: "Array<object|string>",
      avoidWhen: "Array<object|string>",
      anatomy: "Array<object|string>",
      slots: "Array<object|string>",
      patterns: "Array<object>",
      accessibility: "Array<object|string>",
      gotchas: "Array<object|string>",
      api: "Node|Function"
    },
    returns: "HTMLElement",
    description: "Renderer docs umano per tutorial e showcase, con overview editoriale, patterns e tab Full API."
  };
}
