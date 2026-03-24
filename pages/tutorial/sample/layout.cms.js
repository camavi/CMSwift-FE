const layoutSample = _.div({ class: "cms-panel cms-page" },
  _.h2("Layout sample"),
  _.p("Layout app con header/aside/page/footer e drawer responsivo. Include overlay mobile, sticky opzionali e API per aprire/chiudere/aggiornare sezioni."),
  _.Card({ header: "Esempio" },
    _.Layout({ header: _.Header({ title: "CMSwift" }), aside: _.Drawer({ items: [{ label: "Home", to: "#" }] }), page: _.Page(_.Card("Contenuto pagina")), footer: _.Footer("Footer") })
  )
);

export { layoutSample };
