const checkboxSample = _.div({ class: "cms-panel cms-page" },
  _.h2("Checkbox sample"),
  _.p("Checkbox con label e supporto model reattivo. Espone onChange/onInput e variante dense."),
  _.Card({ header: "Esempio" },
    _.Checkbox({ label: "Accetta termini" })
  )
);

export { checkboxSample };
