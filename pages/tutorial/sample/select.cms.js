const selectSample = _h.div({ class: "cms-panel cms-page" },
  _h.h2("Select sample"),
  _h.p("Select custom con UI.FormField: gruppi, filtro, async options, multi-select e valori custom. Include tastiera, clearable e slot per opzioni/empty/loading."),
  _ui.Card({ header: "Esempio" },
    _ui.Select({ label: "Stato", options: ["Draft", "Live", "Archived"], value: "Live" })
  )
);

export { selectSample };
