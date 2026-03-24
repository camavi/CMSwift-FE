const date = _.div({ class: "cms-panel cms-page" },
  _.h1("Date"),
  _.p("Input type `date` con styling `cms-input`. Semplifica la gestione di date native."),
  _.h2("Props principali"),
  _.List(
    _.Item("size: dimensione del componente (xs-sm-md-lg-xl)"),
    _.Item("state: success, warning, danger, info, primary, secondary"),
    _.Item("outline, shadow, borderRadius, clickable per stile e interazione")
  ),
  _.h2("Esempio completo"),
  _.Card({ header: "Demo" },
    _.Date({ value: "2026-01-24" })
  ),
  _.h2("Documentazione API"),
  _.DocTable("Date")
);

export { date };
