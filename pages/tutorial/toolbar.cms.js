const toolbar = _.div({ class: "cms-panel cms-page" },
  _.h1("Toolbar"),
  _.p("Toolbar flessibile con gap, align, justify e wrap. Varianti dense/divider/elevated/sticky per barre di azioni."),
  _.h2("Props principali"),
  _.List(
    _.Item("size: dimensione del componente (xs-sm-md-lg-xl)"),
    _.Item("state: success, warning, danger, info, primary, secondary"),
    _.Item("outline, shadow, borderRadius, clickable per stile e interazione")
  ),
  _.h2("Esempio completo"),
  _.Card({ header: "Demo" },
    _.Toolbar(_.Btn("Action"), _.Spacer(), _.Btn({ variant: "primary" }, "Save"))
  ),
  _.h2("Documentazione API"),
  _.DocTable("Toolbar")
);

export { toolbar };
