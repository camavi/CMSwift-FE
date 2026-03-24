const layout = _.div({ class: "cms-panel cms-page" },
  _.h1("Layout"),
  _.p("Layout app con header/aside/page/footer e drawer responsivo. Include overlay mobile, sticky opzionali e API per aprire/chiudere/aggiornare sezioni."),
  _.h2("Props principali"),
  _.List(
    _.Item("size: dimensione del componente (xs-sm-md-lg-xl)"),
    _.Item("state: success, warning, danger, info, primary, secondary"),
    _.Item("outline, shadow, borderRadius, clickable per stile e interazione")
  ),
  _.h2("Esempio completo"),
  _.Card({ header: "Demo" },
    _.Layout({ header: _.Header({ title: "CMSwift" }), aside: _.Drawer({ items: [{ label: "Home", to: "#" }] }), page: _.Page(_.Card("Contenuto pagina")), footer: _.Footer("Footer") })
  ),
  _.h2("Documentazione API"),
  _.DocTable("Layout")
);

export { layout };
