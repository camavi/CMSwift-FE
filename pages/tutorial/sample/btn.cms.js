const btnSample = _.div({ class: "cms-panel cms-page" },
  _.h2("Button sample"),
  _.p("Bottone con varianti colore, outline, icona/label e stato loading. Gestisce disabilitazione, aria e animazione burst su pointerdown."),
  _.Card({ header: "Esempio" },
    _.Btn({ variant: "primary", icon: "#plus" }, "Primary")
  )
);

export { btnSample };
