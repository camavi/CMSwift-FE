const ratingSample = _.div({ class: "cms-panel cms-page" },
  _.h2("Rating sample"),
  _.p("Rating a stelle con `max`, value/model e modalita readonly. Slot `star` per render personalizzato."),
  _.Card({ header: "Esempio" },
    _.Rating({ value: 4 })
  )
);

export { ratingSample };
