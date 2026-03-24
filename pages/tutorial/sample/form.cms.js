const formSample = _.div({ class: "cms-panel cms-page" },
  _.h2("Form sample"),
  _.p("Form wrapper integrato con `useForm`: gestisce submit async e stato submitting. Children possono essere function(form)."),
  _.Card({ header: "Esempio" },
    _.Form({ onSubmit: () => {} }, _.Input({ label: "Nome" }), _.Btn({ type: "submit", variant: "primary" }, "Invia"))
  )
);

export { formSample };
