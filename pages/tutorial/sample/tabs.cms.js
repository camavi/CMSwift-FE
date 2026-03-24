const tabsModel = _.signal("overview");

const tabsSample = _.div({ class: "cms-panel cms-page" },
  _.h2("Tabs sample"),
  _.p("Tabs basate su `tabs[]` con _.Btn e supporto model. Slot `tab` per label e `default` per extra content."),
  _.Card({ header: "Esempio" },
    _.Tabs({ tabs: [{ label: "Overview", value: "overview" }, { label: "Settings", value: "settings" }], model: tabsModel })
  )
);

export { tabsSample };
