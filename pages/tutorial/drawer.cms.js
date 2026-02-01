const drawer = _h.div({ class: "cms-panel cms-page" },
  _h.h1("Drawer"),
  _h.p("Drawer di navigazione con items, gruppi e stato persistente. Supporta link, button, icone e closeOnSelect."),
  _h.h2("Props principali"),
  _ui.List(
    _ui.Item("size: dimensione del componente (xs-sm-md-lg-xl)"),
    _ui.Item("state: success, warning, danger, info, primary, secondary"),
    _ui.Item("outline, shadow, borderRadius, clickable per stile e interazione")
  ),
  _h.h2("Esempio completo"),
  _ui.Card({ header: "Demo" },
    _ui.Drawer({ items: [{ label: "Dashboard", to: "#", icon: "🏠" }, { label: "Settings", to: "#" }] })
  ),
  _h.h2("Documentazione API"),
  CMSwift.ui.DocTable("Drawer")
);

export { drawer };
