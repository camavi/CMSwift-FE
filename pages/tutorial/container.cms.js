const container = _h.div({ class: "cms-panel cms-page" },
  _h.h1("Container"),
  _h.p("Contenitore base (`cms-container`) per vincolare larghezze e padding. Usa slot `default` o children."),
  _h.h2("Props principali"),
  _ui.List(
    _ui.Item("size: dimensione del componente (xs-sm-md-lg-xl)"),
    _ui.Item("state: success, warning, danger, info, primary, secondary"),
    _ui.Item("outline, shadow, borderRadius, clickable per stile e interazione")
  ),
  _h.h2("Esempio completo"),
  _ui.Card({ header: "Demo" },
    _ui.Container(_ui.Card("Contenuto"))
  ),
  _h.h2("Documentazione API"),
  CMSwift.ui.DocTable("Container")
);

export { container };
