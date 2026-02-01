const tooltipSample = _h.div({ class: "cms-panel cms-page" },
  _h.h2("Tooltip sample"),
  _h.p("Tooltip overlay ancorato con hover/focus e delay. Puoi usarlo come wrapper o via API `bind/show/hide`."),
  _ui.Card({ header: "Esempio" },
    _ui.Tooltip(_ui.Btn("Hover"), "Tooltip text")
  )
);

export { tooltipSample };
