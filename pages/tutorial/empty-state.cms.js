import emptyStateDoc from "./docs/empty-state.doc.js";

const createSection = (code, sample) => ({ code, sample });

const listSample = {
  zeroResults: createSection(
    [
      _.EmptyState({
        title: "Nessun risultato per i filtri attivi",
        message: "Prova a rimuovere brand, mercato o fascia prezzo per allargare la ricerca.",
        meta: _.Row({ gap: "8px", wrap: true },
          _.Chip({ dense: true, outline: true }, "Mercato: EU"),
          _.Chip({ dense: true, outline: true }, "Brand: Urban Trail"),
          _.Chip({ dense: true, outline: true }, "Prezzo: > EUR 200")
        ),
        actions: _.Row({ gap: "8px", wrap: true },
          _.Btn({ outline: true }, "Reset filtri"),
          _.Btn({ color: "primary" }, "Salva ricerca")
        )
      })
    ],
    [`_.EmptyState({
  title: "Nessun risultato per i filtri attivi",
  message: "Prova a rimuovere brand, mercato o fascia prezzo per allargare la ricerca.",
  meta: _.Row({ gap: "8px", wrap: true },
    _.Chip({ dense: true, outline: true }, "Mercato: EU"),
    _.Chip({ dense: true, outline: true }, "Brand: Urban Trail"),
    _.Chip({ dense: true, outline: true }, "Prezzo: > EUR 200")
  ),
  actions: _.Row({ gap: "8px", wrap: true },
    _.Btn({ outline: true }, "Reset filtri"),
    _.Btn({ color: "primary" }, "Salva ricerca")
  )
});`]
  ),
  onboarding: createSection(
    [
      _.EmptyState({
        eyebrow: "Campaigns",
        title: "La tua prima campagna parte da qui",
        message: "Non hai ancora creato campagne attive per il mercato retail.",
        description: "Imposta budget, audience e creativita iniziale. Il sistema ti guidera poi su tracciamenti e approval.",
        icon: "rocket_launch",
        actions: _.Row({ gap: "8px", wrap: true },
          _.Btn({ color: "primary" }, "Crea campagna"),
          _.Btn({ outline: true }, "Leggi playbook")
        ),
        state: "primary"
      })
    ],
    [`_.EmptyState({
  eyebrow: "Campaigns",
  title: "La tua prima campagna parte da qui",
  message: "Non hai ancora creato campagne attive per il mercato retail.",
  description: "Imposta budget, audience e creativita iniziale. Il sistema ti guidera poi su tracciamenti e approval.",
  icon: "rocket_launch",
  actions: [
    _.Btn({ color: "primary" }, "Crea campagna"),
    _.Btn({ outline: true }, "Leggi playbook")
  ],
  state: "primary"
});`]
  ),
  compact: createSection(
    [
      _.Grid({ cols: 2, gap: "var(--cms-s-md)" },
        _.GridCol(
          _.Card({ title: "Media kit", subtitle: "Spazio ancora vuoto" },
            _.EmptyState({
              compact: true,
              inline: true,
              title: "Nessun asset caricato",
              message: "Aggiungi immagini o video per iniziare.",
              actions: _.Btn({ size: "sm", color: "secondary" }, "Carica file"),
              state: "secondary"
            })
          )
        ),
        _.GridCol(
          _.Card({ title: "Segmenti CRM", subtitle: "Pannello empty inline" },
            _.EmptyState({
              compact: true,
              title: "Ancora nessun segmento",
              message: "Crea il primo pubblico per attivare le automazioni.",
              actions: _.Btn({ size: "sm", outline: true }, "Nuovo segmento")
            })
          )
        )
      )
    ],
    [`_.EmptyState({
  compact: true,
  inline: true,
  title: "Nessun asset caricato",
  message: "Aggiungi immagini o video per iniziare.",
  actions: _.Btn({ size: "sm", color: "secondary" }, "Carica file"),
  state: "secondary"
});`]
  )
};

const emptyState = _.div({ class: "cms-panel cms-page" },
  _.ComponentDocs({
    doc: emptyStateDoc,
    api: () => _.docTable("EmptyState")
  }),
  _.h2("Esempi completi"),
  boxCode("Zero results", listSample.zeroResults),
  boxCode("First-run onboarding", listSample.onboarding),
  boxCode("Compact / inline", listSample.compact)
);

export { emptyState };
