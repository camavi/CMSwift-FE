const shellItems = [
  { label: "Overview", to: "#overview", icon: "dashboard" },
  { label: "Orders", to: "#orders", icon: "shopping_bag" },
  {
    label: "Operations",
    icon: "tune",
    expanded: true,
    items: [
      { label: "SLA monitor", to: "#sla", icon: "timer" },
      { label: "Escalations", to: "#escalations", icon: "warning" },
      { label: "Warehouse", to: "#warehouse", icon: "inventory_2" }
    ]
  },
  { label: "Settings", to: "#settings", icon: "settings" }
];

const slotDrawerItems = [
  { label: "Campaigns", to: "#campaigns", icon: "campaign" },
  { label: "Creatives", to: "#creatives", icon: "palette" },
  { label: "Audience", to: "#audience", icon: "groups" },
  { label: "Automation", to: "#automation", icon: "bolt" }
];

const slotFilterState = _.rod({
  margin: true,
  blocked: false,
  italy: true
});
const slotSortModel = _.rod("margin");
const runtimeDrawerLabel = _.rod("Drawer aperto");
const runtimeView = _.rod("overview");

const gridCards = (...children) => _.div({
  style: {
    display: "grid",
    gap: "var(--cms-s-md)",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))"
  }
}, ...children);

const stackBox = (...children) => _.div({
  style: {
    display: "grid",
    gap: "var(--cms-s-md)"
  }
}, ...children);

const statCard = ({ title, value, tone, note }) => _.Card({
  title,
  subtitle: note,
  aside: _.Chip({ color: tone, outline: true, size: "sm" }, tone.toUpperCase())
},
  _.div({ class: "cms-h2" }, value)
);

const activityList = (items) => _.List(
  ...items.map((item) => _.Item(
    _.div({ style: { display: "flex", justifyContent: "space-between", gap: "12px", width: "100%" } },
      _.span(item.title),
      _.Chip({ color: item.tone, size: "sm", outline: true }, item.meta)
    )
  ))
);

const buildOpsPage = (mode = "overview") => _.Page({ dense: true },
  stackBox(
    _.Card({
      title: mode === "overview" ? "Operations cockpit" : "Incident response",
      subtitle: mode === "overview" ? "Vista principale del team fulfillment" : "Focus su colli in ritardo e stock bloccato",
      aside: _.div({ style: { display: "flex", gap: "8px", flexWrap: "wrap" } },
        _.Chip({ color: "success" }, "99.1% SLA"),
        _.Chip({ color: mode === "overview" ? "info" : "warning", outline: true }, mode === "overview" ? "Live board" : "Escalation mode")
      )
    },
      gridCards(
        statCard({ title: "Orders in queue", value: mode === "overview" ? "128" : "43", tone: "primary", note: "Ultimi 15 minuti" }),
        statCard({ title: "Blocked picks", value: mode === "overview" ? "7" : "12", tone: "warning", note: "Serve review" }),
        statCard({ title: "Late carriers", value: mode === "overview" ? "3" : "9", tone: "danger", note: "Hub Milano / Roma" })
      )
    ),
    _.Card({
      title: "Priority stream",
      subtitle: "Attivita su cui intervenire adesso",
      footer: _.div({ style: { display: "flex", gap: "8px", flexWrap: "wrap" } },
        _.Btn({ size: "sm", outline: true }, "Apri batch"),
        _.Btn({ size: "sm", color: "primary" }, "Assegna task")
      )
    },
      activityList(
        mode === "overview"
          ? [
            { title: "Ordine #48291 - etichetta DHL mancante", tone: "warning", meta: "12 min" },
            { title: "Riaccredito marketplace AMZ", tone: "info", meta: "finance" },
            { title: "Refill SKU A19 in area picking", tone: "success", meta: "ready" }
          ]
          : [
            { title: "Ticket #991 - spedizione overnight non partita", tone: "danger", meta: "critical" },
            { title: "Ordine #48103 - stock negativo in W2", tone: "warning", meta: "review" },
            { title: "Webhook carrier sospeso per retry", tone: "info", meta: "ops" }
          ]
      )
    )
  )
);

