const paginationSample = _h.div({ class: "cms-panel cms-page" },
  _h.h2("Pagination sample"),
  _h.p("Paginazione con prev/next, label e max pagine. Supporta model e slot per prev/next/label."),
  _ui.Card({ header: "Esempio" },
    _ui.Pagination({ max: 8, value: 2 })
  )
);

export { paginationSample };
