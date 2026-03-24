const inputSample = _.div({ class: "cms-panel cms-page" },
  _.h2("Input sample"),
  _.p("Input con _.FormField integrato: label floating, hint/error, icon/prefix/suffix e clearable. Supporta model reattivo e onInput/onChange."),
  _.Card({ header: "Esempio" },
    _.Input({ label: "Nome", placeholder: "Inserisci nome" })
  )
);

export { inputSample };
