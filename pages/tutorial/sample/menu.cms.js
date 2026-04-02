const menuBtn = _.Btn({ color: "primary" }, "Apri menu");
const menuApi = _.Menu({
  title: "Azioni rapide",
  subtitle: "Menu item-driven con chiusura automatica su select.",
  items: [
    { label: "Profilo", icon: "person" },
    { label: "Workspace", icon: "workspaces" },
    { divider: true },
    { label: "Logout", icon: "logout", color: "danger" }
  ]
});

menuApi.bind(menuBtn);

const menuSample = _.div({ class: "cms-panel cms-page" },
  _.h2("Menu sample"),
  _.p("Menu overlay ancorato con `items`, header standard e API `bind/open/close/toggle/update`."),
  _.Card({ header: "Esempio" },
    _.Row(menuBtn)
  )
);

export { menuSample };
