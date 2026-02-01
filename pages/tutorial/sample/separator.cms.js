const separatorSample = _h.div({ class: "cms-panel cms-page" },
  _h.h2("Separator sample"),
  _h.p("Separatore `<hr>` orizzontale o verticale con size configurabile. Ideale per dividere sezioni."),
  _ui.Card({ header: "Esempio" },
    _ui.Separator()
  )
);

export { separatorSample };
