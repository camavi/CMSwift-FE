const cardFooter = _.div({ class: "cms-panel cms-page" },
  _.h1("cardFooter"),
  _.p("Footer per card con layout flex e divider opzionale. Ideale per azioni o info finali."),
  _.h2("Props principali"),
  _.List(
    _.Item("size: dimensione del componente (xs-sm-md-lg-xl)"),
    _.Item("state: success, warning, danger, info, primary, secondary"),
    _.Item("outline, shadow, borderRadius, clickable per stile e interazione")
  ),
  _.h2("Esempio completo"),
  _.Card({ header: "Demo" },
    _.Card(_.cardFooter(_.Btn("Action")))
  ),
  _.h2("Documentazione API"),
  _.DocTable("cardFooter")
);

export { cardFooter };
