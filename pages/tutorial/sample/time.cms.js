const timeSample = _h.div({ class: "cms-panel cms-page" },
  _h.h2("Time sample"),
  _h.p("Input type `time` con styling `cms-input`. Utile per orari standard."),
  _ui.Card({ header: "Esempio" },
    _ui.Time({ value: "09:30" })
  )
);

export { timeSample };
