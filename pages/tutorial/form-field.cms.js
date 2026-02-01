const formField = _h.div({ class: "cms-panel cms-page" },
  _h.h1("FormField"),
  _h.p("Wrapper per controlli con label floating, hint/error/success/warning/note e addons (icon/prefix/suffix). Supporta clearable e slot avanzati per override."),
  _h.h2("Props principali"),
  _ui.List(
    _ui.Item("size: dimensione del componente (xs-sm-md-lg-xl)"),
    _ui.Item("state: success, warning, danger, info, primary, secondary"),
    _ui.Item("outline, shadow, borderRadius, clickable per stile e interazione")
  ),
  _h.h2("Esempio completo"),
  _ui.Card({ header: "Demo" },
    _ui.FormField({ label: "Email", hint: "Helper text", control: _h.input({ class: "cms-input", placeholder: "email@example.com" }) })
  ),
  _h.h2("Documentazione API"),
  CMSwift.ui.DocTable("FormField")
);

export { formField };
