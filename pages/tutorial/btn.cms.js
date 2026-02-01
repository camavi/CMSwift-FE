const btn = _h.div({ class: "cms-panel cms-page" },
  _h.h1("Button"),
  _h.p("Bottone con varianti colore, outline, icona/label e stato loading. Gestisce disabilitazione, aria e animazione burst su pointerdown."),
  _h.h2("Props principali"),
  _ui.List(
    _ui.Item("size: dimensione del componente (xs-sm-md-lg-xl)"),
    _ui.Item("state: success, warning, danger, info, primary, secondary"),
    _ui.Item("outline, shadow, borderRadius, clickable per stile e interazione")
  ),
  _h.h2("Esempio completo"),
  _ui.Card({ header: "Demo" },
    _ui.Btn({ variant: "primary", icon: "#plus" }, "Primary")
  ),
  _h.h2("Documentazione API"),
  CMSwift.ui.DocTable("Btn")
);

export { btn };
