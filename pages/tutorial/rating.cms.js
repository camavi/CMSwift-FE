const rating = _.div({ class: "cms-panel cms-page" },
  _.h1("Rating"),
  _.p("Rating a stelle con `max`, value/model e modalita readonly. Slot `star` per render personalizzato."),
  _.h2("Props principali"),
  _.List(
    _.Item("size: dimensione del componente (xs-sm-md-lg-xl)"),
    _.Item("state: success, warning, danger, info, primary, secondary"),
    _.Item("outline, shadow, borderRadius, clickable per stile e interazione")
  ),
  _.h2("Esempio completo"),
  _.Card({ header: "Demo" },
    _.Rating({ value: 4 })
  ),
  _.h2("Documentazione API"),
  _.DocTable("Rating")
);

export { rating };
