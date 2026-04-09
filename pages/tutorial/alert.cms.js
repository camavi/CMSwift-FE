import alertDoc from "./docs/alert.doc.js";

const createSection = (code, sample) => ({ code, sample });
const actionRow = (...children) => _.Toolbar({ gap: "8px", wrap: true }, ...children);

const listSample = {
  states: createSection(
    [
      _.Alert({
        type: "warning",
        title: "Review richiesta",
        message: "Tre promozioni usano uno sconto superiore alla soglia approvata.",
        meta: _.Chip({ dense: true, outline: true, color: "warning" }, "finance ops")
      }),
      _.Alert({
        type: "danger",
        title: "Import catalogo incompleto",
        message: "14 SKU non hanno immagini principali e restano fuori dal feed marketplace.",
        actions: _.Btn({ color: "danger", size: "sm" }, "Apri errori")
      }),
      _.Alert({
        type: "success",
        title: "Quality gate superato",
        message: "Smoke test checkout, promo e webhooks risultano tutti verdi."
      })
    ],
    [
      `_.Alert({
  type: "warning",
  title: "Review richiesta",
  message: "Tre promozioni usano uno sconto superiore alla soglia approvata.",
  meta: _.Chip({ dense: true, outline: true, color: "warning" }, "finance ops")
});`,
      `_.Alert({
  type: "danger",
  title: "Import catalogo incompleto",
  message: "14 SKU non hanno immagini principali e restano fuori dal feed marketplace.",
  actions: _.Btn({ color: "danger", size: "sm" }, "Apri errori")
});`,
      `_.Alert({
  type: "success",
  title: "Quality gate superato",
  message: "Smoke test checkout, promo e webhooks risultano tutti verdi."
});`
    ]
  ),
  actions: createSection(
    [
      _.Alert({
        type: "info",
        title: "ERP sincronizzato parzialmente",
        message: "I negozi EU hanno ricevuto il nuovo listino, UK e CH restano in coda.",
        description: "Puoi rilanciare solo i canali mancanti senza rifare il batch completo.",
        actions: actionRow(
          _.Btn({ outline: true, size: "sm" }, "Vedi log"),
          _.Btn({ color: "primary", size: "sm" }, "Retry canali")
        ),
        aside: _.Chip({ dense: true, outline: true, color: "info" }, "queue")
      })
    ],
    [`_.Alert({
  type: "info",
  title: "ERP sincronizzato parzialmente",
  message: "I negozi EU hanno ricevuto il nuovo listino, UK e CH restano in coda.",
  description: "Puoi rilanciare solo i canali mancanti senza rifare il batch completo.",
  actions: [
    _.Btn({ outline: true, size: "sm" }, "Vedi log"),
    _.Btn({ color: "primary", size: "sm" }, "Retry canali")
  ],
  aside: _.Chip({ dense: true, outline: true, color: "info" }, "queue")
});`]
  ),
  dismiss: createSection(
    [
      (() => {
        const hidden = _.rod(false);
        return _.div(
          () => hidden.value
            ? _.Alert({
              type: "secondary",
              title: "Alert chiuso",
              message: "Il dismiss e stato gestito via stato locale.",
              actions: _.Btn({ size: "sm", outline: true, onClick: () => { hidden.value = false; } }, "Ripristina")
            })
            : _.Alert({
              type: "secondary",
              title: "Promemoria team",
              message: "Chiudere questo blocco lo nasconde solo in questa vista.",
              dismissible: true,
              onDismiss: () => { hidden.value = true; }
            })
        );
      })()
    ],
    [`const hidden = _.rod(false);

() => hidden.value
  ? _.Alert({
      type: "secondary",
      title: "Alert chiuso",
      message: "Il dismiss e stato gestito via stato locale.",
      actions: _.Btn({ size: "sm", outline: true, onClick: () => { hidden.value = false; } }, "Ripristina")
    })
  : _.Alert({
      type: "secondary",
      title: "Promemoria team",
      message: "Chiudere questo blocco lo nasconde solo in questa vista.",
      dismissible: true,
      onDismiss: () => { hidden.value = true; }
    });`]
  )
};

const alert = _.div({ class: "cms-panel cms-page" },
  _.ComponentDocs({
    doc: alertDoc,
    api: () => _.docTable("Alert")
  }),
  _.h2("Esempi completi"),
  boxCode("Stati inline", listSample.states),
  boxCode("Recovery actions", listSample.actions),
  boxCode("Dismiss controllato", listSample.dismiss)
);

export { alert };
