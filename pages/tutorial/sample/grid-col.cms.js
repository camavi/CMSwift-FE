const gridColSample = _h.div({ class: "cms-panel cms-page" },
  _h.h2("GridCol sample"),
  _h.p("Colonna per UI.Grid con span e breakpoint `sm/md/lg`, oppure `auto`. Genera classi `cms-col-*` responsivi."),
  _ui.Card({ header: "Esempio" },
    _ui.Grid(_ui.GridCol({ span: 8 }, _ui.Card("Col 8")), _ui.GridCol({ span: 16 }, _ui.Card("Col 16")))
  )
);

export { gridColSample };
