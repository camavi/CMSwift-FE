const inputSample = _h.div({ class: "cms-panel cms-page" },
  _h.h2("Input sample"),
  _h.p("Input con UI.FormField integrato: label floating, hint/error, icon/prefix/suffix e clearable. Supporta model reattivo e onInput/onChange."),
  _ui.Card({ header: "Esempio" },
    _ui.Input({ label: "Nome", placeholder: "Inserisci nome" })
  )
);

export { inputSample };
