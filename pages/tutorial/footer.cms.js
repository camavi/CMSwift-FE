const footer = _.div({ class: "cms-panel cms-page" },
  _.h1("Footer"),
  _.p("Footer con varianti sticky/dense/elevated e allineamento. Renderizza un `<footer>` con slot `default`."),
  _.h2("Props principali"),
  _.List(
    _.Item("size: dimensione del componente (xs-sm-md-lg-xl)"),
    _.Item("state: success, warning, danger, info, primary, secondary"),
    _.Item("outline, shadow, borderRadius, clickable per stile e interazione")
  ),
  _.h2("Esempio completo"),
  _.Card({ header: "Demo" },
    _.Footer("Footer")
  ),
  _.h2("Documentazione API"),
  _.docTable("Footer")
);

export { footer };
