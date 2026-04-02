const liveRoute = _.rod("/workspace/overview");
const liveVariant = _.rod("line");
const liveDense = _.rod(false);
const liveBlock = _.rod(true);
const liveDisabled = _.rod(false);
const liveBadge = _.rod(true);
const liveLastAction = _.rod("nessuna interazione");

const row = (...children) => _.Row({
  style: {
    gap: "12px",
    flexWrap: "wrap",
    alignItems: "center"
  }
}, ...children);

const stack = (...children) => _.div({
  style: {
    display: "flex",
    flexDirection: "column",
    gap: "12px"
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

const workspaceRoutes = [
  {
    to: "/workspace/overview",
    label: "Overview",
    note: "KPI, SLA e stato del workspace",
    icon: "dashboard",
    badge: { tone: "success", text: "live" }
  },
  {
    to: "/workspace/orders",
    label: "Orders",
    note: "Picking, blocchi e ritardi corriere",
    icon: "shopping_bag",
    badge: { tone: "warning", text: "12" },
    lockable: true
  },
  {
    to: "/workspace/automation",
    label: "Automation",
    note: "Trigger e code in esecuzione",
    icon: "bolt",
    badge: { tone: "info", text: "3" }
  }
];

const makeBadge = (entry) => entry.badge
  ? _.Chip({ size: "xs", color: entry.badge.tone, outline: true }, entry.badge.text)
  : null;

const renderLiveRouteTab = (entry) => _.RouteTab({
  to: entry.to,
  label: entry.label,
  note: entry.note,
  icon: entry.icon,
  badge: liveBadge.value ? makeBadge(entry) : null,
  active: liveRoute.value === entry.to,
  variant: liveVariant.value,
  dense: liveDense.value,
  block: liveBlock.value,
  disabled: liveDisabled.value && !!entry.lockable,
  onClick: (e) => {
    e.preventDefault();
    if (liveDisabled.value && entry.lockable) {
      liveLastAction.value = `azione bloccata: ${entry.label}`;
      return;
    }
    liveRoute.value = entry.to;
    liveLastAction.value = `navigate -> ${entry.to}`;
  }
});

const renderPreviewPanel = () => {
  if (liveRoute.value === "/workspace/orders") {
    return _.Card({
      title: "Order desk",
      subtitle: "Coda operativa reale collegata al tab selezionato",
      aside: _.Chip({ color: "warning", size: "sm" }, "12 blocchi")
    },
      _.List({ marker: false, divider: true },
        _.Item({ title: "Ordine #4421", subtitle: "ETA fuori soglia in Germania", icon: "local_shipping", aside: _.Chip({ color: "warning", size: "xs" }, "ETA +18h") }),
        _.Item({ title: "Ordine #4388", subtitle: "Picking fermo da 26 minuti", icon: "inventory_2", aside: _.Chip({ color: "danger", size: "xs" }, "P1") }),
        _.Item({ title: "Ordine #4350", subtitle: "Cliente VIP con richiesta supporto", icon: "support_agent", aside: _.Chip({ color: "info", size: "xs" }, "VIP") })
      )
    );
  }

  if (liveRoute.value === "/workspace/automation") {
    return _.Card({
      title: "Automation hub",
      subtitle: "Trigger reali configurati dal team operativo",
      aside: _.Chip({ color: "info", outline: true, size: "sm" }, "3 attivi")
    },
      _.Checkbox({ model: _.rod(true), color: "success" }, "Restock alert verso CRM"),
      _.Checkbox({ model: _.rod(true), color: "info" }, "Sync inventory marketplace"),
      _.Checkbox({ model: _.rod(false), color: "warning" }, "Push coupon VIP"),
      _.Btn({ color: "secondary", outline: true, size: "sm" }, "Apri workflow")
    );
  }

  return _.Card({
    title: "Workspace overview",
    subtitle: "Uso tipico del RouteTab in un header operativo o in una sidebar",
    aside: _.Chip({ color: "success", size: "sm" }, "stable")
  },
    _.Grid({ cols: 3, gap: 12 },
      _.GridCol(_.Card({ title: "Revenue", subtitle: "Ultime 24h" }, _.div({ class: "cms-h2" }, "€ 128k"))),
      _.GridCol(_.Card({ title: "Orders", subtitle: "Da monitorare" }, _.div({ class: "cms-h2" }, "342"))),
      _.GridCol(_.Card({ title: "Refund risk", subtitle: "Trend" }, _.div({ class: "cms-h2" }, "2.1%")))
    ),
    _.List({ marker: false, divider: true },
      _.Item({ title: "Hero mobile", subtitle: "Validare crop iPhone 13 mini", icon: "smartphone" }),
      _.Item({ title: "Pricing banner", subtitle: "Confermare copy con marketing", icon: "sell" }),
      _.Item({ title: "Customer email", subtitle: "Programmare invio rollback-safe", icon: "mail" })
    )
  );
};

const listSample = {
  basic: {
    code: [
      _.Card({
        title: "Workspace header",
        subtitle: "Tre route tab usati come navigazione primaria di una dashboard"
      },
        row(
          _.RouteTab({
            to: "/workspace/overview",
            active: true,
            icon: "dashboard",
            label: "Overview",
            note: "KPI e stato generale",
            badge: _.Chip({ size: "xs", color: "success", outline: true }, "live")
          }),
          _.RouteTab({
            to: "/workspace/orders",
            icon: "shopping_bag",
            label: "Orders",
            note: "Picking e ritardi",
            badge: _.Chip({ size: "xs", color: "warning", outline: true }, "12")
          }),
          _.RouteTab({
            href: "https://docs.cmswift.it",
            target: "_blank",
            rel: "noopener noreferrer",
            icon: "open_in_new",
            label: "Docs",
            note: "Link esterno con stile coerente"
          })
        )
      )
    ],
    sample: [
      "_.Card({ title: \"Workspace header\" },",
      "  _.RouteTab({",
      "    to: \"/workspace/overview\",",
      "    active: true,",
      "    icon: \"dashboard\",",
      "    label: \"Overview\",",
      "    note: \"KPI e stato generale\",",
      "    badge: _.Chip({ size: \"xs\", color: \"success\", outline: true }, \"live\")",
      "  }),",
      "  _.RouteTab({",
      "    to: \"/workspace/orders\",",
      "    icon: \"shopping_bag\",",
      "    label: \"Orders\",",
      "    note: \"Picking e ritardi\",",
      "    badge: _.Chip({ size: \"xs\", color: \"warning\", outline: true }, \"12\")",
      "  })",
      ");"
    ]
  },
  slots: {
    code: [
      _.Card({
        title: "Slot custom",
        subtitle: "Label, note, badge e aside possono essere personalizzati senza perdere il comportamento base"
      },
        row(
          _.RouteTab({
            to: "/orders/picking",
            active: true,
            icon: "inventory_2",
            color: "info",
            slots: {
              label: ({ active }) => _.span(_.b(active ? "Picking attivo" : "Picking")),
              note: () => "24 missioni aperte in magazzino",
              badge: () => _.Badge({ color: "warning" }, "5"),
              aside: () => _.Icon({ name: "chevron_right", size: 18 })
            }
          }),
          _.RouteTab({
            to: "/orders/review",
            color: "secondary",
            slots: {
              label: () => _.span("Review backlog"),
              note: () => _.span("Con owner e SLA condivisi"),
              badge: () => _.Chip({ size: "xs", outline: true }, "owner: ops")
            }
          })
        )
      )
    ],
    sample: [
      "_.RouteTab({",
      "  to: \"/orders/picking\",",
      "  active: true,",
      "  icon: \"inventory_2\",",
      "  color: \"info\",",
      "  slots: {",
      "    label: ({ active }) => _.span(_.b(active ? \"Picking attivo\" : \"Picking\")),",
      "    note: () => \"24 missioni aperte in magazzino\",",
      "    badge: () => _.Badge({ color: \"warning\" }, \"5\"),",
      "    aside: () => _.Icon({ name: \"chevron_right\", size: 18 })",
      "  }",
      "});"
    ]
  },
  vertical: {
    code: [
      _.Card({
        title: "Sidebar verticale",
        subtitle: "Pattern utile per menu secondari o route locali di una sezione"
      },
        stack(
          _.RouteTab({
            to: "/settings/profile",
            label: "Profile",
            note: "Brand, owner e metadata",
            icon: "badge",
            badge: _.Chip({ color: "success", size: "xs", outline: true }, "ok"),
            block: true,
            active: true,
            variant: "soft"
          }),
          _.RouteTab({
            to: "/settings/security",
            label: "Security",
            note: "2FA, sessioni e audit",
            icon: "shield_lock",
            badge: _.Chip({ color: "warning", size: "xs", outline: true }, "review"),
            block: true,
            variant: "soft"
          }),
          _.RouteTab({
            to: "/settings/team",
            label: "Team",
            note: "Ruoli e permessi",
            icon: "groups",
            block: true,
            variant: "soft",
            disabled: true
          })
        )
      )
    ],
    sample: [
      "_.RouteTab({",
      "  to: \"/settings/profile\",",
      "  label: \"Profile\",",
      "  note: \"Brand, owner e metadata\",",
      "  icon: \"badge\",",
      "  badge: _.Chip({ color: \"success\", size: \"xs\", outline: true }, \"ok\"),",
      "  block: true,",
      "  active: true,",
      "  variant: \"soft\"",
      "});"
    ]
  }
};

const routeTab = _.div({ class: "cms-panel cms-page" },
  _.h1("RouteTab"),
  _.p("RouteTab e un link/tab standardizzato per navigazioni locali, header operativi, sidebar e scorciatoie verso route o href esterni."),
  _.h2("Props principali"),
  _.List(
    _.Item("to o href: destinazione interna via router oppure link normale/esterno"),
    _.Item("label, note, badge, icon, iconRight, aside: struttura base del componente"),
    _.Item("active o selected, match/matchMode, exact, startsWith: controllo dello stato attivo"),
    _.Item("variant, block, dense, disabled, color/state: resa visiva e comportamento"),
    _.Item("slots.icon, slots.label, slots.note, slots.badge, slots.aside, slots.default: personalizzazione completa")
  ),
  _.h2("Documentazione API"),
  _.docTable("RouteTab"),
  _.h2("Esempi"),
  boxCode("Header workspace", listSample.basic),
  boxCode("Slots custom", listSample.slots),
  boxCode("Sidebar verticale", listSample.vertical),
  _.h2("Playground reale"),
  _.Card({
    title: "Workspace navigation playground",
    subtitle: "Un esempio realistico con controlli runtime, pannello di dettaglio e log delle interazioni",
    aside: _.Chip({ color: "info", outline: true, size: "sm" }, "RouteTab")
  },
    row(
      _.Radio({ value: "line", model: liveVariant, color: "secondary" }, "Line"),
      _.Radio({ value: "pills", model: liveVariant, color: "secondary" }, "Pills"),
      _.Radio({ value: "soft", model: liveVariant, color: "secondary" }, "Soft"),
      _.Checkbox({ model: liveDense, color: "info" }, "Dense"),
      _.Checkbox({ model: liveBlock, color: "secondary" }, "Block"),
      _.Checkbox({ model: liveBadge, color: "success" }, "Badge"),
      _.Checkbox({ model: liveDisabled, color: "warning" }, "Disabilita tab Orders")
    ),
    infoLine("Route attiva", () => liveRoute.value),
    infoLine("Ultima azione", () => liveLastAction.value),
    mountReactiveNode([liveRoute, liveVariant, liveDense, liveBlock, liveDisabled, liveBadge], () => _.div({
      style: {
        display: "flex",
        gap: "16px",
        flexWrap: "wrap",
        alignItems: "flex-start"
      }
    },
      _.div({
        style: {
          flex: "0 0 280px",
          minWidth: "260px",
          display: "flex",
          flexDirection: "column",
          gap: "8px"
        }
      },
        ...workspaceRoutes.map(renderLiveRouteTab)
      ),
      _.div({
        style: {
          flex: "1 1 360px",
          minWidth: "280px"
        }
      },
        renderPreviewPanel()
      )
    ))
  )
);

export { routeTab };
