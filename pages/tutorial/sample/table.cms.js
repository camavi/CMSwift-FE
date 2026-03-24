const tableSample = _.div({ class: "cms-panel cms-page" },
  _.h2("Table sample"),
  _.p("Tabella con sorting, paginazione, loading/empty state e azioni per riga. Supporta row click e render custom."),
  _.Card({ header: "Esempio" },
    _.Table({ columns: [{ key: "name", label: "Name" }, { key: "role", label: "Role" }], rows: [{ name: "Alice", role: "Admin" }, { name: "Bob", role: "Editor" }] })
  )
);

export { tableSample };
