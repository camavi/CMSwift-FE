const headerSample = _h.div({ class: "cms-panel cms-page" },
  _h.h2("Header sample"),
  _h.p("Header di app con title/subtitle e aree left/right. Include toggle drawer e icone personalizzabili."),
  _ui.Card({ header: "Esempio" },
    _ui.Header({ title: "CMSwift", subtitle: "UI Kit" })
  )
);

export { headerSample };
