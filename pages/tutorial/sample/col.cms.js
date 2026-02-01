const colSample = _h.div({ class: "cms-panel cms-page" },
  _h.h2("Col sample"),
  _h.p("Wrapper di layout in colonna con classe `cms-col`. Accetta children o slot `default` per contenuti verticali."),
  _ui.Card({ header: "Esempio" },
    _ui.Col({ col: 12 }, "Col 12")
  )
);

export { colSample };
