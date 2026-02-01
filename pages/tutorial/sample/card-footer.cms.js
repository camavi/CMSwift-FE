const cardFooterSample = _h.div({ class: "cms-panel cms-page" },
  _h.h2("CardFooter sample"),
  _h.p("Footer per card con layout flex e divider opzionale. Ideale per azioni o info finali."),
  _ui.Card({ header: "Esempio" },
    _ui.Card(_ui.CardFooter(_ui.Btn("Action")))
  )
);

export { cardFooterSample };
