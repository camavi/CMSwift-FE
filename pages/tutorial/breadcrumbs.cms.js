const breadcrumbs = _h.div({ class: "cms-panel cms-page" },
  _h.h1("Breadcrumbs"),
  _h.p("Breadcrumbs con items e separatore configurabile. Slot `item` e `separator` per rendering custom."),
  _h.h2("Props principali"),
  _ui.List(
    _ui.Item("size: dimensione del componente (xs-sm-md-lg-xl)"),
    _ui.Item("state: success, warning, danger, info, primary, secondary"),
    _ui.Item("outline, shadow, borderRadius, clickable per stile e interazione")
  ),
  _h.h2("Esempio completo"),
  _ui.Card({ header: "Demo" },
    _ui.Breadcrumbs({ items: [{ label: "Home", to: "#" }, { label: "Docs" }] })
  ),
  _h.h2("Documentazione API"),
  CMSwift.ui.DocTable("Breadcrumbs")
);

export { breadcrumbs };
