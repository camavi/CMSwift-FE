const banner = _.div({ class: "cms-panel cms-page" },
  _.h1("Banner"),
  _.p("Banner informativo con messaggio e azioni opzionali. Supporta type, densita e slot message/actions."),
  _.h2("Props principali"),
  _.List(
    _.Item("size: dimensione del componente (xs-sm-md-lg-xl)"),
    _.Item("state: success, warning, danger, info, primary, secondary"),
    _.Item("outline, shadow, borderRadius, clickable per stile e interazione")
  ),
  _.h2("Esempio completo"),
  _.Card({ header: "Demo" },
    _.Banner({ type: "success", message: "Operazione completata" })
  ),
  _.h2("Documentazione API"),
  _.docTable("Banner")
);

export { banner };
