const separator = _.div({ class: "cms-panel cms-page" },
  _.h1("Separator"),
  _.p("Separatore `<hr>` orizzontale o verticale con size configurabile. Ideale per dividere sezioni."),
  _.h2("Props principali"),
  _.List(
    _.Item("size: dimensione del componente (xs-sm-md-lg-xl)"),
    _.Item("state: success, warning, danger, info, primary, secondary"),
    _.Item("outline, shadow, borderRadius, clickable per stile e interazione")
  ),
  _.h2("Esempio completo"),
  _.Card({ header: "Demo" },
    _.Separator()
  ),
  _.h2("Documentazione API"),
  _.DocTable("Separator")
);

export { separator };
