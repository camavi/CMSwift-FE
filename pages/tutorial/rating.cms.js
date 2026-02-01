const rating = _h.div({ class: "cms-panel cms-page" },
  _h.h1("Rating"),
  _h.p("Rating a stelle con `max`, value/model e modalita readonly. Slot `star` per render personalizzato."),
  _h.h2("Props principali"),
  _ui.List(
    _ui.Item("size: dimensione del componente (xs-sm-md-lg-xl)"),
    _ui.Item("state: success, warning, danger, info, primary, secondary"),
    _ui.Item("outline, shadow, borderRadius, clickable per stile e interazione")
  ),
  _h.h2("Esempio completo"),
  _ui.Card({ header: "Demo" },
    _ui.Rating({ value: 4 })
  ),
  _h.h2("Documentazione API"),
  CMSwift.ui.DocTable("Rating")
);

export { rating };
