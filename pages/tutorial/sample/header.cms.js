const headerSample = _.div({ class: "cms-panel cms-page" },
  _.h2("Header sample"),
  _.p("Header di app con title/subtitle e aree left/right. Include toggle drawer e icone personalizzabili."),
  _.Card({ header: "Esempio" },
    _.Header({ title: "CMSwift", subtitle: "UI Kit" })
  )
);

export { headerSample };