const buildRuntimeFooter = () => _.Footer({ align: "right" },
  _.Chip({ color: "info", outline: true, size: "sm" }, `view: ${runtimeView.value}`),
  _.Chip({ color: runtimeDrawerLabel.value.includes("aperto") ? "success" : "secondary", outline: true, size: "sm" }, runtimeDrawerLabel)
);

const buildInspectorNav = () => _.Card({
  title: "Inspector",
  subtitle: "Rail destro per note e controlli rapidi",
  footer: _.div({ style: { display: "flex", gap: "8px", flexWrap: "wrap" } },
    _.Chip({ color: "info", outline: true, size: "sm" }, "peek live"),
    _.Chip({ color: "secondary", outline: true, size: "sm" }, "drag enabled")
  )
},
  activityList([
    { title: "QA backlog: 4 task aperti", tone: "warning", meta: "today" },
    { title: "Release note pronta per review", tone: "info", meta: "draft" },
    { title: "Sync ERP completato", tone: "success", meta: "ok" }
  ])
);

const runtimeLayout = _.Layout({
  minHeight: 560,
  drawerWidth: 300,
  stickyHeader: true,
  stickyAside: true,
  header: _.Header({
    left: false,
    title: "Control room",
    subtitle: "API runtime del layout",
    right: _.div({ style: { display: "flex", gap: "8px", flexWrap: "wrap" } },
      _.Btn({ size: "sm", outline: true, onClick: () => { runtimeLayout.openAside(); runtimeDrawerLabel.value = "Drawer aperto"; } }, "Apri"),
      _.Btn({ size: "sm", outline: true, onClick: () => { runtimeLayout.closeAside(); runtimeDrawerLabel.value = "Drawer chiuso"; } }, "Chiudi"),
      _.Btn({ size: "sm", color: "primary", onClick: () => { runtimeLayout.toggleAside(); runtimeDrawerLabel.value = runtimeLayout.isDrawerOpen() ? "Drawer aperto" : "Drawer chiuso"; } }, "Toggle")
    )
  }),
  aside: _.Drawer({
    items: shellItems,
    header: _.Card({
      title: "Navigation",
      subtitle: "Il drawer puo essere aperto o chiuso da API"
    },
      _.Chip({ color: "success", outline: true }, "stateful")
    )
  }),
  page: buildOpsPage(runtimeView.value),
  footer: buildRuntimeFooter()
});

const setRuntimeView = (view) => {
  runtimeView.value = view;
  runtimeLayout.pageUpdate(buildOpsPage(view));
  runtimeLayout.footerUpdate(buildRuntimeFooter());
};

