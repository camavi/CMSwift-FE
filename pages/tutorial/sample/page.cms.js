const pageSample = _h.div({ class: "cms-panel cms-page" },
  _h.h2("Page sample"),
  _h.p("Contenitore pagina (`cms-page`) per contenuti principali. Variante dense e slot `default`."),
  _ui.Card({ header: "Esempio" },
    _ui.Page(_ui.Card("Contenuto pagina"))
  )
);

export { pageSample };
