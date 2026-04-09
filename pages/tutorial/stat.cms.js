import statDoc from "./docs/stat.doc.js";

const createSection = (code, sample) => ({ code, sample });

const salesStats = [
  { label: "Revenue netta", value: "EUR 128k", delta: "+18%", trend: "up", note: "vs settimana scorsa", state: "success" },
  { label: "Resi aperti", value: "42", delta: "-7%", trend: "down", note: "ultimo refresh 08:40", state: "danger" },
  { label: "Ticket SLA", value: "91%", delta: "flat", trend: "flat", note: "steady su 24h", state: "info" }
];

const listSample = {
  grid: createSection(
    [
      _.Grid({ cols: 3, gap: "var(--cms-s-md)" },
        ...salesStats.map((item) => _.GridCol(
          _.Stat({
            label: item.label,
            value: item.value,
            delta: item.delta,
            trend: item.trend,
            note: item.note,
            state: item.state
          })
        ))
      )
    ],
    [`_.Grid({ cols: 3, gap: "var(--cms-s-md)" },
  _.GridCol(_.Stat({
    label: "Revenue netta",
    value: "EUR 128k",
    delta: "+18%",
    trend: "up",
    note: "vs settimana scorsa",
    state: "success"
  })),
  ...
);`]
  ),
  meta: createSection(
    [
      _.Stat({
        eyebrow: "Storefront EU",
        label: "Ordini a rischio",
        value: "184",
        delta: "+12",
        trend: "negative",
        note: "12 ticket fuori SLA",
        meta: _.Row({ gap: "8px", wrap: true },
          _.Chip({ dense: true, outline: true, color: "warning" }, "ops"),
          _.Chip({ dense: true, outline: true }, "updated 09:22")
        ),
        aside: _.Avatar({ label: "OP", size: "sm" })
      })
    ],
    [`_.Stat({
  eyebrow: "Storefront EU",
  label: "Ordini a rischio",
  value: "184",
  delta: "+12",
  trend: "negative",
  note: "12 ticket fuori SLA",
  meta: _.Row({ gap: "8px", wrap: true },
    _.Chip({ dense: true, outline: true, color: "warning" }, "ops"),
    _.Chip({ dense: true, outline: true }, "updated 09:22")
  ),
  aside: _.Avatar({ label: "OP", size: "sm" })
});`]
  ),
  actions: createSection(
    [
      _.Stat({
        label: "Quality gate",
        value: "93%",
        delta: "+4%",
        trend: "positive",
        note: "suite ecommerce / mobile",
        footer: _.span({ class: "cms-muted" }, "ultimo run 11:06"),
        actions: _.Btn({ size: "sm", color: "primary" }, "Apri report"),
        state: "primary"
      },
        _.Progress({ value: 93, state: "primary", showValue: true, height: "sm" })
      )
    ],
    [`_.Stat({
  label: "Quality gate",
  value: "93%",
  delta: "+4%",
  trend: "positive",
  note: "suite ecommerce / mobile",
  footer: _.span({ class: "cms-muted" }, "ultimo run 11:06"),
  actions: _.Btn({ size: "sm", color: "primary" }, "Apri report"),
  state: "primary"
},
  _.Progress({ value: 93, state: "primary", showValue: true, height: "sm" })
);`]
  )
};

const stat = _.div({ class: "cms-panel cms-page" },
  _.ComponentDocs({
    doc: statDoc,
    api: () => _.docTable("Stat")
  }),
  _.h2("Esempi completi"),
  boxCode("Metric grid", listSample.grid),
  boxCode("Meta e context", listSample.meta),
  boxCode("Stat con footer e body", listSample.actions)
);

export { stat };
