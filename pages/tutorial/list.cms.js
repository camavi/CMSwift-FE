const list = _h.div({ class: "cms-panel cms-page" },
  _h.h1("List"),
  _h.p("Lista base `<ul>` con variante dense. Usa slot `default` per inserire `UI.Item`."),
  _h.h2("Props principali"),
  _ui.List(
    _ui.Item("size: dimensione del componente (xs-sm-md-lg-xl)"),
    _ui.Item("state: success, warning, danger, info, primary, secondary"),
    _ui.Item("outline, shadow, borderRadius, clickable per stile e interazione")
  ),
  _h.h2("Esempio completo"),
  _ui.Card({ header: "Demo" },
    _ui.List(_ui.Item("Item 1"), _ui.Item("Item 2"))
  ),
  _h.h2("Documentazione API"),
  CMSwift.ui.DocTable("List")
);

export { list };
