const cardBodySample = _h.div({ class: "cms-panel cms-page" },
  _h.h2("CardBody sample"),
  _h.p("Body per card con slot `default`. Usalo per contenuti principali della card."),
  _ui.Card({ header: "Esempio" },
    _ui.Card(_ui.CardBody("Body"))
  )
);

export { cardBodySample };
