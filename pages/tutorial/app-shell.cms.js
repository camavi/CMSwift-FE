const appShell = _.div({ class: "cms-panel cms-page" },
  _.h1("AppShell"),
  _.p("Shell semplice con header/drawer/page in una struttura base. Supporta noDrawer e slot dedicati."),
  _.h2("Props principali"),
  _.List(
    _.Item("size: dimensione del componente (xs-sm-md-lg-xl)"),
    _.Item("state: success, warning, danger, info, primary, secondary"),
    _.Item("outline, shadow, borderRadius, clickable per stile e interazione")
  ),
  _.h2("Esempio completo"),
  _.Card({ header: "Demo" },
    _.AppShell({ header: _.Header({ title: "CMSwift" }), page: _.Page("Contenuto"), drawer: _.Drawer({ items: [{ label: "Home", to: "#" }] }) })
  ),
  _.h2("Documentazione API"),
  _.DocTable("AppShell")
);

export { appShell };
