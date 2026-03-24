const itemSample = _.div({ class: "cms-panel cms-page" },
  _.h2("Item sample"),
  _.p("Elemento lista `<li>` con divider opzionale. Pensato per `_.List`."),
  _.Card({ header: "Esempio" },
    _.List(_.Item("Elemento"))
  )
);

export { itemSample };
