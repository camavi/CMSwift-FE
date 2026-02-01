const tableSample = _h.div({ class: "cms-panel cms-page" },
  _h.h2("Table sample"),
  _h.p("Tabella con sorting, paginazione, loading/empty state e azioni per riga. Supporta row click e render custom."),
  _ui.Card({ header: "Esempio" },
    _ui.Table({ columns: [{ key: "name", label: "Name" }, { key: "role", label: "Role" }], rows: [{ name: "Alice", role: "Admin" }, { name: "Bob", role: "Editor" }] })
  )
);

export { tableSample };
