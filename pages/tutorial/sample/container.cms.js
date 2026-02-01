const containerSample = _h.div({ class: "cms-panel cms-page" },
  _h.h2("Container sample"),
  _h.p("Contenitore base (`cms-container`) per vincolare larghezze e padding. Usa slot `default` o children."),
  _ui.Card({ header: "Esempio" },
    _ui.Container(_ui.Card("Contenuto"))
  )
);

export { containerSample };
