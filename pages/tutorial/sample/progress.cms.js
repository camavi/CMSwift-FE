const progressSample = _h.div({ class: "cms-panel cms-page" },
  _h.h2("Progress sample"),
  _h.p("Progress bar orizzontale con value 0-100, colore e variante striped. Dimensioni configurabili."),
  _ui.Card({ header: "Esempio" },
    _ui.Progress({ value: 45 })
  )
);

export { progressSample };
