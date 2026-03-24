const drawerSample = _.div({ class: "cms-panel cms-page" },
  _.h2("Drawer sample"),
  _.p("Drawer di navigazione con items, gruppi e stato persistente. Supporta link, button, icone e closeOnSelect."),
  _.Card({ header: "Esempio" },
    _.Drawer({ items: [{ label: "Dashboard", to: "#", icon: "🏠" }, { label: "Settings", to: "#" }] })
  )
);

export { drawerSample };
