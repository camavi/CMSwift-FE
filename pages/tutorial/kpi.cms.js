import kpiDoc from "./docs/kpi.doc.js";

const createSection = (code, sample) => ({ code, sample });

const listSample = {
  headline: createSection(
    [
      _.Grid({ cols: 3, gap: "var(--cms-s-md)" },
        _.GridCol(_.Kpi({
          eyebrow: "Revenue",
          title: "Fatturato ecommerce",
          value: "EUR 482k",
          delta: "+12.4%",
          trend: "up",
          note: "ultimi 30 giorni",
          meta: _.Chip({ dense: true, outline: true, color: "success" }, "vs target +8%"),
          state: "success"
        })),
        _.GridCol(_.Kpi({
          eyebrow: "Conversion",
          title: "Checkout completati",
          value: "3.42%",
          delta: "+0.4pt",
          trend: "up",
          note: "mobile e desktop",
          state: "primary"
        })),
        _.GridCol(_.Kpi({
          eyebrow: "Support",
          title: "Ticket aperti",
          value: "27",
          delta: "-6",
          trend: "down",
          note: "SLA 2h",
          state: "warning"
        }))
      )
    ],
    [`_.Kpi({
  eyebrow: "Revenue",
  title: "Fatturato ecommerce",
  value: "EUR 482k",
  delta: "+12.4%",
  trend: "up",
  note: "ultimi 30 giorni",
  meta: _.Chip({ dense: true, outline: true, color: "success" }, "vs target +8%"),
  state: "success"
});`]
  ),
  media: createSection(
    [
      _.Kpi({
        eyebrow: "Acquisition",
        title: "Nuove iscrizioni CRM",
        value: "18,240",
        delta: "+9%",
        trend: "up",
        note: "campagne Q2 / EU market",
        media: _.Progress({ value: 68, state: "info", showValue: true, note: "68% del target trimestrale" }),
        meta: _.Row({ gap: "8px", wrap: true },
          _.Chip({ dense: true, outline: true, color: "info" }, "newsletter"),
          _.Chip({ dense: true, outline: true }, "lead ads")
        ),
        footer: _.span({ class: "cms-muted" }, "owner: growth team"),
        actions: _.Btn({ size: "sm", color: "info" }, "Apri funnel"),
        state: "info"
      })
    ],
    [`_.Kpi({
  eyebrow: "Acquisition",
  title: "Nuove iscrizioni CRM",
  value: "18,240",
  delta: "+9%",
  trend: "up",
  note: "campagne Q2 / EU market",
  media: _.Progress({ value: 68, state: "info", showValue: true, note: "68% del target trimestrale" }),
  meta: _.Row({ gap: "8px", wrap: true },
    _.Chip({ dense: true, outline: true, color: "info" }, "newsletter"),
    _.Chip({ dense: true, outline: true }, "lead ads")
  ),
  footer: _.span({ class: "cms-muted" }, "owner: growth team"),
  actions: _.Btn({ size: "sm", color: "info" }, "Apri funnel"),
  state: "info"
});`]
  ),
  ops: createSection(
    [
      _.Kpi({
        eyebrow: "Operations",
        title: "Fulfillment readiness",
        value: "82%",
        delta: "+5%",
        trend: "up",
        note: "3 warehouse allineati",
        aside: _.Avatar({ label: "OPS", size: "sm" }),
        footer: _.span({ class: "cms-muted" }, "aggiornato 10:14"),
        actions: _.Row({ gap: "8px", wrap: true },
          _.Btn({ size: "sm", outline: true }, "Dettagli"),
          _.Btn({ size: "sm", color: "secondary" }, "Apri board")
        ),
        state: "secondary"
      },
        _.List(
          _.Item("Stock sync: verde"),
          _.Item("Carrier SLA: warning"),
          _.Item("Packing stations: online")
        )
      )
    ],
    [`_.Kpi({
  eyebrow: "Operations",
  title: "Fulfillment readiness",
  value: "82%",
  delta: "+5%",
  trend: "up",
  note: "3 warehouse allineati",
  aside: _.Avatar({ label: "OPS", size: "sm" }),
  footer: _.span({ class: "cms-muted" }, "aggiornato 10:14"),
  actions: [
    _.Btn({ size: "sm", outline: true }, "Dettagli"),
    _.Btn({ size: "sm", color: "secondary" }, "Apri board")
  ],
  state: "secondary"
},
  _.List(
    _.Item("Stock sync: verde"),
    _.Item("Carrier SLA: warning"),
    _.Item("Packing stations: online")
  )
);`]
  )
};

const kpi = _.div({ class: "cms-panel cms-page" },
  _.ComponentDocs({
    doc: kpiDoc,
    api: () => _.docTable("Kpi")
  }),
  _.h2("Esempi completi"),
  boxCode("Headline KPI", listSample.headline),
  boxCode("KPI con media", listSample.media),
  boxCode("Ops summary KPI", listSample.ops)
);

export { kpi };
