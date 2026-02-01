const cardHeaderSample = _h.div({ class: "cms-panel cms-page" },
  _h.h2("CardHeader sample"),
  _h.p("Header per card con layout flex, gap, align e divider opzionale. Utile per titoli e azioni."),
  _ui.Card({ header: "Esempio" },
    _ui.Card(_ui.CardHeader("Header"), _ui.CardBody("Body"), _ui.CardFooter(_ui.Btn("Action")))
  )
);

export { cardHeaderSample };
