const gridCol = _h.div({ class: "cms-panel cms-page" },
  _h.h1("GridCol"),
  _h.p("Colonna per UI.Grid con span e breakpoint `sm/md/lg`, oppure `auto`. Genera classi `cms-col-*` responsivi."),
  _h.h2("Props principali"),
  _ui.List(
    _ui.Item("size: dimensione del componente (xs-sm-md-lg-xl)"),
    _ui.Item("state: success, warning, danger, info, primary, secondary"),
    _ui.Item("outline, shadow, borderRadius, clickable per stile e interazione")
  ),
  _h.h2("Esempio completo"),
  _ui.Card({ header: "Demo" },
    _ui.Grid(_ui.GridCol({ span: 8 }, _ui.Card("Col 8")), _ui.GridCol({ span: 16 }, _ui.Card("Col 16")))
  ),
  _h.h2("Documentazione API"),
  CMSwift.ui.DocTable("GridCol")
);

export { gridCol };
