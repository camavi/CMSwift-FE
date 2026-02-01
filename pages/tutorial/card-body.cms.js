const cardBody = _h.div({ class: "cms-panel cms-page" },
  _h.h1("CardBody"),
  _h.p("Body per card con slot `default`. Usalo per contenuti principali della card."),
  _h.h2("Props principali"),
  _ui.List(
    _ui.Item("size: dimensione del componente (xs-sm-md-lg-xl)"),
    _ui.Item("state: success, warning, danger, info, primary, secondary"),
    _ui.Item("outline, shadow, borderRadius, clickable per stile e interazione")
  ),
  _h.h2("Esempio completo"),
  _ui.Card({ header: "Demo" },
    _ui.Card(_ui.CardBody("Body"))
  ),
  _h.h2("Documentazione API"),
  CMSwift.ui.DocTable("CardBody")
);

export { cardBody };
