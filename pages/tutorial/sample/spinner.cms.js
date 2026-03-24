const spinnerSample = _.div({ class: "cms-panel cms-page" },
  _.h2("Spinner sample"),
  _.p("Spinner animato con size, color e thickness. Utile per stati di caricamento puntuali."),
  _.Card({ header: "Esempio" },
    _.Spinner({ size: 24 })
  )
);

export { spinnerSample };
