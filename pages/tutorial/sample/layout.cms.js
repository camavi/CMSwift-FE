const layoutSample = _h.div({ class: "cms-panel cms-page" },
  _h.h2("Layout sample"),
  _h.p("Layout app con header/aside/page/footer e drawer responsivo. Include overlay mobile, sticky opzionali e API per aprire/chiudere/aggiornare sezioni."),
  _ui.Card({ header: "Esempio" },
    _ui.Layout({ header: _ui.Header({ title: "CMSwift" }), aside: _ui.Drawer({ items: [{ label: "Home", to: "#" }] }), page: _ui.Page(_ui.Card("Contenuto pagina")), footer: _ui.Footer("Footer") })
  )
);

export { layoutSample };
