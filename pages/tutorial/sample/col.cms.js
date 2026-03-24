const colSample = _.div({ class: "cms-panel cms-page" },
  _.h2("Col sample"),
  _.p("Wrapper di layout in colonna con classe `cms-col`. Accetta children o slot `default` per contenuti verticali."),
  _.Card({ header: "Esempio" },
    _.Col({ col: 12 }, "Col 12")
  )
);

export { colSample };
