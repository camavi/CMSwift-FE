const appShellSample = _.div({ class: "cms-panel cms-page" },
  _.h2("AppShell sample"),
  _.p("Shell semplice con header/drawer/page in una struttura base. Supporta noDrawer e slot dedicati."),
  _.Card({ header: "Esempio" },
    _.AppShell({ header: _.Header({ title: "CMSwift" }), page: _.Page("Contenuto"), drawer: _.Drawer({ items: [{ label: "Home", to: "#" }] }) })
  )
);

export { appShellSample };
