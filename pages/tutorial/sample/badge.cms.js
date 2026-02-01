const badgeSample = _h.div({ class: "cms-panel cms-page" },
  _h.h2("Badge sample"),
  _h.p("Badge inline a pillola con colore e dimensione configurabili. Usa `label` o slot `default`."),
  _ui.Card({ header: "Esempio" },
    _ui.Badge({ color: "primary" }, "New")
  )
);

export { badgeSample };
