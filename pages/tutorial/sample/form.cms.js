const formSample = _h.div({ class: "cms-panel cms-page" },
  _h.h2("Form sample"),
  _h.p("Form wrapper integrato con `useForm`: gestisce submit async e stato submitting. Children possono essere function(form)."),
  _ui.Card({ header: "Esempio" },
    _ui.Form({ onSubmit: () => {} }, _ui.Input({ label: "Nome" }), _ui.Btn({ type: "submit", variant: "primary" }, "Invia"))
  )
);

export { formSample };
