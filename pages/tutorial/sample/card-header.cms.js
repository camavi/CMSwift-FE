const cardHeaderSample = _.div({ class: "cms-panel cms-page" },
  _.h2("cardHeader sample"),
  _.p("Header per card con layout flex, gap, align e divider opzionale. Utile per titoli e azioni."),
  _.Card({ header: "Esempio" },
    _.Card(_.cardHeader("Header"), _.cardBody("Body"), _.cardFooter(_.Btn("Action")))
  )
);

export { cardHeaderSample };
