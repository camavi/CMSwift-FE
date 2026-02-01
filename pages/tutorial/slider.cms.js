const slider = _h.div({ class: "cms-panel cms-page" },
  _h.h1("Slider"),
  _h.p("Input range con min/max/step e binding a model. Emette onInput e onChange con valore numerico."),
  _h.h2("Props principali"),
  _ui.List(
    _ui.Item("size: dimensione del componente (xs-sm-md-lg-xl)"),
    _ui.Item("state: success, warning, danger, info, primary, secondary"),
    _ui.Item("outline, shadow, borderRadius, clickable per stile e interazione")
  ),
  _h.h2("Esempio completo"),
  _ui.Card({ header: "Demo" },
    _ui.Slider({ min: 0, max: 100, value: 40 })
  ),
  _h.h2("Documentazione API"),
  CMSwift.ui.DocTable("Slider")
);

export { slider };
