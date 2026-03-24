const iconSample = _.div({ class: "cms-panel cms-page" },
  _.h2("Icon sample"),
  _.p("Icona basata su sprite SVG o contenuto custom. Supporta size/color e slot `default` per icone personalizzate."),
  _.Card({ header: "Esempio" },
    _.Icon("#home")
  )
);

export { iconSample };
