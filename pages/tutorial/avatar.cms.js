const avatar = _.div({ class: "cms-panel cms-page" },
  _.h1("Avatar"),
  _.p("Avatar con immagine `src` o fallback testuale. Supporta size, square e variante elevated."),
  _.h2("Props principali"),
  _.List(
    _.Item("size: dimensione del componente (xs-sm-md-lg-xl)"),
    _.Item("state: success, warning, danger, info, primary, secondary"),
    _.Item("outline, shadow, borderRadius, clickable per stile e interazione")
  ),
  _.h2("Esempio completo"),
  _.Card({ header: "Demo" },
    _.Avatar({ label: "CM", size: 40 })
  ),
  _.h2("Documentazione API"),
  _.DocTable("Avatar")
);

export { avatar };
