const container = _.div({ class: "cms-panel cms-page" },
  _.h1("Container"),
  _.p("Contenitore base (`cms-container`) per vincolare larghezze e padding. Usa slot `default` o children."),
  _.h2("Props principali"),
  _.List(
    _.Item("size: dimensione del componente (xs-sm-md-lg-xl)"),
    _.Item("state: success, warning, danger, info, primary, secondary"),
    _.Item("outline, shadow, borderRadius, clickable per stile e interazione")
  ),
  _.h2("Esempio completo"),
  _.Card({ header: "Demo" },
    _.Container(_.Card("Contenuto"))
  ),
  _.h2("Documentazione API"),
  _.DocTable("Container")
);

export { container };
