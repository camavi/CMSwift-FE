const containerSample = _.div({ class: "cms-panel cms-page" },
  _.h2("Container sample"),
  _.p("Contenitore base (`cms-container`) per vincolare larghezze e padding. Usa slot `default` o children."),
  _.Card({ header: "Esempio" },
    _.Container(_.Card("Contenuto"))
  )
);

export { containerSample };
