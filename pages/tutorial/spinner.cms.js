const spinner = _h.div({ class: "cms-panel cms-page" },
  _h.h1("Spinner"),
  _h.p("Spinner animato con size, color e thickness. Utile per stati di caricamento puntuali."),
  _h.h2("Props principali"),
  _ui.List(
    _ui.Item("size: dimensione del componente (xs-sm-md-lg-xl)"),
    _ui.Item("state: success, warning, danger, info, primary, secondary"),
    _ui.Item("outline, shadow, borderRadius, clickable per stile e interazione")
  ),
  _h.h2("Esempio completo"),
  _ui.Card({ header: "Demo" },
    _ui.Spinner({ size: 24 })
  ),
  _h.h2("Documentazione API"),
  CMSwift.ui.DocTable("Spinner")
);

export { spinner };
