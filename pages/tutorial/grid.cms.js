const grid = _h.div({ class: "cms-panel cms-page" },
  _h.h1("Grid"),
  _h.p("Griglia CSS configurabile con `gap`, `cols`, `align` e `justify`. Utile per layout a colonne con classi `cms-grid`."),
  _h.h2("Props principali"),
  _ui.List(
    _ui.Item("size: dimensione del componente (xs-sm-md-lg-xl)"),
    _ui.Item("state: success, warning, danger, info, primary, secondary"),
    _ui.Item("outline, shadow, borderRadius, clickable per stile e interazione")
  ),
  _h.h2("Esempio completo"),
  _ui.Card({ header: "Demo" },
    _ui.Grid({ gap: "var(--cms-s-md)" }, _ui.GridCol({ span: 12 }, _ui.Card("A")), _ui.GridCol({ span: 12 }, _ui.Card("B")))
  ),
  _h.h2("Documentazione API"),
  CMSwift.ui.DocTable("Grid")
);

export { grid };
