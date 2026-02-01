const cardSample = _h.div({ class: "cms-panel cms-page" },
  _h.h2("Card sample"),
  _h.p("Card con header/body/footer opzionali, densita e variante flat. Supporta slot `header`, `footer`, `actions` e click routing via `to`."),
  _ui.Card({ header: "Esempio" },
    _ui.Card({ header: "Header", footer: "Footer" }, "Body")
  )
);

export { cardSample };
