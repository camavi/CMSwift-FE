const radio = _h.div({ class: "cms-panel cms-page" },
  _h.h1("Radio"),
  _h.p("Radio button con label, value e supporto model. Gestisce onChange/onInput e classi dense."),
  _h.h2("Props principali"),
  _ui.List(
    _ui.Item("size: dimensione del componente (xs-sm-md-lg-xl)"),
    _ui.Item("state: success, warning, danger, info, primary, secondary"),
    _ui.Item("outline, shadow, borderRadius, clickable per stile e interazione")
  ),
  _h.h2("Esempio completo"),
  _ui.Card({ header: "Demo" },
    _ui.Radio({ label: "Opzione A", value: "A" })
  ),
  _h.h2("Documentazione API"),
  CMSwift.ui.DocTable("Radio")
);

export { radio };
