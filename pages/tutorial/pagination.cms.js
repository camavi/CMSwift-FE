const pagination = _h.div({ class: "cms-panel cms-page" },
  _h.h1("Pagination"),
  _h.p("Paginazione con prev/next, label e max pagine. Supporta model e slot per prev/next/label."),
  _h.h2("Props principali"),
  _ui.List(
    _ui.Item("size: dimensione del componente (xs-sm-md-lg-xl)"),
    _ui.Item("state: success, warning, danger, info, primary, secondary"),
    _ui.Item("outline, shadow, borderRadius, clickable per stile e interazione")
  ),
  _h.h2("Esempio completo"),
  _ui.Card({ header: "Demo" },
    _ui.Pagination({ max: 8, value: 2 })
  ),
  _h.h2("Documentazione API"),
  CMSwift.ui.DocTable("Pagination")
);

export { pagination };
