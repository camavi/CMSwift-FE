const time = _h.div({ class: "cms-panel cms-page" },
  _h.h1("Time"),
  _h.p("Input type `time` con styling `cms-input`. Utile per orari standard."),
  _h.h2("Props principali"),
  _ui.List(
    _ui.Item("size: dimensione del componente (xs-sm-md-lg-xl)"),
    _ui.Item("state: success, warning, danger, info, primary, secondary"),
    _ui.Item("outline, shadow, borderRadius, clickable per stile e interazione")
  ),
  _h.h2("Esempio completo"),
  _ui.Card({ header: "Demo" },
    _ui.Time({ value: "09:30" })
  ),
  _h.h2("Documentazione API"),
  CMSwift.ui.DocTable("Time")
);

export { time };
