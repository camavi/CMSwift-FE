const progress = _h.div({ class: "cms-panel cms-page" },
  _h.h1("Progress"),
  _h.p("Progress bar orizzontale con value 0-100, colore e variante striped. Dimensioni configurabili."),
  _h.h2("Props principali"),
  _ui.List(
    _ui.Item("size: dimensione del componente (xs-sm-md-lg-xl)"),
    _ui.Item("state: success, warning, danger, info, primary, secondary"),
    _ui.Item("outline, shadow, borderRadius, clickable per stile e interazione")
  ),
  _h.h2("Esempio completo"),
  _ui.Card({ header: "Demo" },
    _ui.Progress({ value: 45 })
  ),
  _h.h2("Documentazione API"),
  CMSwift.ui.DocTable("Progress")
);

export { progress };
