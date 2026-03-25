const formField = _.div({ class: "cms-panel cms-page" },
  _.h1("FormField"),
  _.p("Wrapper per controlli con label floating, hint/error/success/warning/note e addons (icon/prefix/suffix). Supporta clearable e slot avanzati per override."),
  _.h2("Props principali"),
  _.List(
    _.Item("size: dimensione del componente (xs-sm-md-lg-xl)"),
    _.Item("state: success, warning, danger, info, primary, secondary"),
    _.Item("outline, shadow, borderRadius, clickable per stile e interazione")
  ),
  _.h2("Esempio completo"),
  _.Card({ header: "Demo" },
    _.FormField({ label: "Email", hint: "Helper text", control: _.input({ class: "cms-input", placeholder: "email@example.com" }) })
  ),
  _.h2("Documentazione API"),
  _.docTable("FormField")
);

export { formField };
