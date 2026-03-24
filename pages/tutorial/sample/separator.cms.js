const separatorSample = _.div({ class: "cms-panel cms-page" },
  _.h2("Separator sample"),
  _.p("Separatore `<hr>` orizzontale o verticale con size configurabile. Ideale per dividere sezioni."),
  _.Card({ header: "Esempio" },
    _.Separator()
  )
);

export { separatorSample };
