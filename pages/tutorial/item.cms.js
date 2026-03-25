const item = _.div({ class: "cms-panel cms-page" },
  _.h1("Item"),
  _.p("Elemento lista `<li>` con divider opzionale. Pensato per `_.List`."),
  _.h2("Props principali"),
  _.List(
    _.Item("size: dimensione del componente (xs-sm-md-lg-xl)"),
    _.Item("state: success, warning, danger, info, primary, secondary"),
    _.Item("outline, shadow, borderRadius, clickable per stile e interazione")
  ),
  _.h2("Esempio completo"),
  _.Card({ header: "Demo" },
    _.List(_.Item("Elemento"))
  ),
  _.h2("Documentazione API"),
  _.docTable("Item")
);

export { item };
