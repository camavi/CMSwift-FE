const inputRawSample = _.div({ class: "cms-panel cms-page" },
  _.h2("InputRaw sample"),
  _.p("Input nativo con classe `cms-input-raw`. Supporta binding a model (rod o signal) e gestione autofill per sincronizzare input/change."),
  _.Card({ header: "Esempio" },
    _.InputRaw({ placeholder: "Type..." })
  )
);

export { inputRawSample };
