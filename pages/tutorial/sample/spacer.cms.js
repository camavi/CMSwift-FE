const spacerSample = _h.div({ class: "cms-panel cms-page" },
  _h.h2("Spacer sample"),
  _h.p("Spaziatore flessibile (`cms-spacer`) per distribuire spazio tra elementi. Puoi inserirlo anche con contenuto opzionale."),
  _ui.Card({ header: "Esempio" },
    _ui.Row(_ui.Btn("Left"), _ui.Spacer(), _ui.Btn("Right"))
  )
);

export { spacerSample };
