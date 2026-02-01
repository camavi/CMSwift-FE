const cardFooter = _h.div({ class: "cms-panel cms-page" },
  _h.h1("CardFooter"),
  _h.p("Footer per card con layout flex e divider opzionale. Ideale per azioni o info finali."),
  _h.h2("Props principali"),
  _ui.List(
    _ui.Item("size: dimensione del componente (xs-sm-md-lg-xl)"),
    _ui.Item("state: success, warning, danger, info, primary, secondary"),
    _ui.Item("outline, shadow, borderRadius, clickable per stile e interazione")
  ),
  _h.h2("Esempio completo"),
  _ui.Card({ header: "Demo" },
    _ui.Card(_ui.CardFooter(_ui.Btn("Action")))
  ),
  _h.h2("Documentazione API"),
  CMSwift.ui.DocTable("CardFooter")
);

export { cardFooter };
