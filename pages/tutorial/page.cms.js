const page = _.div({ class: "cms-panel cms-page" },
  _.h1("Page"),
  _.p("Contenitore pagina (`cms-page`) per contenuti principali. Variante dense e slot `default`."),
  _.h2("Props principali"),
  _.List(
    _.Item("size: dimensione del componente (xs-sm-md-lg-xl)"),
    _.Item("state: success, warning, danger, info, primary, secondary"),
    _.Item("outline, shadow, borderRadius, clickable per stile e interazione")
  ),
  _.h2("Esempio completo"),
  _.Card({ header: "Demo" },
    _.Page(_.Card("Contenuto pagina"))
  ),
  _.h2("Documentazione API"),
  _.docTable("Page")
);

export { page };
