const layoutSample = _.div({ class: "cms-panel cms-page" },
  _.h2("Layout sample"),
  _.p("Layout composabile con alias per drawer/page, children come fallback del contenuto principale e API runtime per aggiornare le sezioni."),
  _.Card({ header: "Esempio" },
    _.Layout({
      minHeight: 420,
      stickyHeader: true,
      drawerWidth: 260,
      header: _.Header({ left: false, title: "CMSwift", subtitle: "Layout sample" }),
      drawer: _.Drawer({ items: [{ label: "Home", to: "#" }, { label: "Orders", to: "#" }] }),
      footer: _.Footer({ align: "right" }, _.Chip({ color: "info", outline: true, size: "sm" }, "sample"))
    },
      _.Page(_.Card({ title: "Contenuto pagina" }, "Il contenuto principale arriva dai children del layout."))
    )
  )
);

export { layoutSample };
