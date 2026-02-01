const formFieldSample = _h.div({ class: "cms-panel cms-page" },
  _h.h2("FormField sample"),
  _h.p("Wrapper per controlli con label floating, hint/error/success/warning/note e addons (icon/prefix/suffix). Supporta clearable e slot avanzati per override."),
  _ui.Card({ header: "Esempio" },
    _ui.FormField({ label: "Email", hint: "Helper text", control: _h.input({ class: "cms-input", placeholder: "email@example.com" }) })
  )
);

export { formFieldSample };
