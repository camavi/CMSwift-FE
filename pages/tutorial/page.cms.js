const page = _h.div({ class: "cms-panel cms-page" },
  _h.h1("Page"),
  _h.p("Contenitore pagina (`cms-page`) per contenuti principali. Variante dense e slot `default`."),
  _h.h2("Props principali"),
  _ui.List(
    _ui.Item("size: dimensione del componente (xs-sm-md-lg-xl)"),
    _ui.Item("state: success, warning, danger, info, primary, secondary"),
    _ui.Item("outline, shadow, borderRadius, clickable per stile e interazione")
  ),
  _h.h2("Esempio completo"),
  _ui.Card({ header: "Demo" },
    _ui.Page(_ui.Card("Contenuto pagina"))
  ),
  _h.h2("Documentazione API"),
  CMSwift.ui.DocTable("Page")
);

export { page };
