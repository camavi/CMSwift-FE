const rowSample = _h.div({ class: "cms-panel cms-page" },
  _h.h2("Row sample"),
  _h.p("Wrapper di layout in riga con classe `cms-row`. Accetta children o slot `default` per impilare contenuti in orizzontale."),
  _ui.Card({ header: "Esempio" },
    _ui.Row(_ui.Col("Col 1"), _ui.Col("Col 2"))
  )
);

export { rowSample };
