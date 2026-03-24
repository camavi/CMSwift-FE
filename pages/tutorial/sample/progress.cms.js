const progressSample = _.div({ class: "cms-panel cms-page" },
  _.h2("Progress sample"),
  _.p("Progress bar orizzontale con value 0-100, colore e variante striped. Dimensioni configurabili."),
  _.Card({ header: "Esempio" },
    _.Progress({ value: 45 })
  )
);

export { progressSample };
