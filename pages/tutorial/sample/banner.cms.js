const bannerSample = _.div({ class: "cms-panel cms-page" },
  _.h2("Banner sample"),
  _.p("Banner informativo con messaggio e azioni opzionali. Supporta type, densita e slot message/actions."),
  _.Card({ header: "Esempio" },
    _.Banner({ type: "success", message: "Operazione completata" })
  )
);

export { bannerSample };
