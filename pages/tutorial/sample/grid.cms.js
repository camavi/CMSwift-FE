const gridSample = _.div({ class: "cms-panel cms-page" },
  _.h2("Grid sample"),
  _.p("Griglia CSS configurabile con `gap`, `cols`, `align` e `justify`. Utile per layout a colonne con classi `cms-grid`."),
  _.Card({ header: "Esempio" },
    _.Grid({ gap: "var(--cms-s-md)" }, _.GridCol({ span: 12 }, _.Card("A")), _.GridCol({ span: 12 }, _.Card("B")))
  )
);

export { gridSample };
