const pagination = _.div({ class: "cms-panel cms-page" },
  _.h1("Pagination"),
  _.p("Paginazione con prev/next, label e max pagine. Supporta model e slot per prev/next/label."),
  _.h2("Props principali"),
  _.List(
    _.Item("size: dimensione del componente (xs-sm-md-lg-xl)"),
    _.Item("state: success, warning, danger, info, primary, secondary"),
    _.Item("outline, shadow, borderRadius, clickable per stile e interazione")
  ),
  _.h2("Esempio completo"),
  _.Card({ header: "Demo" },
    _.Pagination({ max: 8, value: 2 })
  ),
  _.h2("Documentazione API"),
  _.docTable("Pagination")
);

export { pagination };
