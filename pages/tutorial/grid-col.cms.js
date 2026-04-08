const liveSpan = _.rod("12");
const liveMd = _.rod("6");
const liveGap = _.rod("md");
const livePanel = _.rod(true);

const releaseMetrics = [
  { title: "Revenue live", value: "EUR 48.2k", note: "Aggiornato 4 min fa", tone: "success", icon: "payments", md: 6 },
  { title: "Ticket aperti", value: "19", note: "2 escalation ancora attive", tone: "warning", icon: "support_agent", md: 3 },
  { title: "SKU da validare", value: "46", note: "Feed marketplace + ADV", tone: "info", icon: "inventory_2", md: 3 }
];

const workloadCards = [
  { title: "Quality gate checkout", note: "Serve conferma coupon e gift card", tone: "danger", tag: "QA", span: 12, md: 6, lg: 3, rowSpan: 2, progress: 21 },
  { title: "Sync prezzi marketplace", note: "Amazon, Zalando, Miravia", tone: "success", tag: "Sync", span: 12, md: 6, lg: 3, progress: 88 },
  { title: "Media pack primavera", note: "Foto, crop ADV e short video", tone: "secondary", tag: "Studio", span: 12, md: 12, lg: 4, progress: 57 },
  { title: "Rollout PDP redesign", note: "A/B test attivo sul 30% del traffico", tone: "primary", tag: "UX", span: 12, md: 6, lg: 5, rowSpan: 2, progress: 63 },
  { title: "CRM flash sales", note: "6 campagne ancora da schedulare", tone: "warning", tag: "CRM", span: 12, md: 6, lg: 3, progress: 71 }
];

const previewSurface = (node) => _.div({
  class: "cms-border cms-p-lg",
  style: {
    borderStyle: "dashed",
    borderRadius: "var(--cms-r-lg)",
    overflow: "hidden"
  }
}, node);

const metricCol = (item) => _.GridCol({
  span: 12,
  md: item.md,
  panel: true,
  gap: "sm",
  color: item.tone,
  outline: true,
  lightShadow: true,
  start: _.Row({ justify: "space-between", align: "center", gap: "sm" },
    _.Chip({ color: item.tone, size: "xs", outline: true }, item.title),
    _.Icon({ name: item.icon, color: item.tone })
  ),
  body: [
    _.div({ style: { fontSize: "30px", fontWeight: "700", lineHeight: "1.1" } }, item.value),
    _.div({ class: "cms-muted" }, item.note)
  ],
  end: _.Progress({ value: item.tone === "success" ? 92 : item.tone === "warning" ? 61 : 74, state: item.tone, showValue: true, height: "sm" })
});

const workloadCol = (item) => _.GridCol({
  span: item.span,
  md: item.md,
  lg: item.lg,
  rowSpan: item.rowSpan,
  panel: true,
  gap: "sm",
  fullHeight: true,
  start: _.Row({ justify: "space-between", align: "center", gap: "sm" },
    _.div({ style: { fontWeight: "700" } }, item.title),
    _.Chip({ color: item.tone, size: "xs" }, item.tag)
  ),
  body: _.div({ class: "cms-muted" }, item.note),
  end: [
    _.Progress({ value: item.progress, state: item.tone, showValue: true, striped: true, animated: true, height: "sm" }),
    _.Row({ gap: "sm", wrap: true, style: { marginTop: "12px" } },
      _.Btn({ outline: true, size: "sm" }, "Apri"),
      _.Btn({ color: item.tone, size: "sm" }, "Assegna")
    )
  ]
});

