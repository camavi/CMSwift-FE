const parallax = _.div({ class: "cms-panel cms-page" },
  _.h1("Parallax"),
  _.p("Sezione parallax con background image, height e speed. Supporta overlay/color/position e slot content."),
  _.h2("Props principali"),
  _.List(
    _.Item("size: dimensione del componente (xs-sm-md-lg-xl)"),
    _.Item("state: success, warning, danger, info, primary, secondary"),
    _.Item("outline, shadow, borderRadius, clickable per stile e interazione")
  ),
  _.h2("Esempio completo"),
  _.Card({ header: "Demo" },
    _.Parallax({ height: "220px" }, _.h2("Parallax"))
  ),
  _.h2("Documentazione API"),
  _.DocTable("Parallax")
);

export { parallax };
