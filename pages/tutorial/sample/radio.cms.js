const radioSample = _.div({ class: "cms-panel cms-page" },
  _.h2("Radio sample"),
  _.p("Radio button con label, value e supporto model. Gestisce onChange/onInput e classi dense."),
  _.Card({ header: "Esempio" },
    _.Radio({ label: "Opzione A", value: "A" })
  )
);

export { radioSample };
