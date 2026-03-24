const spacerSample = _.div({ class: "cms-panel cms-page" },
  _.h2("Spacer sample"),
  _.p("Spaziatore flessibile (`cms-spacer`) per distribuire spazio tra elementi. Puoi inserirlo anche con contenuto opzionale."),
  _.Card({ header: "Esempio" },
    _.Row(_.Btn("Left"), _.Spacer(), _.Btn("Right"))
  )
);

export { spacerSample };
