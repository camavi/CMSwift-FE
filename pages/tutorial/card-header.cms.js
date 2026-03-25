const cardHeader = _.div({ class: "cms-panel cms-page" },
  _.h1("cardHeader"),
  _.p("Header per card con layout flex, gap, align e divider opzionale. Utile per titoli e azioni."),
  _.h2("Props principali"),
  _.List(
    _.Item("size: dimensione del componente (xs-sm-md-lg-xl)"),
    _.Item("state: success, warning, danger, info, primary, secondary"),
    _.Item("outline, shadow, borderRadius, clickable per stile e interazione")
  ),
  _.h2("Esempio completo"),
  _.Card({ header: "Demo" },
    _.Card(_.cardHeader("Header"), _.cardBody("Body"), _.cardFooter(_.Btn("Action")))
  ),
  _.h2("Documentazione API"),
  _.docTable("cardHeader")
);

export { cardHeader };
