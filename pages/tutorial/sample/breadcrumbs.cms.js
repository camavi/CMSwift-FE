const breadcrumbsSample = _h.div({ class: "cms-panel cms-page" },
  _h.h2("Breadcrumbs sample"),
  _h.p("Breadcrumbs con items e separatore configurabile. Slot `item` e `separator` per rendering custom."),
  _ui.Card({ header: "Esempio" },
    _ui.Breadcrumbs({ items: [{ label: "Home", to: "#" }, { label: "Docs" }] })
  )
);

export { breadcrumbsSample };
