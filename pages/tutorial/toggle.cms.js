const toggle = _.div({ class: "cms-panel cms-page" },
  _.h1("Toggle"),
  _.p("Switch toggle basato su checkbox con label. Supporta model, onChange/onInput e variante dense."),
  _.h2("Props principali"),
  _.List(
    _.Item("size: dimensione del componente (xs-sm-md-lg-xl)"),
    _.Item("state: success, warning, danger, info, primary, secondary"),
    _.Item("outline, shadow, borderRadius, clickable per stile e interazione")
  ),
  _.h2("Esempio completo"),
  _.Card({ header: "Demo" },
    _.Toggle({ label: "Attivo" })
  ),
  _.h2("Documentazione API"),
  _.DocTable("Toggle")
);

export { toggle };
