const slider = _.div({ class: "cms-panel cms-page" },
  _.h1("Slider"),
  _.p("Input range con min/max/step e binding a model. Emette onInput e onChange con valore numerico."),
  _.h2("Props principali"),
  _.List(
    _.Item("size: dimensione del componente (xs-sm-md-lg-xl)"),
    _.Item("state: success, warning, danger, info, primary, secondary"),
    _.Item("outline, shadow, borderRadius, clickable per stile e interazione")
  ),
  _.h2("Esempio completo"),
  _.Card({ header: "Demo" },
    _.Slider({ min: 0, max: 100, value: 40 })
  ),
  _.h2("Documentazione API"),
  _.docTable("Slider")
);

export { slider };
