const createSection = (code, sample) => ({ code, sample });

const listSample = {
  states: createSection(
    [
      _.Banner({
        type: "success",
        title: "Inventario riallineato",
        message: "Shopify, POS e backoffice mostrano lo stesso stock per 24 SKU.",
        meta: "Sincronizzazione completata 2 min fa"
      }),
      _.Banner({
        type: "warning",
        title: "Autorizzazioni in scadenza",
        message: "Tre ordini restano in attesa se il batch Stripe non viene rieseguito entro le 18:00.",
        meta: "Finance ops"
      }),
      _.Banner({
        type: "danger",
        title: "Webhook non consegnati",
        message: "Il provider courier ha risposto con timeout per 17 notifiche di tracking.",
        meta: "Richiede escalation al team integrazioni"
      }),
      _.Banner({
        type: "info",
        title: "Finestra manutenzione",
        message: "Mercoledi dalle 02:00 alle 02:15 CET il pannello analytics potrebbe essere lento.",
        meta: "Comunicazione piattaforma"
      })
    ],
    [
      `_.Banner({
  type: "success",
  title: "Inventario riallineato",
  message: "Shopify, POS e backoffice mostrano lo stesso stock per 24 SKU.",
  meta: "Sincronizzazione completata 2 min fa"
});`,
      `_.Banner({
  type: "warning",
  title: "Autorizzazioni in scadenza",
  message: "Tre ordini restano in attesa se il batch Stripe non viene rieseguito entro le 18:00.",
  meta: "Finance ops"
});`,
      `_.Banner({
  type: "danger",
  title: "Webhook non consegnati",
  message: "Il provider courier ha risposto con timeout per 17 notifiche di tracking.",
  meta: "Richiede escalation al team integrazioni"
});`,
      `_.Banner({
  type: "info",
  title: "Finestra manutenzione",
  message: "Mercoledi dalle 02:00 alle 02:15 CET il pannello analytics potrebbe essere lento.",
  meta: "Comunicazione piattaforma"
});`
    ]
  ),
  actions: createSection(
    [
      _.Banner({
        type: "warning",
        title: "Pagamenti da riconciliare",
        message: "7 prenotazioni hanno una preautorizzazione valida ma non ancora catturata.",
        description: "Controlla il batch di oggi prima della chiusura contabile per evitare cancellazioni automatiche.",
        actions: [
          _.Btn({ outline: true }, "Apri report"),
          _.Btn({ color: "warning" }, "Riprova cattura")
        ]
      }),
      _.Banner({
        type: "primary",
        variant: "solid",
        title: "Nuovo playbook rollout checkout",
        message: "Il team growth ha pubblicato il piano con checklist QA, metriche e rollback plan.",
        actionsPlacement: "bottom",
        actions: [
          _.Btn({ outline: true }, "Leggi summary"),
          _.Btn({ color: "dark" }, "Apri board")
        ]
      })
    ],
    [
      `_.Banner({
  type: "warning",
  title: "Pagamenti da riconciliare",
  message: "7 prenotazioni hanno una preautorizzazione valida ma non ancora catturata.",
  description: "Controlla il batch di oggi prima della chiusura contabile per evitare cancellazioni automatiche.",
  actions: [
    _.Btn({ outline: true }, "Apri report"),
    _.Btn({ color: "warning" }, "Riprova cattura")
  ]
});`,
      `_.Banner({
  type: "primary",
  variant: "solid",
  title: "Nuovo playbook rollout checkout",
  message: "Il team growth ha pubblicato il piano con checklist QA, metriche e rollback plan.",
  actionsPlacement: "bottom",
  actions: [
    _.Btn({ outline: true }, "Leggi summary"),
    _.Btn({ color: "dark" }, "Apri board")
  ]
});`
    ]
  ),
  layout: createSection(
    [
      _.Banner({
        type: "secondary",
        size: "lg",
        title: "Policy recensioni aggiornata",
        message: "Da oggi i contenuti con link esterni passano sempre in review manuale.",
        description: "La nuova regola riduce il rischio spam nei profili hospitality piu esposti.",
        meta: _.div({ style: { display: "flex", gap: "var(--cms-s-sm)", flexWrap: "wrap" } },
          _.Chip({ dense: true, outline: true, color: "secondary" }, "4 regole attive"),
          _.Chip({ dense: true, outline: true }, "Deploy 09:40")
        ),
        actionsPlacement: "bottom",
        actions: [
          _.Btn({ outline: true }, "Anteprima"),
          _.Btn({ color: "secondary" }, "Pubblica policy")
        ]
      }),
      _.Banner({
        type: "info",
        variant: "outline",
        dismissible: true,
        title: "Promemoria team",
        message: "Chiudere questo banner lo rimuove solo dalla view corrente.",
        description: "Utile per note temporanee, checklist giornaliere o messaggi di handoff."
      })
    ],
    [
      `_.Banner({
  type: "secondary",
  size: "lg",
  title: "Policy recensioni aggiornata",
  message: "Da oggi i contenuti con link esterni passano sempre in review manuale.",
  description: "La nuova regola riduce il rischio spam nei profili hospitality piu esposti.",
  meta: _.div({ style: { display: "flex", gap: "var(--cms-s-sm)", flexWrap: "wrap" } },
    _.Chip({ dense: true, outline: true, color: "secondary" }, "4 regole attive"),
    _.Chip({ dense: true, outline: true }, "Deploy 09:40")
  ),
  actionsPlacement: "bottom",
  actions: [
    _.Btn({ outline: true }, "Anteprima"),
    _.Btn({ color: "secondary" }, "Pubblica policy")
  ]
});`,
      `_.Banner({
  type: "info",
  variant: "outline",
  dismissible: true,
  title: "Promemoria team",
  message: "Chiudere questo banner lo rimuove solo dalla view corrente.",
  description: "Utile per note temporanee, checklist giornaliere o messaggi di handoff."
});`
    ]
  ),
  slots: createSection(
    [
      _.Banner({
        accent: "#4f7cff",
        slots: {
          icon: () => _.Avatar({ label: "QA", size: "md" }),
          title: () => "Release train Q2",
          message: () => "Board costruita via slot per separare dati, presentazione e azioni.",
          description: () => "Il layout resta leggibile anche con contenuti custom e controlli aggiuntivi.",
          actions: () => [
            _.Btn({ outline: true }, "Checklist"),
            _.Btn({ color: "primary" }, "Apri retro")
          ],
          aside: () => _.Chip({ dense: true, outline: true, color: "info" }, "Live")
        }
      },
        _.List(
          _.Item("Design review chiusa"),
          _.Item("QA cross-browser in corso"),
          _.Item("Cutoff feature freeze venerdi")
        )
      )
    ],
    [
      `_.Banner({
  accent: "#4f7cff",
  slots: {
    icon: () => _.Avatar({ label: "QA", size: "md" }),
    title: () => "Release train Q2",
    message: () => "Board costruita via slot per separare dati, presentazione e azioni.",
    description: () => "Il layout resta leggibile anche con contenuti custom e controlli aggiuntivi.",
    actions: () => [
      _.Btn({ outline: true }, "Checklist"),
      _.Btn({ color: "primary" }, "Apri retro")
    ],
    aside: () => _.Chip({ dense: true, outline: true, color: "info" }, "Live")
  }
},
  _.List(
    _.Item("Design review chiusa"),
    _.Item("QA cross-browser in corso"),
    _.Item("Cutoff feature freeze venerdi")
  )
);`
    ]
  )
};

const banner = _.div({ class: "cms-panel cms-page" },
  _.h1("Banner"),
  _.p("Banner standardizzato per stati operativi, note contestuali e avvisi con CTA. Supporta titolo, messaggio, descrizione, icona automatica, dismiss e composizione via slot."),
  _.h2("Props principali"),
  _.List(
    _.Item("type/state, accent, variant, size, dense, stack per tono visivo e layout"),
    _.Item("title, message, description, meta, body, icon, aside, actions per comporre il contenuto senza markup ripetuto"),
    _.Item("dismissible, dismiss, onDismiss, closeLabel per banner chiudibili"),
    _.Item("slots: icon, title, message, description, meta, actions, aside, dismiss, default per casi custom")
  ),
  _.h2("Documentazione API"),
  _.docTable("Banner"),
  _.h2("Esempi completi"),
  boxCode("Stati reali", listSample.states),
  boxCode("CTA e varianti", listSample.actions),
  boxCode("Layout e dismiss", listSample.layout),
  boxCode("Slots API", listSample.slots)
);

export { banner };
