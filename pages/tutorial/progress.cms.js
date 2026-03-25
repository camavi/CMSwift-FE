const progress = _.div({ class: "cms-panel cms-page" },
  _.h1("Progress"),
  _.p("Progress bar orizzontale con value 0-100, colore e variante striped. Dimensioni configurabili."),
  _.h2("Props principali"),
  _.List(
    _.Item("size: dimensione del componente (xs-sm-md-lg-xl)"),
    _.Item("state: success, warning, danger, info, primary, secondary"),
    _.Item("outline, shadow, borderRadius, clickable per stile e interazione")
  ),
  _.h2("Esempio completo"),
  _.Card({ header: "Demo" },
    _.Progress({ value: 45 })
  ),
  _.h2("Documentazione API"),
  _.docTable("Progress")
);

export { progress };
