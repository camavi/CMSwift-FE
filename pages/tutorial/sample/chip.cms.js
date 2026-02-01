const chipSample = _h.div({ class: "cms-panel cms-page" },
  _h.h2("Chip sample"),
  _h.p("Chip compatto con icona e label, opzionale rimozione. Varianti dense/outline e slot per icon/label."),
  _ui.Card({ header: "Esempio" },
    _ui.Chip({ icon: "#tag", iconRight: "#x", removable: true }, "Chip")
  )
);

export { chipSample };
