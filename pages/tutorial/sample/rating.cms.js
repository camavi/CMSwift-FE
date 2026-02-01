const ratingSample = _h.div({ class: "cms-panel cms-page" },
  _h.h2("Rating sample"),
  _h.p("Rating a stelle con `max`, value/model e modalita readonly. Slot `star` per render personalizzato."),
  _ui.Card({ header: "Esempio" },
    _ui.Rating({ value: 4 })
  )
);

export { ratingSample };
