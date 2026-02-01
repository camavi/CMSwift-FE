const checkboxSample = _h.div({ class: "cms-panel cms-page" },
  _h.h2("Checkbox sample"),
  _h.p("Checkbox con label e supporto model reattivo. Espone onChange/onInput e variante dense."),
  _ui.Card({ header: "Esempio" },
    _ui.Checkbox({ label: "Accetta termini" })
  )
);

export { checkboxSample };
