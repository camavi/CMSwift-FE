const appShell = _h.div({ class: "cms-panel cms-page" },
  _h.h1("AppShell"),
  _h.p("Shell semplice con header/drawer/page in una struttura base. Supporta noDrawer e slot dedicati."),
  _h.h2("Props principali"),
  _ui.List(
    _ui.Item("size: dimensione del componente (xs-sm-md-lg-xl)"),
    _ui.Item("state: success, warning, danger, info, primary, secondary"),
    _ui.Item("outline, shadow, borderRadius, clickable per stile e interazione")
  ),
  _h.h2("Esempio completo"),
  _ui.Card({ header: "Demo" },
    _ui.AppShell({ header: _ui.Header({ title: "CMSwift" }), page: _ui.Page("Contenuto"), drawer: _ui.Drawer({ items: [{ label: "Home", to: "#" }] }) })
  ),
  _h.h2("Documentazione API"),
  CMSwift.ui.DocTable("AppShell")
);

export { appShell };
