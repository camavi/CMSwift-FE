const tabPanelModel = CMSwift.reactive.signal("overview");
const tabPanelSwipeModel = CMSwift.reactive.signal("one");
const tabPanelSlotsModel = CMSwift.reactive.signal("billing");

const panelBlock = (title, text) => _h.div(
  _h.h3(title),
  _h.p(text),
  _ui.Row({ style: { display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" } },
    _ui.Btn({ color: "primary" }, "Azione primaria"),
    _ui.Btn({ outline: true }, "Secondaria")
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

const tapPanel = _h.div({ class: "cms-panel cms-page" },
  _h.h1("TabPanel"),
  _h.p("TabPanel gestisce barra di navigazione e pannelli associati. Supporta model, swipe, wrap, animazioni e slot di personalizzazione."),
  _h.h2("Props principali"),
  _ui.List(
    _ui.Item("tabs: array con name/label/content"),
    _ui.Item("model: [get,set] signal per stato corrente"),
    _ui.Item("orientation: vertical | horizontal (default vertical)"),
    _ui.Item("navPosition: before | after"),
    _ui.Item("wrap, swipeable, infinite, animated, transitionDuration, transitionEasing"),
    _ui.Item("slots: nav, tab, label, panel, default")
  ),
  _h.h2("Esempi completi"),
  _ui.Card({ header: "Base (verticale, nav before)" },
    _ui.TabPanel({ navPosition: "before", tabs: basicTabs, model: tabPanelModel })
  ),
  _ui.Card({ header: "Horizontal + wrap + nav after (label slot)" },
    _ui.TabPanel({
      tabs: wrapTabs,
      orientation: "horizontal",
      wrap: true,
      navPosition: "after",
      slots: {
        label: ({ tab, active }) => _h.span(
          { style: { display: "inline-flex", gap: "8px", alignItems: "center" } },
          _h.span(tab.icon || "•"),
          _h.span(tab.label),
          tab.badge ? _ui.Badge({ color: active ? "primary" : "var(--cms-secondary)" }, tab.badge) : null
        )
      }
    })
  ),
  _ui.Card({ header: "Swipe + infinite + animated" },
    _ui.TabPanel({
      tabs: swipeTabs,
      model: tabPanelSwipeModel,
      swipeable: true,
      infinite: true,
      animated: true,
      transitionDuration: 280,
      transitionEasing: "cubic-bezier(0.2, 0.7, 0.2, 1)"
    })
  ),
  _ui.Card({ header: "Slots avanzati (nav + panel)" },
    _ui.TabPanel({
      tabs: slotTabs,
      model: tabPanelSlotsModel,
      animated: true,
      slots: {
        nav: ({ tabs, select, active }) => _h.div(
          { class: "cms-tabpanel-tabs" },
          ...tabs.map((tab) => _h.button({
            class: `cms-tabpanel-tab${active() === tab.name ? " active" : ""}`,
            type: "button",
            onClick: () => select(tab.name)
          }, tab.icon || "•", " ", tab.label))
        ),
        panel: ({ tab }) => _h.div(
          _h.h3(`${tab.label} Panel`),
          _h.p(tab.content),
          _ui.Btn({ color: "primary" }, "Configura")
        )
      }
    })
  ),
  _h.h2("Documentazione API"),
  CMSwift.ui.DocTable("TabPanel")
);

export { tapPanel };