const listSample = {
  basic: {
    code: [
      _.Layout({
        minHeight: 560,
        drawerWidth: 290,
        stickyHeader: true,
        stickyAside: true,
        header: _.Header({
          left: false,
          title: "Fulfillment center",
          subtitle: "Shell completa con header, drawer, page e footer",
          right: _.div({ style: { display: "flex", gap: "8px", flexWrap: "wrap" } },
            _.Chip({ color: "success", outline: true, size: "sm" }, "SLA 99.1%"),
            _.Btn({ size: "sm", color: "primary" }, "Nuovo report")
          )
        }),
        aside: _.Drawer({
          items: shellItems,
          header: _.Card({
            title: "Workspace",
            subtitle: "Team operations EU"
          },
            _.Chip({ color: "info", outline: true }, "24/7")
          )
        }),
        page: buildOpsPage("overview"),
        footer: _.Footer({ align: "right" },
          _.Chip({ color: "secondary", outline: true, size: "sm" }, "refresh 60s"),
          _.Chip({ color: "success", outline: true, size: "sm" }, "all systems nominal")
        )
      })
    ],
    sample: [
      '_.Layout({',
      '  minHeight: 560,',
      '  drawerWidth: 290,',
      '  stickyHeader: true,',
      '  stickyAside: true,',
      '  header: _.Header({ left: false, title: "Fulfillment center", subtitle: "Shell completa con header, drawer, page e footer" }),',
      '  aside: _.Drawer({ items: shellItems, header: _.Card({ title: "Workspace" }, _.Chip({ color: "info", outline: true }, "24/7")) }),',
      '  page: buildOpsPage("overview"),',
      '  footer: _.Footer({ align: "right" }, _.Chip({ color: "secondary", outline: true, size: "sm" }, "refresh 60s"))',
      '});'
    ]
  },
  runtime: {
    code: [
      _.Card({ header: "Comandi live" },
        _.div({ style: { display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "12px" } },
          _.Btn({ size: "sm", outline: true, onClick: () => { runtimeLayout.openAside(); runtimeDrawerLabel.value = "Drawer aperto"; } }, "Apri drawer"),
          _.Btn({ size: "sm", outline: true, onClick: () => { runtimeLayout.closeAside(); runtimeDrawerLabel.value = "Drawer chiuso"; } }, "Chiudi drawer"),
          _.Btn({ size: "sm", color: "primary", onClick: () => { runtimeLayout.toggleAside(); runtimeDrawerLabel.value = runtimeLayout.isDrawerOpen() ? "Drawer aperto" : "Drawer chiuso"; } }, "Toggle drawer"),
          _.Btn({ size: "sm", onClick: () => setRuntimeView("overview") }, "Overview"),
          _.Btn({ size: "sm", onClick: () => setRuntimeView("incidents") }, "Incidents")
        ),
        _.div({ style: { display: "flex", gap: "8px", flexWrap: "wrap" } },
          _.Chip({ color: "info", outline: true }, runtimeDrawerLabel),
          _.Chip({ color: "secondary", outline: true }, () => `Pagina: ${runtimeView.value}`)
        )
      ),
      runtimeLayout
    ],
    sample: [
      'const runtimeLayout = _.Layout({',
      '  header: _.Header({ left: false, title: "Control room" }),',
      '  aside: _.Drawer({ items: shellItems }),',
      '  page: buildOpsPage("overview"),',
      '  footer: buildRuntimeFooter()',
      '});',
      'runtimeLayout.openAside();',
      'runtimeLayout.closeAside();',
      'runtimeLayout.toggleAside();',
      'runtimeLayout.pageUpdate(buildOpsPage("incidents"));',
      'runtimeLayout.footerUpdate(buildRuntimeFooter());'
    ]
  },
  slots: {
    code: [
      _.Layout({
        minHeight: 540,
        drawerWidth: 280,
        stickyHeader: true,
        gap: 12,
        slots: {
          header: ({ toggleAside }) => _.Header({
            left: false,
            title: "Campaign studio",
            subtitle: "Uso via slots + alias drawer/page",
            right: _.div({ style: { display: "flex", gap: "8px", flexWrap: "wrap" } },
              _.Btn({ size: "sm", outline: true, onClick: toggleAside }, "Toggle nav"),
              _.Chip({ color: "warning", outline: true, size: "sm" }, "draft 12")
            )
          }),
          drawer: () => _.Drawer({
            items: slotDrawerItems,
            header: _.Card({
              title: "Filters",
              subtitle: "Componenti reali nel drawer"
            },
              _.Checkbox({ model: slotFilterState.value.margin, color: "success" }, "Margine > 25%"),
              _.Checkbox({ model: slotFilterState.value.blocked, color: "warning" }, "Solo bloccati"),
              _.Checkbox({ model: slotFilterState.value.italy, color: "info" }, "Canale Italia"),
              _.div({ style: { display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "12px" } },
                _.Radio({ value: "margin", model: slotSortModel, color: "secondary" }, "Margine"),
                _.Radio({ value: "ctr", model: slotSortModel, color: "secondary" }, "CTR"),
                _.Radio({ value: "budget", model: slotSortModel, color: "secondary" }, "Budget")
              )
            )
          }),
          page: () => _.Page(
            _.Card({
              title: "Acquisition board",
              subtitle: "La pagina puo essere costruita interamente via slots",
              aside: _.Chip({ color: "primary", outline: true }, () => `sort: ${slotSortModel.value}`)
            },
              gridCards(
                statCard({ title: "Spend", value: "EUR 42.8k", tone: "primary", note: "Mese corrente" }),
                statCard({ title: "CTR", value: "3.84%", tone: "success", note: "Meta + Google" }),
                statCard({ title: "CPL", value: "EUR 18.40", tone: "warning", note: "Lead paid" })
              )
            ),
            _.Card({
              title: "Active campaigns",
              footer: _.div({ style: { display: "flex", gap: "8px", flexWrap: "wrap" } },
                _.Chip({ color: "success" }, "retargeting"),
                _.Chip({ color: "info" }, "search"),
                _.Chip({ color: "secondary" }, "crm sync")
              )
            },
              activityList([
                { title: "Spring launch - budget pacing al 92%", tone: "success", meta: "on track" },
                { title: "Brand search - CTR in calo", tone: "warning", meta: "watch" },
                { title: "Lead form B2B - CPL sopra target", tone: "danger", meta: "action" }
              ])
            )
          ),
          footer: () => _.Footer({ align: "right" },
            _.Chip({ color: "secondary", outline: true, size: "sm" }, "slot driven"),
            _.Chip({ color: "info", outline: true, size: "sm" }, () => `sort by ${slotSortModel.value}`)
          )
        }
      })
    ],
    sample: [
      '_.Layout({',
      '  drawerWidth: 280,',
      '  stickyHeader: true,',
      '  slots: {',
      '    header: ({ toggleAside }) => _.Header({ left: false, title: "Campaign studio", right: _.Btn({ onClick: toggleAside }, "Toggle nav") }),',
      '    drawer: () => _.Drawer({ items: slotDrawerItems }),',
      '    page: () => _.Page(_.Card({ title: "Acquisition board" }, "...")),',
      '    footer: () => _.Footer({ align: "right" }, _.Chip({ color: "secondary", outline: true }, "slot driven"))',
      '  }',
      '});'
    ]
  },
  resizable: {
    code: [
      _.Layout({
        minHeight: 560,
        drawerWidth: 260,
        navWidth: 300,
        drawerResizable: true,
        drawerMinWidth: 180,
        drawerMaxWidth: 420,
        navEnabled: true,
        navResizable: true,
        navMinWidth: 220,
        navMaxWidth: 460,
        stickyHeader: true,
        stickyAside: true,
        stickyNav: true,
        header: _.Header({
          left: false,
          title: "Workspace con rail ridimensionabili",
          subtitle: "Drag separato su drawer sinistro e nav destro",
          right: _.div({ style: { display: "flex", gap: "8px", flexWrap: "wrap" } },
            _.Chip({ color: "success", outline: true, size: "sm" }, "drawer 180-420"),
            _.Chip({ color: "info", outline: true, size: "sm" }, "nav 220-460")
          )
        }),
        aside: _.Drawer({
          items: shellItems,
          header: _.Card({
            title: "Planning",
            subtitle: "Rail sinistro con width regolabile"
          },
            _.Chip({ color: "primary", outline: true }, "resizable")
          )
        }),
        nav: buildInspectorNav(),
        page: buildOpsPage("overview"),
        footer: _.Footer({ align: "right" },
          _.Chip({ color: "secondary", outline: true, size: "sm" }, "desktop inline only"),
          _.Chip({ color: "warning", outline: true, size: "sm" }, "floating escluso")
        )
      })
    ],
    sample: [
      '_.Layout({',
      '  drawerWidth: 260,',
      '  navWidth: 300,',
      '  drawerResizable: true,',
      '  drawerMinWidth: 180,',
      '  drawerMaxWidth: 420,',
      '  navEnabled: true,',
      '  navResizable: true,',
      '  navMinWidth: 220,',
      '  navMaxWidth: 460,',
      '  aside: _.Drawer({ items: shellItems }),',
      '  nav: _.Card({ title: "Inspector" }, "..."),',
      '  page: buildOpsPage("overview")',
      '});'
    ]
  },
  contentFallback: {
    code: [
      _.Layout({
        minHeight: 420,
        noDrawer: true,
        stickyHeader: true,
        header: _.Header({
          left: false,
          title: "Content-first layout",
          subtitle: "Se non passi `page`, i children diventano la pagina"
        }),
        footer: _.Footer({ align: "right" },
          _.Chip({ color: "success", outline: true, size: "sm" }, "children -> page")
        )
      },
        _.Page(
          _.Card({
            title: "Landing editor",
            subtitle: "Uso compatto senza drawer"
          },
            _.p("Questo esempio mostra la firma `_.Layout(props, ...children)` con il contenuto principale passato direttamente come children."),
            _.div({ style: { display: "flex", gap: "8px", flexWrap: "wrap" } },
              _.Btn({ color: "primary" }, "Pubblica"),
              _.Btn({ outline: true }, "Anteprima"),
              _.Chip({ color: "info", outline: true }, "autosave attivo")
            )
          )
        )
      )
    ],
    sample: [
      '_.Layout({',
      '  noDrawer: true,',
      '  stickyHeader: true,',
      '  header: _.Header({ left: false, title: "Content-first layout" }),',
      '  footer: _.Footer({ align: "right" }, _.Chip({ color: "success", outline: true }, "children -> page"))',
      '},',
      '  _.Page(_.Card({ title: "Landing editor" }, "Contenuto principale"))',
      ');'
    ]
  }
};

