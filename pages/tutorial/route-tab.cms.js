const routeTab = _.div({ class: "cms-panel cms-page" },
  _.h1("RouteTab"),
  _.p("Tab link con `to` o `href`, supporto router e stato `active`. Usa slot `label` o children."),
  _.h2("Props principali"),
  _.List(
    _.Item("size: dimensione del componente (xs-sm-md-lg-xl)"),
    _.Item("state: success, warning, danger, info, primary, secondary"),
    _.Item("outline, shadow, borderRadius, clickable per stile e interazione")
  ),
  _.h2("Esempio completo"),
  _.Card({ header: "Demo" },
    _.RouteTab({ to: "#", active: true }, "Dashboard")
  ),
  _.h2("Documentazione API"),
  _.DocTable("RouteTab")
);

export { routeTab };
