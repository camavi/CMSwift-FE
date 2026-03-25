const list = _.div({ class: "cms-panel cms-page" },
  _.h1("List"),
  _.p("Lista base `<ul>` con variante dense. Usa slot `default` per inserire `_.Item`."),
  _.h2("Props principali"),
  _.List(
    _.Item("size: dimensione del componente (xs-sm-md-lg-xl)"),
    _.Item("state: success, warning, danger, info, primary, secondary"),
    _.Item("outline, shadow, borderRadius, clickable per stile e interazione")
  ),
  _.h2("Esempio completo"),
  _.Card({ header: "Demo" },
    _.List(_.Item("Item 1"), _.Item("Item 2"))
  ),
  _.h2("Documentazione API"),
  _.docTable("List")
);

export { list };
