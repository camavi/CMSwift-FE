const formFieldSample = _.div({ class: "cms-panel cms-page" },
  _.h2("FormField sample"),
  _.p("Wrapper per controlli con label floating, hint/error/success/warning/note e addons (icon/prefix/suffix). Supporta clearable e slot avanzati per override."),
  _.Card({ header: "Esempio" },
    _.FormField({ label: "Email", hint: "Helper text", control: _.input({ class: "cms-input", placeholder: "email@example.com" }) })
  )
);

export { formFieldSample };
