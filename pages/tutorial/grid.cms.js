const grid = _.div({ class: "cms-panel cms-page" },
  _.h1("Grid"),
  _.p("Griglia CSS configurabile con `gap`, `cols`, `align` e `justify`. Utile per layout a colonne con classi `cms-grid`."),
  _.h2("Props principali"),
  _.List(
    _.Item("size: dimensione del componente (xs-sm-md-lg-xl)"),
    _.Item("state: success, warning, danger, info, primary, secondary"),
    _.Item("outline, shadow, borderRadius, clickable per stile e interazione")
  ),
  _.h2("Esempio completo"),
  _.Card({ header: "Demo" },
    _.Grid({ gap: "var(--cms-s-md)" }, _.GridCol({ span: 12 }, _.Card("A")), _.GridCol({ span: 12 }, _.Card("B")))
  ),
  _.h2("Documentazione API"),
  _.docTable("Grid")
);

export { grid };
