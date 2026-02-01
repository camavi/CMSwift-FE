const toolbar = _h.div({ class: "cms-panel cms-page" },
  _h.h1("Toolbar"),
  _h.p("Toolbar flessibile con gap, align, justify e wrap. Varianti dense/divider/elevated/sticky per barre di azioni."),
  _h.h2("Props principali"),
  _ui.List(
    _ui.Item("size: dimensione del componente (xs-sm-md-lg-xl)"),
    _ui.Item("state: success, warning, danger, info, primary, secondary"),
    _ui.Item("outline, shadow, borderRadius, clickable per stile e interazione")
  ),
  _h.h2("Esempio completo"),
  _ui.Card({ header: "Demo" },
    _ui.Toolbar(_ui.Btn("Action"), _ui.Spacer(), _ui.Btn({ variant: "primary" }, "Save"))
  ),
  _h.h2("Documentazione API"),
  CMSwift.ui.DocTable("Toolbar")
);

export { toolbar };
