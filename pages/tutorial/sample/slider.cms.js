const sliderSample = _.div({ class: "cms-panel cms-page" },
  _.h2("Slider sample"),
  _.p("Input range con min/max/step e binding a model. Emette onInput e onChange con valore numerico."),
  _.Card({ header: "Esempio" },
    _.Slider({ min: 0, max: 100, value: 40 })
  )
);

export { sliderSample };
