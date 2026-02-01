const row = _h.div({ class: "cms-panel cms-page" },
  _h.h1("Row"),
  _h.p("Wrapper di layout in riga con classe `cms-row`. Accetta children o slot `default` per impilare contenuti in orizzontale."),
  _h.h2("Props principali"),
  _ui.List(
    _ui.Item("size: dimensione del componente (xs-sm-md-lg-xl)"),
    _ui.Item("state: success, warning, danger, info, primary, secondary"),
    _ui.Item("outline, shadow, borderRadius, clickable per stile e interazione")
  ),
  _h.h2("Esempio completo"),
  _ui.Card({ header: "Demo" },
    _ui.Row(_ui.Col("Col 1"), _ui.Col("Col 2"))
  ),
  _h.h2("Documentazione API"),
  CMSwift.ui.DocTable("Row")
);

export { row };
