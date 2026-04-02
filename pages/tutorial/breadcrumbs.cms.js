const row = (...children) => _.Row({
  style: {
    gap: "12px",
    flexWrap: "wrap",
    alignItems: "center"
  }
}, ...children);

const infoLine = (label, getter) => _.div({ class: "cms-m-b-sm" }, _.b(`${label}: `), _.span(getter));

const mountReactiveNode = (deps, render) => {
  const host = _.div();
  const appendValue = (value) => {
    if (value == null || value === false) return;
    if (Array.isArray(value)) {
      value.forEach(appendValue);
      return;
    }
    if (value?.nodeType) {
      host.appendChild(value);
      return;
    }
    host.appendChild(document.createTextNode(String(value)));
  };
  const paint = () => {
    host.innerHTML = "";
    appendValue(render());
  };
  deps.forEach((dep) => dep?.action?.(() => paint()));
  paint();
  return host;
};

const makeBadge = (tone, text) => _.Chip({ color: tone, size: "xs", outline: true }, text);

const orderFlow = [
  { label: "Workspace", icon: "dashboard", note: "Vista operativa principale", tone: "secondary" },
  { label: "Orders", icon: "shopping_bag", note: "Queue globale ordini", tone: "info" },
  { label: "Italy", icon: "flag", note: "Canale locale con SLA dedicati", tone: "primary" },
  { label: "Order #48291", icon: "inventory_2", note: "Ordine B2B da verificare", tone: "warning" },
  { label: "Shipment", icon: "local_shipping", note: "Tracking e milestone corriere", tone: "success" }
];

const docsFlow = [
  { label: "Docs", icon: "menu_book", note: "Portale tecnico", tone: "info" },
  { label: "Components", icon: "category", note: "Catalogo UI", tone: "secondary" },
  { label: "Navigation", icon: "explore", note: "Pattern di navigazione", tone: "primary" },
  { label: "Breadcrumbs", icon: "chevron_right", note: "API completa del componente", tone: "success" }
];

const releaseFlow = [
  { label: "Studio", icon: "palette", note: "Area creativa centralizzata", tone: "secondary" },
  { label: "Campaigns", icon: "campaign", note: "Launch list attiva", tone: "info" },
  { label: "Holiday 2026", icon: "bolt", note: "Release principale del trimestre", tone: "warning" },
  { label: "Assets", icon: "perm_media", note: "Bundle immagini e copy", tone: "primary" },
  { label: "Mobile hero", icon: "smartphone", note: "Hero iPhone e Android", tone: "danger" },
  { label: "Review", icon: "fact_check", note: "Checklist finale con owner", tone: "success" }
];

const scenarios = {
  orders: {
    title: "Order desk",
    subtitle: "Uso tipico delle breadcrumbs per navigazione contestuale e ritorno ai livelli precedenti",
    tone: "warning",
    items: orderFlow
  },
  docs: {
    title: "Developer docs",
    subtitle: "Path editoriale con metadati, badge e ultimo step corrente",
    tone: "info",
    items: docsFlow
  },
  release: {
    title: "Release workflow",
    subtitle: "Scenario con path lungo, collapse centrale e step riutilizzabili",
    tone: "secondary",
    items: releaseFlow
  }
};

const liveScene = _.rod("orders");
const liveVariant = _.rod("line");
const liveDense = _.rod(false);
const liveWrap = _.rod(true);
const liveCollapsed = _.rod(true);
const liveShowMeta = _.rod(true);
const liveCurrent = _.rod(scenarios.orders.items.length - 1);
const liveLastAction = _.rod("nessuna interazione");

liveScene.action?.((next) => {
  const key = String(next?.value ?? liveScene.value);
  liveCurrent.value = Math.max(0, scenarios[key].items.length - 1);
  liveLastAction.value = `scenario -> ${key}`;
});

const buildLiveItems = () => {
  const scene = scenarios[liveScene.value];
  return scene.items.map((item, index) => ({
    label: item.label,
    icon: item.icon,
    note: liveShowMeta.value ? item.note : null,
    badge: liveShowMeta.value && index < liveCurrent.value ? makeBadge(item.tone, `step ${index + 1}`) : null,
    current: index === liveCurrent.value,
    onClick: index < liveCurrent.value
      ? (event) => {
        event?.preventDefault?.();
        liveCurrent.value = index;
        liveLastAction.value = `jump -> ${item.label}`;
      }
      : null,
    aside: index < liveCurrent.value ? _.Icon({ name: "reply", size: 14 }) : null
  }));
};

