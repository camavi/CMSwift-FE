const listSample = _.div({ class: "cms-panel cms-page" },
  _.h2("List sample"),
  _.p("Lista base `<ul>` con variante dense. Usa slot `default` per inserire `_.Item`."),
  _.Card({ header: "Esempio" },
    _.List(_.Item("Item 1"), _.Item("Item 2"))
  )
);

export { listSample };
