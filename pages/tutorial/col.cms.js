const col = _.div({ class: "cms-panel cms-page" },
  _.h1("Col"),
  _.p("Wrapper di layout in colonna con classe `cms-col`. Accetta children o slot `default` per contenuti verticali."),
  _.h2("Props principali"),
  _.List(
    _.Item("size: dimensione del componente (xs-sm-md-lg-xl)"),
    _.Item("state: success, warning, danger, info, primary, secondary"),
    _.Item("outline, shadow, borderRadius, clickable per stile e interazione")
  ),
  _.h2("Esempio completo"),
  _.Card({ header: "Demo" },
    _.Col({ col: 12 }, "Col 12")
  ),
  _.h2("Documentazione API"),
  _.DocTable("Col")
);

export { col };
