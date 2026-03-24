const cardHeaderSample = _.div({ class: "cms-panel cms-page" },
  _.h2("CardHeader sample"),
  _.p("Header per card con layout flex, gap, align e divider opzionale. Utile per titoli e azioni."),
  _.Card({ header: "Esempio" },
    _.Card(_.CardHeader("Header"), _.CardBody("Body"), _.CardFooter(_.Btn("Action")))
  )
);

export { cardHeaderSample };
