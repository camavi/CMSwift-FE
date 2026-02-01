const spinnerSample = _h.div({ class: "cms-panel cms-page" },
  _h.h2("Spinner sample"),
  _h.p("Spinner animato con size, color e thickness. Utile per stati di caricamento puntuali."),
  _ui.Card({ header: "Esempio" },
    _ui.Spinner({ size: 24 })
  )
);

export { spinnerSample };
