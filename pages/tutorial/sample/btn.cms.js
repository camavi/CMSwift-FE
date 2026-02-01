const btnSample = _h.div({ class: "cms-panel cms-page" },
  _h.h2("Button sample"),
  _h.p("Bottone con varianti colore, outline, icona/label e stato loading. Gestisce disabilitazione, aria e animazione burst su pointerdown."),
  _ui.Card({ header: "Esempio" },
    _ui.Btn({ variant: "primary", icon: "#plus" }, "Primary")
  )
);

export { btnSample };
