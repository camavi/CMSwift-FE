const timeSample = _.div({ class: "cms-panel cms-page" },
  _.h2("Time sample"),
  _.p("Input type `time` con styling `cms-input`. Utile per orari standard."),
  _.Card({ header: "Esempio" },
    _.Time({ value: "09:30" })
  )
);

export { timeSample };
