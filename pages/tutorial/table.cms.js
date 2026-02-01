const table = _h.div({ class: "cms-panel cms-page" },
  _h.h1("Table"),
  _h.p("Tabella con sorting, paginazione, loading/empty state e azioni per riga. Supporta row click e render custom."),
  _h.h2("Props principali"),
  _ui.List(
    _ui.Item("size: dimensione del componente (xs-sm-md-lg-xl)"),
    _ui.Item("state: success, warning, danger, info, primary, secondary"),
    _ui.Item("outline, shadow, borderRadius, clickable per stile e interazione")
  ),
  _h.h2("Esempio completo"),
  _ui.Card({ header: "Demo" },
    _ui.Table({ columns: [{ key: "name", label: "Name" }, { key: "role", label: "Role" }], rows: [{ name: "Alice", role: "Admin" }, { name: "Bob", role: "Editor" }] })
  ),
  _h.h2("Documentazione API"),
  CMSwift.ui.DocTable("Table")
);

export { table };
