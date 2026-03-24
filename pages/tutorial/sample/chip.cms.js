const chipSample = _.div({ class: "cms-panel cms-page" },
  _.h2("Chip sample"),
  _.p("Chip compatto con icona e label, opzionale rimozione. Varianti dense/outline e slot per icon/label."),
  _.Card({ header: "Esempio" },
    _.Chip({ icon: "#tag", iconRight: "#x", removable: true }, "Chip")
  )
);

export { chipSample };
