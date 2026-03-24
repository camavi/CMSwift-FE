const badgeSample = _.div({ class: "cms-panel cms-page" },
  _.h2("Badge sample"),
  _.p("Badge inline a pillola con colore e dimensione configurabili. Usa `label` o slot `default`."),
  _.Card({ header: "Esempio" },
    _.Badge({ color: "primary" }, "New")
  )
);

export { badgeSample };
