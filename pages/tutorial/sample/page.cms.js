const pageSample = _.div({ class: "cms-panel cms-page" },
  _.h2("Page sample"),
  _.p("Contenitore pagina (`cms-page`) per contenuti principali. Variante dense e slot `default`."),
  _.Card({ header: "Esempio" },
    _.Page(_.Card("Contenuto pagina"))
  )
);

export { pageSample };
