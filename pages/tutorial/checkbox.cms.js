const checkbox = _h.div({ class: "cms-panel cms-page" },
  _h.h1("Checkbox"),
  _h.p("Checkbox con label e supporto model reattivo. Espone onChange/onInput e variante dense."),
  _h.h2("Props principali"),
  _ui.List(
    _ui.Item("size: dimensione del componente (xs-sm-md-lg-xl)"),
    _ui.Item("state: success, warning, danger, info, primary, secondary"),
    _ui.Item("outline, shadow, borderRadius, clickable per stile e interazione")
  ),
  _h.h2("Esempio completo"),
  _ui.Card({ header: "Demo" },
    _ui.Checkbox({ label: "Accetta termini" })
  ),
  _h.h2("Documentazione API"),
  CMSwift.ui.DocTable("Checkbox")
);

export { checkbox };
