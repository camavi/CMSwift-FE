const form = _h.div({ class: "cms-panel cms-page" },
  _h.h1("Form"),
  _h.p("Form wrapper integrato con `useForm`: gestisce submit async e stato submitting. Children possono essere function(form)."),
  _h.h2("Props principali"),
  _ui.List(
    _ui.Item("size: dimensione del componente (xs-sm-md-lg-xl)"),
    _ui.Item("state: success, warning, danger, info, primary, secondary"),
    _ui.Item("outline, shadow, borderRadius, clickable per stile e interazione")
  ),
  _h.h2("Esempio completo"),
  _ui.Card({ header: "Demo" },
    _ui.Form({ onSubmit: () => {} }, _ui.Input({ label: "Nome" }), _ui.Btn({ type: "submit", variant: "primary" }, "Invia"))
  ),
  _h.h2("Documentazione API"),
  CMSwift.ui.DocTable("Form")
);

export { form };
