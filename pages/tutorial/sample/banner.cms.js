const bannerSample = _.div({ class: "cms-panel cms-page" },
  _.h2("Banner sample"),
  _.p("Esempio compatto con titolo, descrizione, CTA e dismiss."),
  _.div({ style: { display: "grid", gap: "var(--cms-s-md)" } },
    _.Banner({
      type: "warning",
      title: "Pagamenti da riconciliare",
      message: "7 prenotazioni hanno una preautorizzazione valida ma non ancora catturata.",
      description: "Controlla il batch Stripe entro le 18:00 per evitare cancellazioni automatiche.",
      actions: [
        _.Btn({ outline: true }, "Apri report"),
        _.Btn({ color: "warning" }, "Riprova cattura")
      ]
    }),
    _.Banner({
      type: "info",
      variant: "outline",
      dismissible: true,
      title: "Promemoria team",
      message: "Chiudere questo banner lo rimuove solo dalla view corrente."
    })
  )
);

export { bannerSample };
