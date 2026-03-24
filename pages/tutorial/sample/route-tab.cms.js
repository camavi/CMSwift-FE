const routeTabSample = _.div({ class: "cms-panel cms-page" },
  _.h2("RouteTab sample"),
  _.p("Tab link con `to` o `href`, supporto router e stato `active`. Usa slot `label` o children."),
  _.Card({ header: "Esempio" },
    _.RouteTab({ to: "#", active: true }, "Dashboard")
  )
);

export { routeTabSample };
