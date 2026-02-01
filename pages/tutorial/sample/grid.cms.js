const gridSample = _h.div({ class: "cms-panel cms-page" },
  _h.h2("Grid sample"),
  _h.p("Griglia CSS configurabile con `gap`, `cols`, `align` e `justify`. Utile per layout a colonne con classi `cms-grid`."),
  _ui.Card({ header: "Esempio" },
    _ui.Grid({ gap: "var(--cms-s-md)" }, _ui.GridCol({ span: 12 }, _ui.Card("A")), _ui.GridCol({ span: 12 }, _ui.Card("B")))
  )
);

export { gridSample };
