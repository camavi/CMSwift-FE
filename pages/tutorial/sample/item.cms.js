const itemSample = _h.div({ class: "cms-panel cms-page" },
  _h.h2("Item sample"),
  _h.p("Elemento lista `<li>` con divider opzionale. Pensato per `UI.List`."),
  _ui.Card({ header: "Esempio" },
    _ui.List(_ui.Item("Elemento"))
  )
);

export { itemSample };