const listSample = {
  responsive: {
    code: [
      previewSurface(
        _.Grid({ cols: 3, gap: "var(--cms-s-lg)" },
          ...releaseMetrics.map((item) => metricCol(item))
        )
      )
    ],
    sample: [
      '_.Grid({ cols: 12, gap: "var(--cms-s-lg)" },',
      '  _.GridCol({ span: 12, md: 6, panel: true, gap: "sm", start: ..., body: ..., end: ... }),',
      '  _.GridCol({ span: 12, md: 3, panel: true, gap: "sm", start: ..., body: ..., end: ... })',
      ');'
    ]
  },
  regions: {
    code: [
      previewSurface(
        _.Grid({ cols: 2, gap: "var(--cms-s-lg)" },
          _.GridCol({
            md: 7,
            panel: true,
            gap: "md",
            padding: "xl",
            color: "primary",
            outline: true,
            glossy: true,
            start: _.Row({ justify: "space-between", align: "center", gap: "sm" },
              _.div(
                _.div({ style: { fontWeight: "700", fontSize: "20px" } }, "Launch checklist"),
                _.div({ class: "cms-muted" }, "`GridCol` gestisce header/body/footer senza wrapper esterni.")
              ),
              _.Chip({ color: "primary", size: "sm" }, "live")
            ),
            body: _.List(
              _.Item("Conferma feed stock per i marketplace principali"),
              _.Item("Smoke test sui coupon e sugli upsell del checkout"),
              _.Item("Verifica finale del media pack nelle varianti locali")
            ),
            end: _.Row({ gap: "sm", wrap: true, justify: "space-between", align: "center" },
              _.Chip({ outline: true, size: "sm" }, "owner: ops"),
              _.Btn({ color: "primary", icon: "rocket_launch" }, "Apri workspace")
            )
          }),
          _.GridCol({

            md: 5,
            panel: true,
            gap: "md",
            padding: "lg",
            contentJustify: "space-between",
            body: _.Col({ gap: "sm" },
              _.div({ style: { fontWeight: "700" } }, "Approvals"),
              _.Checkbox({ model: _.rod(true), color: "success" }, "Pricing validato"),
              _.Checkbox({ model: _.rod(false), color: "warning" }, "Hero visual approvata"),
              _.Checkbox({ model: _.rod(false), color: "danger" }, "Rollback firmato")
            ),
            end: _.Btn({ outline: true, icon: "fact_check" }, "Vai alla board")
          })
        )
      )
    ],
    sample: [
      '_.GridCol({',
      '  panel: true,',
      '  gap: "md",',
      '  start: _.Row(...),',
      '  body: _.List(...),',
      '  end: _.Row(...)',
      '});'
    ]
  },
  areas: {
    code: [
      previewSurface(
        _.Grid({
          cols: 2,
          gap: "var(--cms-s-md)",
          dense: true
        },
          ...workloadCards.map((item) => workloadCol(item)),
          _.GridCol({
            auto: true,
            panel: true,
            padding: "sm",
            align: "start"
          }, _.Chip({ color: "info", outline: true, icon: "bolt" }, "Auto item"))
        )
      ),
      previewSurface(
        _.Grid({
          cols: 4,
          rows: "auto auto",
          gap: "var(--cms-s-md)",
          areas: [
            ["hero", "hero", "hero", "sidebar"],
            ["pipeline", "pipeline", "notes", "sidebar"]
          ]
        },
          _.GridCol({
            area: "hero",
            panel: true,
            padding: "xl",
            gap: "md",
            color: "secondary",
            outline: true,
            start: _.Row({ justify: "space-between", align: "center", gap: "sm" },
              _.div(
                _.div({ style: { fontWeight: "700", fontSize: "22px" } }, "Editorial hero"),
                _.div({ class: "cms-muted" }, "Distribuzione guidata con `area`.")
              ),
              _.Chip({ color: "secondary", size: "sm" }, "hero")
            ),
            body: _.p("Quando la griglia dichiara `areas`, ogni `GridCol` si aggancia alla propria regione senza wrapper aggiuntivi e resta comunque un contenitore strutturato."),
            end: _.Row({ gap: "sm", wrap: true },
              _.Chip({ outline: true, size: "xs" }, "Copy review"),
              _.Chip({ outline: true, size: "xs" }, "SEO ready"),
              _.Chip({ outline: true, size: "xs" }, "Visual signed-off")
            )
          }),
          _.GridCol({
            area: "pipeline",
            panel: true,
            gap: "sm",
            start: _.div({ style: { fontWeight: "700" } }, "Pipeline"),
            body: _.List(
              _.Item("Shooting still life"),
              _.Item("Localizzazione copy"),
              _.Item("QA finale prima del publish")
            )
          }),
          _.GridCol({
            area: "notes",
            panel: true,
            gap: "sm",
            body: _.Card({
              title: "Note operative",
              subtitle: "Puoi mischiare GridCol con altri componenti UI"
            }, "Per i contenuti ricchi, `GridCol` resta il contenitore di layout mentre Card, List, Btn e Chip gestiscono i dettagli.")
          }),
          _.GridCol({
            area: "sidebar",
            panel: true,
            gap: "md",
            contentJustify: "space-between",
            start: _.div({ style: { fontWeight: "700" } }, "Sidebar release"),
            body: _.Col({ gap: "sm" },
              _.Radio({ value: "priority", model: _.rod("priority"), color: "info" }, "Ordina per priorita"),
              _.Radio({ value: "eta", model: _.rod("priority"), color: "info" }, "Ordina per ETA"),
              _.Checkbox({ model: _.rod(true), color: "success" }, "Mostra task live")
            ),
            end: _.Btn({ color: "secondary", icon: "open_in_new" }, "Apri planner")
          })
        )
      )
    ],
    sample: [
      '_.Grid({ areas: [["hero", "hero", "sidebar"], ["content", "notes", "sidebar"]] },',
      '  _.GridCol({ area: "hero", panel: true, start: ..., body: ..., end: ... }),',
      '  _.GridCol({ area: "sidebar", panel: true, contentJustify: "space-between" })',
      ');'
    ]
  },
  live: {
    code: [
      _.Card({
        title: "Playground live",
        subtitle: "Span, gap e panel reagiscono direttamente sul componente.",
        icon: "tune"
      },
        _.Grid({ cols: 2, gap: "var(--cms-s-lg)" },
          _.GridCol({ span: 2, md: 2, gap: "md", panel: true },
            _.div({ style: { fontWeight: "700" } }, "Controlli"),
            _.div(
              _.div({ class: "cms-m-b-xs", style: { fontWeight: "700" } }, "Span"),
              _.Row({ gap: "sm", wrap: true, class: "cms-m-b-md" },
                _.Radio({ value: "12", model: liveSpan }, "12"),
                _.Radio({ value: "8", model: liveSpan }, "8"),
                _.Radio({ value: "6", model: liveSpan }, "6")
              )
            ),
            _.div(
              _.div({ class: "cms-m-b-xs", style: { fontWeight: "700" } }, "Span md"),
              _.Row({ gap: "sm", wrap: true, class: "cms-m-b-md" },
                _.Radio({ value: "6", model: liveMd }, "6"),
                _.Radio({ value: "4", model: liveMd }, "4"),
                _.Radio({ value: "3", model: liveMd }, "3")
              )
            ),
            _.div(
              _.div({ class: "cms-m-b-xs", style: { fontWeight: "700" } }, "Gap"),
              _.Row({ gap: "sm", wrap: true, class: "cms-m-b-md" },
                _.Radio({ value: "sm", model: liveGap }, "sm"),
                _.Radio({ value: "md", model: liveGap }, "md"),
                _.Radio({ value: "lg", model: liveGap }, "lg")
              )
            ),
            _.Checkbox({ model: livePanel, color: "info" }, "Attiva panel")
          ),
          _.GridCol({ span: 2, md: 2, gap: "md" },
            previewSurface(
              _.Grid({ cols: 12, gap: "var(--cms-s-md)" },
                _.GridCol({
                  span: liveSpan,
                  md: liveMd,
                  panel: livePanel,
                  gap: liveGap,
                  color: "info",
                  outline: true,
                  start: _.Row({ justify: "space-between", align: "center", gap: "sm" },
                    _.Chip({ color: "info", size: "xs" }, () => `span ${liveSpan.value} / md ${liveMd.value}`),
                    _.Chip({ outline: true, size: "xs" }, () => `gap ${liveGap.value}`)
                  ),
                  body: _.p("Il componente resta leggibile anche quando span, gap e superficie cambiano in runtime."),
                  end: _.Btn({ color: "info", size: "sm", icon: "visibility" }, "Preview")
                }),
                _.GridCol({
                  span: liveSpan,
                  md: 6,
                  panel: true,
                  gap: "sm",
                  body: _.Card({
                    title: "Colonna complementare",
                    subtitle: "Utile per testare gli effetti del nuovo span"
                  }, "Puoi combinare GridCol standardizzato con Card, Progress, List e qualsiasi altro componente.")
                })
              )
            )
          )
        )
      )
    ],
    sample: [
      'const liveSpan = _.rod("12");',
      'const liveGap = _.rod("md");',
      '',
      '_.GridCol({',
      '  span: liveSpan,',
      '  md: liveMd,',
      '  panel: livePanel,',
      '  gap: liveGap,',
      '  start: ...,',
      '  body: ...,',
      '  end: ...',
      '});'
    ]
  }
};

