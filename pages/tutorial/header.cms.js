const header = _.div({ class: "cms-panel cms-page" },
  _.h1("Header"),
  _.p("Header di app con title/subtitle e aree left/right. Include toggle drawer e icone personalizzabili."),
  _.h2("Props principali"),
  _.List(
    _.Item("size: dimensione del componente (xs-sm-md-lg-xl)"),
    _.Item("state: success, warning, danger, info, primary, secondary"),
    _.Item("outline, shadow, borderRadius, clickable per stile e interazione")
  ),
  _.h2("Esempio completo"),
  _.Card({ header: "Demo" },
    _.Header({ title: "CMSwift", subtitle: "UI Kit" })
  ),
  _.h2("Documentazione API"),
  _.docTable("Header")
);

export { header };
