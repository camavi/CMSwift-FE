const tabsModel = CMSwift.reactive.signal("overview");

const tabs = _h.div({ class: "cms-panel cms-page" },
  _h.h1("Tabs"),
  _h.p("Tabs basate su `tabs[]` con UI.Btn e supporto model. Slot `tab` per label e `default` per extra content."),
  _h.h2("Props principali"),
  _ui.List(
    _ui.Item("size: dimensione del componente (xs-sm-md-lg-xl)"),
    _ui.Item("state: success, warning, danger, info, primary, secondary"),
    _ui.Item("outline, shadow, borderRadius, clickable per stile e interazione")
  ),
  _h.h2("Esempio completo"),
  _ui.Card({ header: "Demo" },
    _ui.Tabs({ tabs: [{ label: "Overview", value: "overview" }, { label: "Settings", value: "settings" }], model: tabsModel })
  ),
  _h.h2("Documentazione API"),
  CMSwift.ui.DocTable("Tabs")
);

export { tabs };
