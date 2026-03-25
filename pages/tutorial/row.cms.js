const row = _.div({ class: "cms-panel cms-page" },
  _.h1("Row"),
  _.p("Wrapper di layout in riga con classe `cms-row`. Accetta children o slot `default` per impilare contenuti in orizzontale."),
  _.h2("Props principali"),
  _.List(
    _.Item("size: dimensione del componente (xs-sm-md-lg-xl)"),
    _.Item("state: success, warning, danger, info, primary, secondary"),
    _.Item("outline, shadow, borderRadius, clickable per stile e interazione")
  ),
  _.h2("Esempio completo"),
  _.Card({ header: "Demo" },
    _.Row(_.Col("Col 1"), _.Col("Col 2"))
  ),
  _.h2("Documentazione API"),
  _.docTable("Row")
);

export { row };
