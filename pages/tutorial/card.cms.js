const card = _.div({ class: "cms-panel cms-page" },
  _.h1("Card"),
  _.p("Card con header/body/footer opzionali, densita e variante flat. Supporta slot `header`, `footer`, `actions` e click routing via `to`."),
  _.h2("Props principali"),
  _.List(
    _.Item("size: dimensione del componente (xs-sm-md-lg-xl)"),
    _.Item("state: success, warning, danger, info, primary, secondary"),
    _.Item("outline, shadow, borderRadius, clickable per stile e interazione")
  ),
  _.h2("Esempio completo"),
  _.Card({ header: "Demo" },
    _.Card({ header: "Header", footer: "Footer" }, "Body")
  ),
  _.h2("Documentazione API"),
  _.docTable("Card")
);

export { card };
