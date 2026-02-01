const appShellSample = _h.div({ class: "cms-panel cms-page" },
  _h.h2("AppShell sample"),
  _h.p("Shell semplice con header/drawer/page in una struttura base. Supporta noDrawer e slot dedicati."),
  _ui.Card({ header: "Esempio" },
    _ui.AppShell({ header: _ui.Header({ title: "CMSwift" }), page: _ui.Page("Contenuto"), drawer: _ui.Drawer({ items: [{ label: "Home", to: "#" }] }) })
  )
);

export { appShellSample };
