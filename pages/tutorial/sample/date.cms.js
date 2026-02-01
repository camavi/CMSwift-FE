const dateSample = _h.div({ class: "cms-panel cms-page" },
  _h.h2("Date sample"),
  _h.p("Input type `date` con styling `cms-input`. Semplifica la gestione di date native."),
  _ui.Card({ header: "Esempio" },
    _ui.Date({ value: "2026-01-24" })
  )
);

export { dateSample };
