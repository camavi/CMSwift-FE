const rowSample = _.div({ class: "cms-panel cms-page" },
  _.h2("Row sample"),
  _.p("Wrapper di layout in riga con classe `cms-row`. Accetta children o slot `default` per impilare contenuti in orizzontale."),
  _.Card({ header: "Esempio" },
    _.Row(_.Col("Col 1"), _.Col("Col 2"))
  )
);

export { rowSample };
