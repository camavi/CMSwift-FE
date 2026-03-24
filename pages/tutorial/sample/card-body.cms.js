const cardBodySample = _.div({ class: "cms-panel cms-page" },
  _.h2("CardBody sample"),
  _.p("Body per card con slot `default`. Usalo per contenuti principali della card."),
  _.Card({ header: "Esempio" },
    _.Card(_.CardBody("Body"))
  )
);

export { cardBodySample };
