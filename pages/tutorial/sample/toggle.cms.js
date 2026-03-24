const toggleSample = _.div({ class: "cms-panel cms-page" },
  _.h2("Toggle sample"),
  _.p("Switch toggle basato su checkbox con label. Supporta model, onChange/onInput e variante dense."),
  _.Card({ header: "Esempio" },
    _.Toggle({ label: "Attivo" })
  )
);

export { toggleSample };
