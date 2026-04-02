const liveWrap = _.rod(true);
const liveInline = _.rod(false);
const liveDirection = _.rod("row");
const liveAlign = _.rod("center");
const liveJustify = _.rod("space-between");
const liveGap = _.rod("lg");

const metricCard = (title, value, note, tone, icon) => _.Card({
  title,
  subtitle: note,
  icon,
  aside: _.Chip({ color: tone, size: "sm", outline: true }, tone)
},
  _.div({ style: { fontSize: "28px", fontWeight: "700" } }, value)
);

const previewSurface = (node) => _.div({
  class: "cms-singularity cms-border cms-p-lg",
  style: {
    minHeight: "140px",
    borderStyle: "dashed",
    overflow: "hidden"
  }
}, node);

const listSample = {
  basic: {
    code: [
      previewSurface(
        _.Row({ gap: "md", wrap: true, align: "center" },
          _.Chip({ color: "primary", icon: "bolt" }, "Nuovi lead"),
          _.Chip({ color: "success", icon: "check_circle" }, "24 task completati"),
          _.Chip({ color: "warning", icon: "schedule" }, "3 approvazioni"),
          _.Btn({ outline: true, icon: "download" }, "Esporta"),
          _.Btn({ color: "primary", icon: "rocket_launch" }, "Pubblica")
        )
      )
    ],
    sample: [
      '_.Row({ gap: "md", wrap: true, align: "center" },',
      '  _.Chip({ color: "primary", icon: "bolt" }, "Nuovi lead"),',
      '  _.Chip({ color: "success", icon: "check_circle" }, "24 task completati"),',
      '  _.Btn({ outline: true, icon: "download" }, "Esporta"),',
      '  _.Btn({ color: "primary", icon: "rocket_launch" }, "Pubblica")',
      ');'
    ]
  },
  regions: {
    code: [
      previewSurface(
        _.Row({
          gap: "md",
          align: "center",
          start: _.Avatar({ text: "CM", color: "primary", size: "lg" }),
          end: _.Row({ gap: "sm", align: "center" },
            _.Chip({ color: "warning", outline: true }, "SLA 17 min"),
            _.Btn({ outline: true, icon: "forum" }, "Commenti"),
            _.Btn({ color: "primary", icon: "done_all" }, "Approva")
          )
        },
          _.div(
            _.div({ style: { fontWeight: "700" } }, "Review finale catalogo primavera"),
            _.div({ class: "cms-muted" }, "Il team contenuti sta verificando pricing, bundle e traduzioni prima della pubblicazione.")
          )
        )
      )
    ],
    sample: [
      '_.Row({',
      '  gap: "md",',
      '  align: "center",',
      '  start: _.Avatar({ text: "CM", color: "primary", size: "lg" }),',
      '  end: _.Row({ gap: "sm" },',
      '    _.Chip({ color: "warning", outline: true }, "SLA 17 min"),',
      '    _.Btn({ outline: true }, "Commenti"),',
      '    _.Btn({ color: "primary" }, "Approva")',
      '  )',
      '},',
      '  _.div(',
      '    _.div({ style: { fontWeight: "700" } }, "Review finale catalogo primavera"),',
      '    _.div({ class: "cms-muted" }, "Verifica contenuti e pricing prima del go-live.")',
      '  )',
      ');'
    ]
  },
  dashboard: {
    code: [
      _.Row({ gap: "lg", wrap: true, align: "stretch" },
        _.Col({ col: 8, md: 12, sm: 24 }, metricCard("MRR espanso", "€ 48.2k", "Pipeline B2B aggiornata 3 min fa", "success", "payments")),
        _.Col({ col: 8, md: 12, sm: 24 }, metricCard("Ticket aperti", "19", "2 ticket ad alta priorita in attesa", "warning", "support_agent")),
        _.Col({ col: 8, md: 24, sm: 24 }, metricCard("Campagne live", "7", "Meta Ads, CRM e referral sincronizzati", "info", "campaign"))
      )
    ],
    sample: [
      '_.Row({ gap: "lg", wrap: true, align: "stretch" },',
      '  _.Col({ col: 8, md: 12, sm: 24 }, metricCard("MRR espanso", "€ 48.2k", "Pipeline B2B aggiornata 3 min fa", "success", "payments")),',
      '  _.Col({ col: 8, md: 12, sm: 24 }, metricCard("Ticket aperti", "19", "2 ticket ad alta priorita in attesa", "warning", "support_agent")),',
      '  _.Col({ col: 8, md: 24, sm: 24 }, metricCard("Campagne live", "7", "Meta Ads, CRM e referral sincronizzati", "info", "campaign"))',
      ');'
    ]
  },
  live: {
    code: [
      _.Card({
        title: "Playground live",
        subtitle: "Row reagisce a gap, wrap, justify, align, direction e inline senza markup extra.",
        icon: "tune"
      },
        _.Row({ gap: "lg", wrap: true, align: "flex-start" },
          _.Col({ col: 9, md: 24, sm: 24 },
            _.div({ class: "cms-m-b-sm", style: { fontWeight: "700" } }, "Controlli"),
            _.Row({ gap: "sm", wrap: true, class: "cms-m-b-md" },
              _.Checkbox({ model: liveWrap }, "Wrap"),
              _.Checkbox({ model: liveInline }, "Inline")
            ),
            _.div({ class: "cms-m-b-xs", style: { fontWeight: "700" } }, "Align"),
            _.Row({ gap: "sm", wrap: true, class: "cms-m-b-md" },
              _.Radio({ value: "flex-start", model: liveAlign }, "Start"),
              _.Radio({ value: "center", model: liveAlign }, "Center"),
              _.Radio({ value: "flex-end", model: liveAlign }, "End")
            ),
            _.div({ class: "cms-m-b-xs", style: { fontWeight: "700" } }, "Justify"),
            _.Row({ gap: "sm", wrap: true, class: "cms-m-b-md" },
              _.Radio({ value: "flex-start", model: liveJustify }, "Start"),
              _.Radio({ value: "center", model: liveJustify }, "Center"),
              _.Radio({ value: "space-between", model: liveJustify }, "Space-between")
            ),
            _.div({ class: "cms-m-b-xs", style: { fontWeight: "700" } }, "Direction"),
            _.Row({ gap: "sm", wrap: true, class: "cms-m-b-md" },
              _.Radio({ value: "row", model: liveDirection }, "Row"),
              _.Radio({ value: "row-reverse", model: liveDirection }, "Row reverse"),
              _.Radio({ value: "column", model: liveDirection }, "Column")
            ),
            _.div({ class: "cms-m-b-xs", style: { fontWeight: "700" } }, "Gap"),
            _.Row({ gap: "sm", wrap: true },
              _.Radio({ value: "sm", model: liveGap }, "sm"),
              _.Radio({ value: "md", model: liveGap }, "md"),
              _.Radio({ value: "lg", model: liveGap }, "lg"),
              _.Radio({ value: "xl", model: liveGap }, "xl")
            )
          ),
          _.Col({ col: 15, md: 24, sm: 24 },
            _.div({ class: "cms-m-b-sm", style: { fontWeight: "700" } }, "Anteprima"),
            previewSurface(
              _.div(
                _.Row({ gap: "sm", wrap: true, class: "cms-m-b-sm", align: "center" },
                  _.Chip({ color: "primary", size: "sm", outline: true }, () => liveWrap.value ? "wrap on" : "wrap off"),
                  _.Chip({ color: "secondary", size: "sm", outline: true }, () => liveInline.value ? "inline on" : "inline off"),
                  _.Chip({ color: "warning", size: "sm", outline: true }, "viewport 340px")
                ),
                _.div({ class: "cms-muted cms-m-b-sm" }, "Con `wrap` disattivato la riga resta su una linea con overflow orizzontale. Con `inline` attivo la riga smette di occupare tutta la larghezza disponibile."),
                _.div({
                  class: "cms-singularity cms-border cms-p-sm",
                  style: {
                    width: "340px",
                    maxWidth: "100%",
                    overflowX: "auto",
                    overflowY: "hidden",
                    background: "color-mix(in srgb, var(--cms-panel) 84%, transparent)"
                  }
                },
                  _.div({
                    class: "cms-singularity cms-border cms-p-xs",
                    style: {
                      display: "inline-block",
                      background: "color-mix(in srgb, var(--cms-info) 8%, var(--cms-panel))"
                    }
                  },
                    _.Row({
                      gap: liveGap,
                      wrap: liveWrap,
                      inline: liveInline,
                      direction: liveDirection,
                      align: liveAlign,
                      justify: liveJustify,
                      full: () => !liveInline.value,
                      minWidth: () => liveWrap.value ? null : "max-content"
                    },
                      _.Chip({ color: "info", icon: "inventory_2" }, "42 SKU pronti"),
                      _.Btn({ outline: true, icon: "download" }, "Export CSV"),
                      _.Btn({ color: "primary", icon: "bolt" }, "Sync ora"),
                      _.Chip({ color: "secondary", outline: true }, "workspace-eu"),
                      _.Avatar({ text: "QA", color: "warning" })
                    )
                  )
                )
              )
            )
          )
        )
      )
    ],
    sample: [
      'const liveWrap = _.rod(true);',
      'const liveAlign = _.rod("center");',
      'const liveJustify = _.rod("space-between");',
      'const liveGap = _.rod("lg");',
      '',
      '_.Row({',
      '  gap: liveGap,',
      '  wrap: liveWrap,',
      '  align: liveAlign,',
      '  justify: liveJustify,',
      '  direction: liveDirection,',
      '  inline: liveInline,',
      '  full: () => !liveInline.value,',
      '  minWidth: () => liveWrap.value ? null : "max-content"',
      '}, ...children);'
    ]
  }
};

const row = _.div({ class: "cms-panel cms-page" },
  _.h1("Row"),
  _.p("Layout flex orizzontale standardizzato per toolbar, filtri, header operativi e gruppi di card. Oltre ai children supporta `gap`, `align`, `justify`, `wrap`, `direction`, `inline` e regioni `start` / `default` / `end`."),
  _.h2("Props principali"),
  _.List(
    _.Item("gap, rowGap, columnGap: spaziatura rapida con numeri, CSS value o token UI (`sm`, `md`, `lg`...)"),
    _.Item("align, justify, wrap, direction, inline: controllo completo del comportamento flex"),
    _.Item("start/body/end e relativi slot: costruisci action bar e header senza wrapper manuali"),
    _.Item("full, width, minWidth, maxWidth: controllo della larghezza del contenitore")
  ),
  _.h2("Documentazione API"),
  _.docTable("Row"),
  _.h2("Esempi reali"),
  boxCode("Toolbar operativa con gap e wrap", listSample.basic),
  boxCode("Header strutturato con start / end", listSample.regions),
  boxCode("Dashboard strip con Row + Col", listSample.dashboard),
  boxCode("Playground live", listSample.live)
);

export { row };
