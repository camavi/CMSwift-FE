const layout = _h.div({ class: "cms-panel cms-page" },
  _h.h1("Layout"),
  _h.p("Layout app con header/aside/page/footer e drawer responsivo. Include overlay mobile, sticky opzionali e API per aprire/chiudere/aggiornare sezioni."),
  _h.h2("Props principali"),
  _ui.List(
    _ui.Item("size: dimensione del componente (xs-sm-md-lg-xl)"),
    _ui.Item("state: success, warning, danger, info, primary, secondary"),
    _ui.Item("outline, shadow, borderRadius, clickable per stile e interazione")
  ),
  _h.h2("Esempio completo"),
  _ui.Card({ header: "Demo" },
    _ui.Layout({ header: _ui.Header({ title: "CMSwift" }), aside: _ui.Drawer({ items: [{ label: "Home", to: "#" }] }), page: _ui.Page(_ui.Card("Contenuto pagina")), footer: _ui.Footer("Footer") })
  ),
  _h.h2("Documentazione API"),
  CMSwift.ui.DocTable("Layout")
);

export { layout };
