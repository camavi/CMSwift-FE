const spacer = _.div({ class: "cms-panel cms-page" },
  _.h1("Spacer"),
  _.p("Spaziatore flessibile (`cms-spacer`) per distribuire spazio tra elementi. Puoi inserirlo anche con contenuto opzionale."),
  _.h2("Props principali"),
  _.List(
    _.Item("size: dimensione del componente (xs-sm-md-lg-xl)"),
    _.Item("state: success, warning, danger, info, primary, secondary"),
    _.Item("outline, shadow, borderRadius, clickable per stile e interazione")
  ),
  _.h2("Esempio completo"),
  _.Card({ header: "Demo" },
    _.Row(_.Btn("Left"), _.Spacer(), _.Btn("Right"))
  ),
  _.h2("Documentazione API"),
  _.docTable("Spacer")
);

export { spacer };