const gridCol = _.div({ class: "cms-panel cms-page" },
  _.h1("GridCol"),
  _.p("`_.GridCol` non e piu solo un wrapper per `span`: resta l'item di `_.Grid`, ma puo diventare anche un contenitore strutturato con `start / body / end`, varianti visuali leggere e controlli di layout interno."),
  _.h2("Props principali"),
  _.List(
    _.Item("`span`, `sm`, `md`, `lg`, `rowSpan`, `area`, `auto`: gestisci il posizionamento reale del grid item"),
    _.Item("`gap`, `padding`, `direction`, `contentAlign`, `contentJustify`, `fullHeight`: trasformi il componente in un contenitore verticale leggibile"),
    _.Item("`start`, `body`, `end` e slot equivalenti: componi pannelli veri senza wrapper extra"),
    _.Item("`panel`, `color`, `outline`, `shadow`, `radius`, `clickable`, `to`: aggiungi superficie e comportamento quando serve")
  ),
  _.h2("Documentazione API"),
  _.docTable("GridCol"),
  _.h2("Esempi reali"),
  boxCode("Metriche responsive con `span / md`", listSample.responsive, 24),
  boxCode("Pannelli strutturati con `start / body / end`", listSample.regions, 24),
  boxCode("Board densa, `rowSpan`, `auto` e layout con `area`", listSample.areas, 24),
  boxCode("Playground live", listSample.live, 24)
);

export { gridCol };
