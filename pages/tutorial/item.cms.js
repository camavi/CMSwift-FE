const item = _h.div({ class: "cms-panel cms-page" },
  _h.h1("Item"),
  _h.p("Elemento lista `<li>` con divider opzionale. Pensato per `UI.List`."),
  _h.h2("Props principali"),
  _ui.List(
    _ui.Item("size: dimensione del componente (xs-sm-md-lg-xl)"),
    _ui.Item("state: success, warning, danger, info, primary, secondary"),
    _ui.Item("outline, shadow, borderRadius, clickable per stile e interazione")
  ),
  _h.h2("Esempio completo"),
  _ui.Card({ header: "Demo" },
    _ui.List(_ui.Item("Elemento"))
  ),
  _h.h2("Documentazione API"),
  CMSwift.ui.DocTable("Item")
);

export { item };
