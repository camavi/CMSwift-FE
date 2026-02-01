const sliderSample = _h.div({ class: "cms-panel cms-page" },
  _h.h2("Slider sample"),
  _h.p("Input range con min/max/step e binding a model. Emette onInput e onChange con valore numerico."),
  _ui.Card({ header: "Esempio" },
    _ui.Slider({ min: 0, max: 100, value: 40 })
  )
);

export { sliderSample };
