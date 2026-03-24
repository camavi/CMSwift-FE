const footerSample = _.div({ class: "cms-panel cms-page" },
  _.h2("Footer sample"),
  _.p("Footer con varianti sticky/dense/elevated e allineamento. Renderizza un `<footer>` con slot `default`."),
  _.Card({ header: "Esempio" },
    _.Footer("Footer")
  )
);

export { footerSample };
