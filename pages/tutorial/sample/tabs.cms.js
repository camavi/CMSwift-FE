const tabsModel = CMSwift.reactive.signal("overview");

const tabsSample = _h.div({ class: "cms-panel cms-page" },
  _h.h2("Tabs sample"),
  _h.p("Tabs basate su `tabs[]` con UI.Btn e supporto model. Slot `tab` per label e `default` per extra content."),
  _ui.Card({ header: "Esempio" },
    _ui.Tabs({ tabs: [{ label: "Overview", value: "overview" }, { label: "Settings", value: "settings" }], model: tabsModel })
  )
);

export { tabsSample };
