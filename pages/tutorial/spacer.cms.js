const spacer = _h.div({ class: "cms-panel cms-page" },
  _h.h1("Spacer"),
  _h.p("Spaziatore flessibile (`cms-spacer`) per distribuire spazio tra elementi. Puoi inserirlo anche con contenuto opzionale."),
  _h.h2("Props principali"),
  _ui.List(
    _ui.Item("size: dimensione del componente (xs-sm-md-lg-xl)"),
    _ui.Item("state: success, warning, danger, info, primary, secondary"),
    _ui.Item("outline, shadow, borderRadius, clickable per stile e interazione")
  ),
  _h.h2("Esempio completo"),
  _ui.Card({ header: "Demo" },
    _ui.Row(_ui.Btn("Left"), _ui.Spacer(), _ui.Btn("Right"))
  ),
  _h.h2("Documentazione API"),
  CMSwift.ui.DocTable("Spacer")
);

export { spacer };
