const drawer = _.div({ class: "cms-panel cms-page" },
  _.h1("Drawer"),
  _.p("Drawer di navigazione con items, gruppi e stato persistente. Supporta link, button, icone e closeOnSelect."),
  _.h2("Props principali"),
  _.List(
    _.Item("size: dimensione del componente (xs-sm-md-lg-xl)"),
    _.Item("state: success, warning, danger, info, primary, secondary"),
    _.Item("outline, shadow, borderRadius, clickable per stile e interazione")
  ),
  _.h2("Esempio completo"),
  _.Card({ header: "Demo" },
    _.Drawer({ items: [{ label: "Dashboard", to: "#", icon: "🏠" }, { label: "Settings", to: "#" }] })
  ),
  _.h2("Documentazione API"),
  _.DocTable("Drawer")
);

export { drawer };
