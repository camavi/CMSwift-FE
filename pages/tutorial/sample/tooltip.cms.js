const tooltipSample = _.div({ class: "cms-panel cms-page" },
  _.h2("Tooltip sample"),
  _.p("Tooltip overlay ancorato con hover/focus e delay. Puoi usarlo come wrapper o via API `bind/show/hide`."),
  _.Card({ header: "Esempio" },
    _.Tooltip(_.Btn("Hover"), "Tooltip text")
  )
);

export { tooltipSample };
