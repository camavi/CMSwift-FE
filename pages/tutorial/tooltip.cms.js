const tooltip = _h.div({ class: "cms-panel cms-page" },
  _h.h1("Tooltip"),
  _h.p("Tooltip overlay ancorato con hover/focus e delay. Puoi usarlo come wrapper o via API `bind/show/hide`."),
  _h.h2("Props principali"),
  _ui.List(
    _ui.Item("size: dimensione del componente (xs-sm-md-lg-xl)"),
    _ui.Item("state: success, warning, danger, info, primary, secondary"),
    _ui.Item("outline, shadow, borderRadius, clickable per stile e interazione")
  ),
  _h.h2("Esempio completo"),
  _ui.Card({ header: "Demo" },
    _ui.Tooltip(_ui.Btn("Hover"), "Tooltip text")
  ),
  _h.h2("Documentazione API"),
  CMSwift.ui.DocTable("Tooltip")
);

export { tooltip };
