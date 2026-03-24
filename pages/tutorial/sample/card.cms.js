const cardSample = _.div({ class: "cms-panel cms-page" },
  _.h2("Card sample"),
  _.p("Card con header/body/footer opzionali, densita e variante flat. Supporta slot `header`, `footer`, `actions` e click routing via `to`."),
  _.Card({ header: "Esempio" },
    _.Card({ header: "Header", footer: "Footer" }, "Body")
  )
);

export { cardSample };
