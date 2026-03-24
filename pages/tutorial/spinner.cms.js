const spinner = _.div({ class: "cms-panel cms-page" },
  _.h1("Spinner"),
  _.p("Spinner animato con size, color e thickness. Utile per stati di caricamento puntuali."),
  _.h2("Props principali"),
  _.List(
    _.Item("size: dimensione del componente (xs-sm-md-lg-xl)"),
    _.Item("state: success, warning, danger, info, primary, secondary"),
    _.Item("outline, shadow, borderRadius, clickable per stile e interazione")
  ),
  _.h2("Esempio completo"),
  _.Card({ header: "Demo" },
    _.Spinner({ size: 24 })
  ),
  _.h2("Documentazione API"),
  _.DocTable("Spinner")
);

export { spinner };
