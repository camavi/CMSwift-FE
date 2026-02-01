const listSample = _h.div({ class: "cms-panel cms-page" },
  _h.h2("List sample"),
  _h.p("Lista base `<ul>` con variante dense. Usa slot `default` per inserire `UI.Item`."),
  _ui.Card({ header: "Esempio" },
    _ui.List(_ui.Item("Item 1"), _ui.Item("Item 2"))
  )
);

export { listSample };
