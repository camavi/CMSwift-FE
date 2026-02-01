const drawerSample = _h.div({ class: "cms-panel cms-page" },
  _h.h2("Drawer sample"),
  _h.p("Drawer di navigazione con items, gruppi e stato persistente. Supporta link, button, icone e closeOnSelect."),
  _ui.Card({ header: "Esempio" },
    _ui.Drawer({ items: [{ label: "Dashboard", to: "#", icon: "🏠" }, { label: "Settings", to: "#" }] })
  )
);

export { drawerSample };
