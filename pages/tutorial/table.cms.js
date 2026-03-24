const table = _.div({ class: "cms-panel cms-page" },
  _.h1("Table"),
  _.p("Tabella con sorting, paginazione, loading/empty state e azioni per riga. Supporta row click e render custom."),
  _.h2("Props principali"),
  _.List(
    _.Item("size: dimensione del componente (xs-sm-md-lg-xl)"),
    _.Item("state: success, warning, danger, info, primary, secondary"),
    _.Item("outline, shadow, borderRadius, clickable per stile e interazione")
  ),
  _.h2("Esempio completo"),
  _.Card({ header: "Demo" },
    _.Table({ columns: [{ key: "name", label: "Name" }, { key: "role", label: "Role" }], rows: [{ name: "Alice", role: "Admin" }, { name: "Bob", role: "Editor" }] })
  ),
  _.h2("Documentazione API"),
  _.DocTable("Table")
);

export { table };