const layout = _.div({ class: "cms-panel cms-page" },
  _.h1("Layout"),
  _.p("Layout composabile per shell applicative con header, drawer, nav destro, page e footer. Il drawer e attivo di default quando presente, il nav destro resta opt-in, e la shell supporta alias, fallback dei children, responsive e update runtime delle aree."),
  _.h2("Props principali"),
  _.List(
    _.Item("header, aside|drawer, nav|asideRight|drawerRight, page|main|content e footer per comporre le aree"),
    _.Item("slots.header, slots.drawer, slots.page, slots.footer e slots.default per costruzioni dinamiche"),
    _.Item("drawerEnabled controlla il rail sinistro ma di default e true, navEnabled abilita il rail destro"),
    _.Item("drawerOpen, navOpen, drawerBreakpoint, navBreakpoint, drawerWidth, navWidth, overlayClose, escClose per controllare i rail"),
    _.Item("drawerResizable, drawerMinWidth, drawerMaxWidth e navResizable, navMinWidth, navMaxWidth per il drag desktop dei rail inline"),
    _.Item("stickyHeader, stickyAside, stickyNav, stickyFooter, gap, minHeight e classi dedicate alle singole aree"),
    _.Item("API runtime: openAside(), closeAside(), toggleAside(), openNav(), closeNav(), toggleNav(), pageUpdate(), asideUpdate(), navUpdate(), footerUpdate()")
  ),
  _.h2("Documentazione API"),
  _.docTable("Layout"),
  _.h2("Esempi completi"),
  boxCode("Dashboard shell completa", listSample.basic, 24),
  boxCode("Drawer e page controllati via API", listSample.runtime, 24),
  boxCode("Slots e alias", listSample.slots, 24),
  boxCode("Rail ridimensionabili", listSample.resizable, 24),
  boxCode("Children come fallback della pagina", listSample.contentFallback, 24)
);

export { layout };
