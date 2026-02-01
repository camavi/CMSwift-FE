const icon = _h.div({ class: "cms-panel cms-page" },
  _h.h1("Icon"),
  _h.p("Icona basata su sprite SVG o contenuto custom. Supporta size/color e slot `default` per icone personalizzate."),
  _h.h2("Props principali"),
  _ui.List(
    _ui.Item("size: dimensione del componente (xs-sm-md-lg-xl)"),
    _ui.Item("state: success, warning, danger, info, primary, secondary"),
    _ui.Item("outline, shadow, borderRadius, clickable per stile e interazione")
  ),
  _h.h2("Esempio completo"),
  _ui.Card({ header: "Demo" },
    _ui.Icon("#home")
  ),
  _h.h2("Documentazione API"),
  CMSwift.ui.DocTable("Icon")
);

export { icon };
