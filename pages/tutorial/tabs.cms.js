const tabsModel = _.signal("overview");

const tabs = _.div({ class: "cms-panel cms-page" },
  _.h1("Tabs"),
  _.p("Tabs basate su `tabs[]` con _.Btn e supporto model. Slot `tab` per label e `default` per extra content."),
  _.h2("Props principali"),
  _.List(
    _.Item("size: dimensione del componente (xs-sm-md-lg-xl)"),
    _.Item("state: success, warning, danger, info, primary, secondary"),
    _.Item("outline, shadow, borderRadius, clickable per stile e interazione")
  ),
  _.h2("Esempio completo"),
  _.Card({ header: "Demo" },
    _.Tabs({ tabs: [{ label: "Overview", value: "overview" }, { label: "Settings", value: "settings" }], model: tabsModel })
  ),
  _.h2("Documentazione API"),
  _.docTable("Tabs")
);

export { tabs };
