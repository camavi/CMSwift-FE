const toggleSample = _h.div({ class: "cms-panel cms-page" },
  _h.h2("Toggle sample"),
  _h.p("Switch toggle basato su checkbox con label. Supporta model, onChange/onInput e variante dense."),
  _ui.Card({ header: "Esempio" },
    _ui.Toggle({ label: "Attivo" })
  )
);

export { toggleSample };
