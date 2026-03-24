const breadcrumbsSample = _.div({ class: "cms-panel cms-page" },
  _.h2("Breadcrumbs sample"),
  _.p("Breadcrumbs con items e separatore configurabile. Slot `item` e `separator` per rendering custom."),
  _.Card({ header: "Esempio" },
    _.Breadcrumbs({ items: [{ label: "Home", to: "#" }, { label: "Docs" }] })
  )
);

export { breadcrumbsSample };
