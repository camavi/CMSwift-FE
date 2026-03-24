const dateSample = _.div({ class: "cms-panel cms-page" },
  _.h2("Date sample"),
  _.p("Input type `date` con styling `cms-input`. Semplifica la gestione di date native."),
  _.Card({ header: "Esempio" },
    _.Date({ value: "2026-01-24" })
  )
);

export { dateSample };
