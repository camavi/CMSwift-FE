const iconSample = _h.div({ class: "cms-panel cms-page" },
  _h.h2("Icon sample"),
  _h.p("Icona basata su sprite SVG o contenuto custom. Supporta size/color e slot `default` per icone personalizzate."),
  _ui.Card({ header: "Esempio" },
    _ui.Icon("#home")
  )
);

export { iconSample };
