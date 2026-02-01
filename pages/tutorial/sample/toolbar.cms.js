const toolbarSample = _h.div({ class: "cms-panel cms-page" },
  _h.h2("Toolbar sample"),
  _h.p("Toolbar flessibile con gap, align, justify e wrap. Varianti dense/divider/elevated/sticky per barre di azioni."),
  _ui.Card({ header: "Esempio" },
    _ui.Toolbar(_ui.Btn("Action"), _ui.Spacer(), _ui.Btn({ variant: "primary" }, "Save"))
  )
);

export { toolbarSample };
