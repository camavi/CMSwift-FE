const time = _.div({ class: "cms-panel cms-page" },
  _.h1("Time"),
  _.p("Input type `time` con styling `cms-input`. Utile per orari standard."),
  _.h2("Props principali"),
  _.List(
    _.Item("size: dimensione del componente (xs-sm-md-lg-xl)"),
    _.Item("state: success, warning, danger, info, primary, secondary"),
    _.Item("outline, shadow, borderRadius, clickable per stile e interazione")
  ),
  _.h2("Esempio completo"),
  _.Card({ header: "Demo" },
    _.Time({ value: "09:30" })
  ),
  _.h2("Documentazione API"),
  _.docTable("Time")
);

export { time };
