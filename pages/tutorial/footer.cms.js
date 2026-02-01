const footer = _h.div({ class: "cms-panel cms-page" },
  _h.h1("Footer"),
  _h.p("Footer con varianti sticky/dense/elevated e allineamento. Renderizza un `<footer>` con slot `default`."),
  _h.h2("Props principali"),
  _ui.List(
    _ui.Item("size: dimensione del componente (xs-sm-md-lg-xl)"),
    _ui.Item("state: success, warning, danger, info, primary, secondary"),
    _ui.Item("outline, shadow, borderRadius, clickable per stile e interazione")
  ),
  _h.h2("Esempio completo"),
  _ui.Card({ header: "Demo" },
    _ui.Footer("Footer")
  ),
  _h.h2("Documentazione API"),
  CMSwift.ui.DocTable("Footer")
);

export { footer };
