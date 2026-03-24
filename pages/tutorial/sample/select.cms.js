const selectSample = _.div({ class: "cms-panel cms-page" },
  _.h2("Select sample"),
  _.p("Select custom con _.FormField: gruppi, filtro, async options, multi-select e valori custom. Include tastiera, clearable e slot per opzioni/empty/loading."),
  _.Card({ header: "Esempio" },
    _.Select({ label: "Stato", options: ["Draft", "Live", "Archived"], value: "Live" })
  )
);

export { selectSample };
