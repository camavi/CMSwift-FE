const radioSample = _h.div({ class: "cms-panel cms-page" },
  _h.h2("Radio sample"),
  _h.p("Radio button con label, value e supporto model. Gestisce onChange/onInput e classi dense."),
  _ui.Card({ header: "Esempio" },
    _ui.Radio({ label: "Opzione A", value: "A" })
  )
);

export { radioSample };
