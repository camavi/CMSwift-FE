const tooltip = _.div({ class: "cms-panel cms-page" },
  _.h1("Tooltip"),
  _.p("Tooltip overlay ancorato con hover/focus e delay. Puoi usarlo come wrapper o via API `bind/show/hide`."),
  _.h2("Props principali"),
  _.List(
    _.Item("size: dimensione del componente (xs-sm-md-lg-xl)"),
    _.Item("state: success, warning, danger, info, primary, secondary"),
    _.Item("outline, shadow, borderRadius, clickable per stile e interazione")
  ),
  _.h2("Esempio completo"),
  _.Card({ header: "Demo" },
    _.Tooltip(_.Btn("Hover"), "Tooltip text")
  ),
  _.h2("Documentazione API"),
  _.docTable("Tooltip")
);

export { tooltip };
