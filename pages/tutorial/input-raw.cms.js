const inputRaw = _.div({ class: "cms-panel cms-page" },
  _.h1("InputRaw"),
  _.p("Input nativo con classe `cms-input-raw`. Supporta binding a model (rod o signal) e gestione autofill per sincronizzare input/change."),
  _.h2("Props principali"),
  _.List(
    _.Item("size: dimensione del componente (xs-sm-md-lg-xl)"),
    _.Item("state: success, warning, danger, info, primary, secondary"),
    _.Item("outline, shadow, borderRadius, clickable per stile e interazione")
  ),
  _.h2("Esempio completo"),
  _.Card({ header: "Demo" },
    _.InputRaw({ placeholder: "Type..." })
  ),
  _.h2("Documentazione API"),
  _.DocTable("InputRaw")
);

export { inputRaw };
