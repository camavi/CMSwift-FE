const col = _h.div({ class: "cms-panel cms-page" },
  _h.h1("Col"),
  _h.p("Wrapper di layout in colonna con classe `cms-col`. Accetta children o slot `default` per contenuti verticali."),
  _h.h2("Props principali"),
  _ui.List(
    _ui.Item("size: dimensione del componente (xs-sm-md-lg-xl)"),
    _ui.Item("state: success, warning, danger, info, primary, secondary"),
    _ui.Item("outline, shadow, borderRadius, clickable per stile e interazione")
  ),
  _h.h2("Esempio completo"),
  _ui.Card({ header: "Demo" },
    _ui.Col({ col: 12 }, "Col 12")
  ),
  _h.h2("Documentazione API"),
  CMSwift.ui.DocTable("Col")
);

export { col };
