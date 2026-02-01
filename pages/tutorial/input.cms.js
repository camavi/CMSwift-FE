const input = _h.div({ class: "cms-panel cms-page" },
  _h.h1("Input"),
  _h.p("Input con UI.FormField integrato: label floating, hint/error, icon/prefix/suffix e clearable. Supporta model reattivo e onInput/onChange."),
  _h.h2("Props principali"),
  _ui.List(
    _ui.Item("size: dimensione del componente (xs-sm-md-lg-xl)"),
    _ui.Item("state: success, warning, danger, info, primary, secondary"),
    _ui.Item("outline, shadow, borderRadius, clickable per stile e interazione")
  ),
  _h.h2("Esempio completo"),
  _ui.Card({ header: "Demo" },
    _ui.Input({ label: "Nome", placeholder: "Inserisci nome" })
  ),
  _h.h2("Documentazione API"),
  CMSwift.ui.DocTable("Input")
);

export { input };
