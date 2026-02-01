const header = _h.div({ class: "cms-panel cms-page" },
  _h.h1("Header"),
  _h.p("Header di app con title/subtitle e aree left/right. Include toggle drawer e icone personalizzabili."),
  _h.h2("Props principali"),
  _ui.List(
    _ui.Item("size: dimensione del componente (xs-sm-md-lg-xl)"),
    _ui.Item("state: success, warning, danger, info, primary, secondary"),
    _ui.Item("outline, shadow, borderRadius, clickable per stile e interazione")
  ),
  _h.h2("Esempio completo"),
  _ui.Card({ header: "Demo" },
    _ui.Header({ title: "CMSwift", subtitle: "UI Kit" })
  ),
  _h.h2("Documentazione API"),
  CMSwift.ui.DocTable("Header")
);

export { header };
