const cardHeader = _h.div({ class: "cms-panel cms-page" },
  _h.h1("CardHeader"),
  _h.p("Header per card con layout flex, gap, align e divider opzionale. Utile per titoli e azioni."),
  _h.h2("Props principali"),
  _ui.List(
    _ui.Item("size: dimensione del componente (xs-sm-md-lg-xl)"),
    _ui.Item("state: success, warning, danger, info, primary, secondary"),
    _ui.Item("outline, shadow, borderRadius, clickable per stile e interazione")
  ),
  _h.h2("Esempio completo"),
  _ui.Card({ header: "Demo" },
    _ui.Card(_ui.CardHeader("Header"), _ui.CardBody("Body"), _ui.CardFooter(_ui.Btn("Action")))
  ),
  _h.h2("Documentazione API"),
  CMSwift.ui.DocTable("CardHeader")
);

export { cardHeader };
