const gridColSample = _.div({ class: "cms-panel cms-page" },
  _.h2("GridCol sample"),
  _.p("Colonna per _.Grid con span e breakpoint `sm/md/lg`, oppure `auto`. Genera classi `cms-col-*` responsivi."),
  _.Card({ header: "Esempio" },
    _.Grid(_.GridCol({ span: 8 }, _.Card("Col 8")), _.GridCol({ span: 16 }, _.Card("Col 16")))
  )
);

export { gridColSample };