const renderLivePanel = () => {
  const scene = scenarios[liveScene.value];
  const active = scene.items[liveCurrent.value] || scene.items[scene.items.length - 1];
  const hasNext = liveCurrent.value < scene.items.length - 1;
  return _.Card({
    title: active.label,
    subtitle: active.note,
    aside: makeBadge(scene.tone, scene.title)
  },
    _.List({ marker: false, divider: true },
      _.Item({ title: "Owner", subtitle: "Ops + CX", icon: "group" }),
      _.Item({ title: "SLA", subtitle: liveScene.value === "orders" ? "17 minuti" : "Revisione entro oggi", icon: "schedule" }),
      _.Item({ title: "Prossima azione", subtitle: liveScene.value === "release" ? "Confermare mobile crop" : "Allineare il team sullo step corrente", icon: "play_circle" })
    ),
    _.Footer({ align: "right" },
      _.Btn({
        color: "secondary",
        outline: true,
        size: "sm",
        onClick: () => {
          liveLastAction.value = `detail -> ${active.label}`;
        }
      }, "Apri dettaglio"),
      _.Btn({
        color: scene.tone,
        size: "sm",
        onClick: () => {
          if (hasNext) {
            const nextIndex = liveCurrent.value + 1;
            liveCurrent.value = nextIndex;
            liveLastAction.value = `next -> ${scene.items[nextIndex].label}`;
            return;
          }
          liveLastAction.value = `flow completato -> ${active.label}`;
        }
      }, hasNext ? "Continua" : "Completa")
    )
  );
};

const listSample = {
  basic: {
    code: [
      _.Card({
        title: "Workspace header",
        subtitle: "Breadcrumbs con home, separatore custom e badge finale",
        aside: makeBadge("warning", "live")
      },
        _.Breadcrumbs({
          home: { label: "Workspace", to: "/workspace", icon: "dashboard" },
          items: [
            { label: "Orders", to: "/workspace/orders", icon: "shopping_bag" },
            { label: "Italy", to: "/workspace/orders/it", icon: "flag" },
            { label: "Order #48291", current: true, icon: "inventory_2", badge: makeBadge("warning", "SLA 17m") }
          ],
          separator: () => _.Icon({ name: "chevron_right", size: 16 }),
          after: makeBadge("info", "customer: VIP")
        })
      )
    ],
    sample: [
      "_.Breadcrumbs({",
      "  home: { label: \"Workspace\", to: \"/workspace\", icon: \"dashboard\" },",
      "  items: [",
      "    { label: \"Orders\", to: \"/workspace/orders\", icon: \"shopping_bag\" },",
      "    { label: \"Italy\", to: \"/workspace/orders/it\", icon: \"flag\" },",
      "    { label: \"Order #48291\", current: true, icon: \"inventory_2\", badge: _.Chip({ size: \"xs\", outline: true, color: \"warning\" }, \"SLA 17m\") }",
      "  ],",
      "  separator: () => _.Icon({ name: \"chevron_right\", size: 16 }),",
      "  after: _.Chip({ size: \"xs\", outline: true, color: \"info\" }, \"customer: VIP\")",
      "});"
    ]
  },
  slots: {
    code: [
      _.Card({
        title: "Slots custom",
        subtitle: "Label, note, separator e aside personalizzati senza perdere la struttura del componente"
      },
        _.Breadcrumbs({
          variant: "pills",
          color: "secondary",
          items: [
            { label: "Docs", to: "/docs", icon: "menu_book", note: "Portal" },
            { label: "Components", to: "/docs/components", icon: "category", note: "UI kit" },
            { label: "Breadcrumbs", current: true, icon: "chevron_right", note: "v2.0" }
          ],
          slots: {
            label: ({ item, current }) => _.span(current ? _.b(item.label) : item.label),
            note: ({ item }) => _.span({ class: "cms-muted" }, item.note),
            aside: ({ current }) => current ? makeBadge("success", "current") : _.Icon({ name: "arrow_outward", size: 14 }),
            separator: () => _.Icon({ name: "keyboard_double_arrow_right", size: 16 })
          }
        })
      )
    ],
    sample: [
      "_.Breadcrumbs({",
      "  variant: \"pills\",",
      "  items: [...],",
      "  slots: {",
      "    label: ({ item, current }) => _.span(current ? _.b(item.label) : item.label),",
      "    note: ({ item }) => _.span({ class: \"cms-muted\" }, item.note),",
      "    aside: ({ current }) => current ? _.Chip({ size: \"xs\", color: \"success\", outline: true }, \"current\") : _.Icon({ name: \"arrow_outward\", size: 14 }),",
      "    separator: () => _.Icon({ name: \"keyboard_double_arrow_right\", size: 16 })",
      "  }",
      "});"
    ]
  },
  collapse: {
    code: [
      _.Card({
        title: "Path lunghi",
        subtitle: "Collapse automatico per flussi articolati o strutture editoriali profonde",
        aside: makeBadge("secondary", "max 4")
      },
        _.Breadcrumbs({
          items: releaseFlow.map((item, index) => ({
            label: item.label,
            icon: item.icon,
            note: item.note,
            current: index === releaseFlow.length - 1
          })),
          variant: "soft",
          max: 4,
          collapsedLabel: "3 step nascosti",
          after: _.Btn({ color: "secondary", outline: true, size: "sm" }, "Apri mappa")
        })
      )
    ],
    sample: [
      "_.Breadcrumbs({",
      "  items: releaseFlow,",
      "  variant: \"soft\",",
      "  max: 4,",
      "  collapsedLabel: \"3 step nascosti\",",
      "  after: _.Btn({ color: \"secondary\", outline: true, size: \"sm\" }, \"Apri mappa\")",
      "});"
    ]
  }
};

