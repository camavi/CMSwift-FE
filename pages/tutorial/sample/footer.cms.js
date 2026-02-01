const footerSample = _h.div({ class: "cms-panel cms-page" },
  _h.h2("Footer sample"),
  _h.p("Footer con varianti sticky/dense/elevated e allineamento. Renderizza un `<footer>` con slot `default`."),
  _ui.Card({ header: "Esempio" },
    _ui.Footer("Footer")
  )
);

export { footerSample };
