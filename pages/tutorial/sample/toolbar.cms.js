const toolbarSample = _.div({ class: "cms-panel cms-page" },
  _.h2("Toolbar sample"),
  _.p("Toolbar flessibile con gap, align, justify e wrap. Varianti dense/divider/elevated/sticky per barre di azioni."),
  _.Card({ header: "Esempio" },
    _.Toolbar(_.Btn("Action"), _.Spacer(), _.Btn({ variant: "primary" }, "Save"))
  )
);

export { toolbarSample };
