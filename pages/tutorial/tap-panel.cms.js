const tabPanelModel = _.signal("overview");
const tabPanelSwipeModel = _.signal("one");
const tabPanelSlotsModel = _.signal("billing");

const panelBlock = (title, text) => _.div(
  _.h3(title),
  _.p(text),
  _.Row({ style: { display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" } },
    _.Btn({ color: "primary" }, "Azione primaria"),
    _.Btn({ outline: true }, "Secondaria")
  )
);

const basicTabs = [
  { name: "overview", label: "Overview", content: panelBlock("Overview", "Contenuto principale con azioni di base.") },
  { name: "details", label: "Dettagli", content: panelBlock("Dettagli", "Informazioni tecniche, note e metadati.") },
  { name: "history", label: "Storico", content: panelBlock("Storico", "Cronologia modifiche e attività recenti.") }
];

const wrapTabs = [
  { name: "profilo", label: "Profilo", icon: "👤", content: panelBlock("Profilo", "Dati account, visibilità e preferenze utente.") },
  { name: "billing", label: "Billing", icon: "💳", badge: "2", content: panelBlock("Billing", "Metodi di pagamento e fatture.") },
  { name: "team", label: "Team", icon: "🧩", content: panelBlock("Team", "Gestione membri e permessi.") },
  { name: "security", label: "Security", icon: "🔒", content: panelBlock("Security", "Sicurezza, sessioni e log.") },
  { name: "integrations", label: "Integrations", icon: "🔗", content: panelBlock("Integrations", "Connessioni esterne e webhook.") }
];

const swipeTabs = [
  { name: "one", label: "Step 1", content: panelBlock("Step 1", "Swipe per passare al prossimo pannello.") },
  { name: "two", label: "Step 2", content: panelBlock("Step 2", "Supporto infinite e animazioni.") },
  { name: "three", label: "Step 3", content: panelBlock("Step 3", "Conclusione e call to action.") }
];

const slotTabs = [
  { name: "billing", label: "Billing", icon: "💳", content: "Dettagli sui pagamenti e fatture." },
  { name: "usage", label: "Usage", icon: "📊", content: "Metriche e consumi mensili." },
  { name: "notifications", label: "Notifications", icon: "🔔", content: "Preferenze e canali di notifica." }
];

const tapPanel = _.div({ class: "cms-panel cms-page" },
  _.h1("TabPanel"),
  _.p("TabPanel gestisce barra di navigazione e pannelli associati. Supporta model, swipe, wrap, animazioni e slot di personalizzazione."),
  _.h2("Props principali"),
  _.List(
    _.Item("tabs: array con name/label/content"),
    _.Item("model: [get,set] signal per stato corrente"),
    _.Item("orientation: vertical | horizontal (default vertical)"),
    _.Item("navPosition: before | after"),
    _.Item("wrap, swipeable, infinite, animated, transitionDuration, transitionEasing"),
    _.Item("slots: nav, tab, label, panel, default")
  ),
  _.h2("Documentazione API"),
  _.docTable("TabPanel"),
  _.h2("Esempi completi"),
  _.Card({ header: "Base (verticale, nav before)", class: 'cms-m-b-md' },
    _.TabPanel({ tabs: basicTabs, model: tabPanelModel, orientation: "horizontal", })
  ),
  _.Card({ header: "Horizontal + wrap + nav after (label slot)", class: 'cms-m-b-md' },
    _.TabPanel({
      tabs: wrapTabs,
      orientation: "horizontal",
      wrap: true,
      navPosition: "after",
      slots: {
        label: ({ tab, active }) => _.span(
          { style: { display: "inline-flex", gap: "8px", alignItems: "center" } },
          _.span(tab.icon || "•"),
          _.span(tab.label),
          tab.badge ? _.Badge({ color: active ? "primary" : "var(--cms-secondary)" }, tab.badge) : null
        )
      }
    })
  ),
  _.Card({ header: "Swipe + infinite + animated", class: 'cms-m-b-md' },
    _.TabPanel({
      tabs: swipeTabs,
      model: tabPanelSwipeModel,
      swipeable: true,
      infinite: true,
      animated: true,
      transitionDuration: 280,
      transitionEasing: "cubic-bezier(0.2, 0.7, 0.2, 1)"
    })
  ),
  _.Card({ header: "Slots avanzati (nav + panel)", class: 'cms-m-b-md' },
    _.TabPanel({
      tabs: slotTabs,
      model: tabPanelSlotsModel,
      animated: true,
      slots: {
        nav: ({ tabs, select, active }) => _.div(
          { class: "cms-tabpanel-tabs" },
          ...tabs.map((tab) => _.button({
            class: `cms-tabpanel-tab${active() === tab.name ? " active" : ""}`,
            type: "button",
            onClick: () => select(tab.name)
          }, tab.icon || "•", " ", tab.label))
        ),
        panel: ({ tab }) => _.div(
          _.h3(`${tab.label} Panel`),
          _.p(tab.content),
          _.Btn({ color: "primary" }, "Configura")
        )
      }
    })
  )
);

export { tapPanel };
