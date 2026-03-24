const gridCol = _.div({ class: "cms-panel cms-page" },
  _.h1("GridCol"),
  _.p("Colonna per _.Grid con span e breakpoint `sm/md/lg`, oppure `auto`. Genera classi `cms-col-*` responsivi."),
  _.h2("Props principali"),
  _.List(
    _.Item("size: dimensione del componente (xs-sm-md-lg-xl)"),
    _.Item("state: success, warning, danger, info, primary, secondary"),
    _.Item("outline, shadow, borderRadius, clickable per stile e interazione")
  ),
  _.h2("Esempio completo"),
  _.Card({ header: "Demo" },
    _.Grid(_.GridCol({ span: 8 }, _.Card("Col 8")), _.GridCol({ span: 16 }, _.Card("Col 16")))
  ),
  _.h2("Documentazione API"),
  _.DocTable("GridCol")
);

export { gridCol };
