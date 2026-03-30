const createSection = (node, sample) => ({
  code: [node],
  sample: [sample]
});

const listSample = {
  summary: createSection(
    _.Card({
      identifier: _.Tooltip({
        title: "Featured case",
        content: "Case study con priorita alta per il team growth e design system.",
        placement: "top"
      }, _.Chip({ color: "warning", dense: true }, "Featured")),
      eyebrow: "Case study",
      title: "Checkout mobile ridisegnato per wallet e guest flow",
      subtitle: "Riduzione del drop-off del 18% grazie a step compressi, address lookup e pagamento express.",
      icon: "shopping_bag",
      aside: _.div({ style: { textAlign: "right" } },
        _.div({ style: { fontWeight: "700", fontSize: "18px" } }, "+18%"),
        _.div({ class: "cms-muted" }, "conversione")
      ),
      footer: _.span({ class: "cms-muted" }, "Aggiornato 2 ore fa da Product Design"),
      actions: [
        _.Btn({ color: "secondary" }, "Apri brief"),
        _.Btn({ color: "primary" }, "Vedi dettagli")
      ]
    },
      _.p("Il team ha accorpato login, indirizzo e conferma in un solo flusso guidato per ridurre attrito sui dispositivi piccoli."),
      _.List(
        _.Item("Express checkout con Apple Pay e Google Pay"),
        _.Item("Recap ordine sticky durante tutta la procedura"),
        _.Item("Fallback guest con validazioni progressive")
      )
    ),
    `_.Card({
  identifier: _.Tooltip({
    title: "Featured case",
    content: "Case study con priorita alta per il team growth e design system.",
    placement: "top"
  }, _.Chip({ color: "warning", dense: true }, "Featured")),
  eyebrow: "Case study",
  title: "Checkout mobile ridisegnato per wallet e guest flow",
  subtitle: "Riduzione del drop-off del 18% grazie a step compressi, address lookup e pagamento express.",
  icon: "shopping_bag",
  aside: _.div({ style: { textAlign: "right" } },
    _.div({ style: { fontWeight: "700", fontSize: "18px" } }, "+18%"),
    _.div({ class: "cms-muted" }, "conversione")
  ),
  footer: _.span({ class: "cms-muted" }, "Aggiornato 2 ore fa da Product Design"),
  actions: [
    _.Btn({ outline: true }, "Apri brief"),
    _.Btn({ color: "primary" }, "Vedi dettagli")
  ]
},
  _.p("Il team ha accorpato login, indirizzo e conferma in un solo flusso guidato per ridurre attrito sui dispositivi piccoli."),
  _.List(
    _.Item("Express checkout con Apple Pay e Google Pay"),
    _.Item("Recap ordine sticky durante tutta la procedura"),
    _.Item("Fallback guest con validazioni progressive")
  )
);`
  ),
  cover: createSection(
    _.Card({
      coverHeight: 220,
      cover: _.div({
        style: {
          minHeight: "220px",
          padding: "var(--cms-s-lg)",
          display: "flex",
          alignItems: "flex-end",
          background: "linear-gradient(135deg, #0f172a 0%, #14532d 100%)",
          color: "#fff"
        }
      },
        _.div(
          _.Badge({ color: "success", glossy: true }, "Disponibile"),
          _.div({ style: { fontSize: "24px", fontWeight: "700", marginTop: "10px" } }, "Suite lago, colazione inclusa"),
          _.div({ style: { opacity: "0.88", marginTop: "6px" } }, "Weekend lungo per coppie, check-in rapido e late checkout.")
        )
      ),
      bodyClass: "cms-p-t-lg",
      footer: _.span({ class: "cms-muted" }, "Tariffa flessibile con cancellazione gratuita"),
      actions: [
        _.Btn({ outline: true }, "Guarda camera"),
        _.Btn({ color: "primary" }, "Prenota ora")
      ]
    },
      _.div({ style: { display: "flex", gap: "var(--cms-s-sm)", flexWrap: "wrap" } },
        _.Chip({ dense: true, outline: true }, "Vista lago"),
        _.Chip({ dense: true, outline: true }, "Spa access"),
        _.Chip({ dense: true, outline: true }, "2 ospiti")
      ),
      _.p("Card ideale per listing hospitality, real estate o cataloghi premium con area visuale forte e CTA chiare.")
    ),
    `_.Card({
  coverHeight: 220,
  cover: _.div({
    style: {
      minHeight: "220px",
      padding: "var(--cms-s-lg)",
      display: "flex",
      alignItems: "flex-end",
      background: "linear-gradient(135deg, #0f172a 0%, #14532d 100%)",
      color: "#fff"
    }
  },
    _.div(
      _.Chip({ color: "success", dense: true, glass: true }, "Disponibile"),
      _.div({ style: { fontSize: "24px", fontWeight: "700", marginTop: "10px" } }, "Suite lago, colazione inclusa"),
      _.div({ style: { opacity: "0.88", marginTop: "6px" } }, "Weekend lungo per coppie, check-in rapido e late checkout.")
    )
  ),
  footer: _.span({ class: "cms-muted" }, "Tariffa flessibile con cancellazione gratuita"),
  actions: [
    _.Btn({ outline: true }, "Guarda camera"),
    _.Btn({ color: "primary" }, "Prenota ora")
  ]
},
  _.div({ style: { display: "flex", gap: "var(--cms-s-sm)", flexWrap: "wrap" } },
    _.Chip({ dense: true, outline: true }, "Vista lago"),
    _.Chip({ dense: true, outline: true }, "Spa access"),
    _.Chip({ dense: true, outline: true }, "2 ospiti")
  ),
  _.p("Card ideale per listing hospitality, real estate o cataloghi premium con area visuale forte e CTA chiare.")
);`
  ),
  composition: createSection(
    _.Card(
      _.cardHeader({ justify: "space-between", align: "center", wrap: true },
        _.div(
          _.div({ class: "cms-card-eyebrow" }, "Moderation"),
          _.div({ class: "cms-card-title" }, "Workflow approvazione recensioni"),
          _.div({ class: "cms-card-subtitle" }, "Regole attive per bloccare spam, linguaggio offensivo e link esterni.")
        ),
        _.Chip({ color: "warning", dense: true }, "4 regole")
      ),
      _.cardBody(
        _.Checkbox({ color: "success", checked: true }, "Approva automaticamente rating 4-5 con testo breve"),
        _.Checkbox({ color: "warning", checked: true }, "Invia in review manuale recensioni con link"),
        _.Checkbox({ color: "danger" }, "Blocca pubblicazione se rileva linguaggio offensivo"),
        _.Radio({ name: "sla-review", value: "2h", checked: true, color: "primary" }, "SLA review entro 2 ore"),
        _.Radio({ name: "sla-review", value: "same-day", color: "secondary" }, "SLA entro fine giornata")
      ),
      _.cardFooter({ justify: "space-between", wrap: true },
        _.span({ class: "cms-muted" }, "Ultimo deploy policy: oggi, 09:40"),
        _.div({ style: { display: "flex", gap: "var(--cms-s-sm)", flexWrap: "wrap" } },
          _.Btn({ outline: true }, "Anteprima"),
          _.Btn({ color: "primary" }, "Pubblica workflow")
        )
      )
    ),
    `_.Card(
  _.cardHeader({ justify: "space-between", align: "center", wrap: true },
    _.div(
      _.div({ class: "cms-card-eyebrow" }, "Moderation"),
      _.div({ class: "cms-card-title" }, "Workflow approvazione recensioni"),
      _.div({ class: "cms-card-subtitle" }, "Regole attive per bloccare spam, linguaggio offensivo e link esterni.")
    ),
    _.Chip({ color: "warning", dense: true }, "4 regole")
  ),
  _.cardBody(
    _.Checkbox({ color: "success", checked: true }, "Approva automaticamente rating 4-5 con testo breve"),
    _.Checkbox({ color: "warning", checked: true }, "Invia in review manuale recensioni con link"),
    _.Checkbox({ color: "danger" }, "Blocca pubblicazione se rileva linguaggio offensivo"),
    _.Radio({ name: "sla-review", value: "2h", checked: true, color: "primary" }, "SLA review entro 2 ore"),
    _.Radio({ name: "sla-review", value: "same-day", color: "secondary" }, "SLA entro fine giornata")
  ),
  _.cardFooter({ justify: "space-between", wrap: true },
    _.span({ class: "cms-muted" }, "Ultimo deploy policy: oggi, 09:40"),
    _.div({ style: { display: "flex", gap: "var(--cms-s-sm)", flexWrap: "wrap" } },
      _.Btn({ outline: true }, "Anteprima"),
      _.Btn({ color: "primary" }, "Pubblica workflow")
    )
  )
);`
  ),
  slots: createSection(
    _.Card({
      slots: {
        identifier: () => _.Chip({ color: "info", dense: true, outline: true }, "Live"),
        title: () => "Release board Q2",
        subtitle: () => "Card costruita via slot per separare dati, presentazione e azioni.",
        aside: () => _.Btn({ size: "sm", outline: true }, "Esporta"),
        actions: () => [
          _.Btn({ outline: true }, "Roadmap"),
          _.Btn({ color: "primary" }, "Apri board")
        ]
      }
    },
      _.List(
        _.Item("Design system: audit chiuso"),
        _.Item("Forms 2.0: test utente schedulati"),
        _.Item("Billing refresh: rilascio pilot venerdi")
      )
    ),
    `_.Card({
  slots: {
    identifier: () => _.Chip({ color: "info", dense: true, outline: true }, "Live"),
    title: () => "Release board Q2",
    subtitle: () => "Card costruita via slot per separare dati, presentazione e azioni.",
    aside: () => _.Btn({ size: "sm", outline: true }, "Esporta"),
    actions: () => [
      _.Btn({ outline: true }, "Roadmap"),
      _.Btn({ color: "primary" }, "Apri board")
    ]
  }
},
  _.List(
    _.Item("Design system: audit chiuso"),
    _.Item("Forms 2.0: test utente schedulati"),
    _.Item("Billing refresh: rilascio pilot venerdi")
  )
);`
  )
};

const card = _.div({ class: "cms-panel cms-page" },
  _.h1("Card"),
  _.p("Card standardizzata per blocchi editoriali, dashboard, listing e form. Supporta cover, media, header strutturato, footer con azioni e composizione diretta tramite `_.cardHeader`, `_.cardBody`, `_.cardFooter`."),
  _.h2("Props principali"),
  _.List(
    _.Item("title, subtitle, eyebrow, icon, aside per costruire header completi senza markup ripetuto"),
    _.Item("identifier, cover, media, image, coverHeight per gestire badge e aree visuali"),
    _.Item("body, footer, actions e slots per usare sia API dichiarativa sia composizione libera"),
    _.Item("dense, flat, clickable, to, class, bodyClass, headerClass, footerClass per adattare layout e interazione")
  ),
  _.h2("Documentazione API"),
  _.docTable("Card"),
  _.h2("Esempi completi"),
  boxCode("Summary / content card", listSample.summary),
  boxCode("Cover / visual hero", listSample.cover),
  boxCode("Composizione con cardHeader/cardBody/cardFooter", listSample.composition),
  boxCode("Slots API", listSample.slots)
);

export { card };
