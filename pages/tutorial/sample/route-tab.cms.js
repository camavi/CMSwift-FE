const routeTabSample = _h.div({ class: "cms-panel cms-page" },
  _h.h2("RouteTab sample"),
  _h.p("Tab link con `to` o `href`, supporto router e stato `active`. Usa slot `label` o children."),
  _ui.Card({ header: "Esempio" },
    _ui.RouteTab({ to: "#", active: true }, "Dashboard")
  )
);

export { routeTabSample };