const breadcrumbs = _.div({ class: "cms-panel cms-page" },
  _.h1("Breadcrumbs"),
  _.p("Breadcrumbs e ora un componente strutturato per navigazioni contestuali, path gerarchici, flussi operativi e documentazione: supporta item completi, slot, varianti, collapse automatico e step interattivi."),
  _.h2("Props principali"),
  _.List(
    _.Item("items o model: sorgente dei livelli della breadcrumb, anche reattiva"),
    _.Item("home, separator, before, after: composizione del contenitore e dei punti di appoggio laterali"),
    _.Item("variant, dense, wrap/nowrap, color/state, itemSize: controllo visivo coerente con gli altri componenti UI"),
    _.Item("max, leadingCount, trailingCount, collapsedLabel: gestione dei path lunghi"),
    _.Item("slots.item, icon, label, note, badge, aside, default, separator, collapsed, empty: personalizzazione completa")
  ),
  _.h2("Documentazione API"),
  _.docTable("Breadcrumbs"),
  _.h2("Esempi"),
  boxCode("Workspace header", listSample.basic, 24),
  boxCode("Slots custom", listSample.slots, 24),
  boxCode("Collapse automatico", listSample.collapse, 24),
  _.h2("Playground reale"),
  _.Card({
    title: "Context navigation playground",
    subtitle: "Un esempio vero con step cliccabili, path lunghi, metadati opzionali e cambio variante runtime",
    aside: makeBadge("info", "interactive")
  },
    row(
      _.Radio({ value: "orders", model: liveScene, color: "warning" }, "Orders"),
      _.Radio({ value: "docs", model: liveScene, color: "info" }, "Docs"),
      _.Radio({ value: "release", model: liveScene, color: "secondary" }, "Release"),
      _.Radio({ value: "line", model: liveVariant, color: "secondary" }, "Line"),
      _.Radio({ value: "pills", model: liveVariant, color: "secondary" }, "Pills"),
      _.Radio({ value: "soft", model: liveVariant, color: "secondary" }, "Soft"),
      _.Checkbox({ model: liveDense, color: "info" }, "Dense"),
      _.Checkbox({ model: liveWrap, color: "secondary" }, "Wrap"),
      _.Checkbox({ model: liveCollapsed, color: "warning" }, "Collapse"),
      _.Checkbox({ model: liveShowMeta, color: "success" }, "Meta")
    ),
    infoLine("Scenario", () => liveScene.value),
    infoLine("Step corrente", () => {
      const scene = scenarios[liveScene.value];
      return scene.items[liveCurrent.value]?.label || "-";
    }),
    infoLine("Ultima azione", () => liveLastAction.value),
    mountReactiveNode([liveScene, liveVariant, liveDense, liveWrap, liveCollapsed, liveShowMeta, liveCurrent], () => _.div({
      style: {
        display: "flex",
        flexDirection: "column",
        gap: "16px"
      }
    },
      _.Breadcrumbs({
        items: buildLiveItems(),
        variant: liveVariant.value,
        dense: liveDense.value,
        wrap: liveWrap.value,
        max: liveCollapsed.value ? 4 : null,
        color: scenarios[liveScene.value].tone,
        separator: () => _.Icon({ name: "chevron_right", size: 16 }),
        before: makeBadge(scenarios[liveScene.value].tone, scenarios[liveScene.value].title),
        after: _.Chip({ color: "success", outline: true, size: "xs" }, () => `step ${liveCurrent.value + 1}/${scenarios[liveScene.value].items.length}`),
        onItemClick: (item, ctx) => {
          if (ctx.current) return;
          liveLastAction.value = `click -> ${item.label}`;
        }
      }),
      renderLivePanel()
    ))
  )
);

export { breadcrumbs };
