const cardBody = _.div({ class: "cms-panel cms-page" },
  _.h1("cardBody"),
  _.p("Body per card con slot `default`. Usalo per contenuti principali della card."),
  _.h2("Props principali"),
  _.List(
    _.Item("size: dimensione del componente (xs-sm-md-lg-xl)"),
    _.Item("state: success, warning, danger, info, primary, secondary"),
    _.Item("outline, shadow, borderRadius, clickable per stile e interazione")
  ),
  _.h2("Esempio completo"),
  _.Card({ header: "Demo" },
    _.Card(_.cardBody("Body"))
  ),
  _.h2("Documentazione API"),
  _.docTable("cardBody")
);

export { cardBody };
