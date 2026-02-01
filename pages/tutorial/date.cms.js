const date = _h.div({ class: "cms-panel cms-page" },
  _h.h1("Date"),
  _h.p("Input type `date` con styling `cms-input`. Semplifica la gestione di date native."),
  _h.h2("Props principali"),
  _ui.List(
    _ui.Item("size: dimensione del componente (xs-sm-md-lg-xl)"),
    _ui.Item("state: success, warning, danger, info, primary, secondary"),
    _ui.Item("outline, shadow, borderRadius, clickable per stile e interazione")
  ),
  _h.h2("Esempio completo"),
  _ui.Card({ header: "Demo" },
    _ui.Date({ value: "2026-01-24" })
  ),
  _h.h2("Documentazione API"),
  CMSwift.ui.DocTable("Date")
);

export { date };
