const breadcrumbs = _.div({ class: "cms-panel cms-page" },
  _.h1("Breadcrumbs"),
  _.p("Breadcrumbs con items e separatore configurabile. Slot `item` e `separator` per rendering custom."),
  _.h2("Props principali"),
  _.List(
    _.Item("size: dimensione del componente (xs-sm-md-lg-xl)"),
    _.Item("state: success, warning, danger, info, primary, secondary"),
    _.Item("outline, shadow, borderRadius, clickable per stile e interazione")
  ),
  _.h2("Esempio completo"),
  _.Card({ header: "Demo" },
    _.Breadcrumbs({ items: [{ label: "Home", to: "#" }, { label: "Docs" }] })
  ),
  _.h2("Documentazione API"),
  _.DocTable("Breadcrumbs")
);

export { breadcrumbs };
