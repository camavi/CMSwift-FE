const inputRaw = _h.div({ class: "cms-panel cms-page" },
  _h.h1("InputRaw"),
  _h.p("Input nativo con classe `cms-input-raw`. Supporta binding a model (rod o signal) e gestione autofill per sincronizzare input/change."),
  _h.h2("Props principali"),
  _ui.List(
    _ui.Item("size: dimensione del componente (xs-sm-md-lg-xl)"),
    _ui.Item("state: success, warning, danger, info, primary, secondary"),
    _ui.Item("outline, shadow, borderRadius, clickable per stile e interazione")
  ),
  _h.h2("Esempio completo"),
  _ui.Card({ header: "Demo" },
    _ui.InputRaw({ placeholder: "Type..." })
  ),
  _h.h2("Documentazione API"),
  CMSwift.ui.DocTable("InputRaw")
);

export { inputRaw };
