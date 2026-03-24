const cardFooterSample = _.div({ class: "cms-panel cms-page" },
  _.h2("cardFooter sample"),
  _.p("Footer per card con layout flex e divider opzionale. Ideale per azioni o info finali."),
  _.Card({ header: "Esempio" },
    _.Card(_.cardFooter(_.Btn("Action")))
  )
);

export { cardFooterSample };
