const inputRawSample = _h.div({ class: "cms-panel cms-page" },
  _h.h2("InputRaw sample"),
  _h.p("Input nativo con classe `cms-input-raw`. Supporta binding a model (rod o signal) e gestione autofill per sincronizzare input/change."),
  _ui.Card({ header: "Esempio" },
    _ui.InputRaw({ placeholder: "Type..." })
  )
);

export { inputRawSample };
