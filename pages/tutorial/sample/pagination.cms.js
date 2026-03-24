const paginationSample = _.div({ class: "cms-panel cms-page" },
  _.h2("Pagination sample"),
  _.p("Paginazione con prev/next, label e max pagine. Supporta model e slot per prev/next/label."),
  _.Card({ header: "Esempio" },
    _.Pagination({ max: 8, value: 2 })
  )
);

export { paginationSample };
