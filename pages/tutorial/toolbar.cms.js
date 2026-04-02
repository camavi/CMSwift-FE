const catalogSearch = _.rod("");
const catalogSort = _.rod("priority");
const catalogOnlyStock = _.rod(true);
const catalogFastLane = _.rod(false);

const liveSize = _.rod("md");
const liveAlign = _.rod("center");
const liveJustify = _.rod("flex-start");
const liveWrap = _.rod(true);
const liveDivider = _.rod(true);
const liveElevated = _.rod(false);
const liveSticky = _.rod(false);
const liveTone = _.rod("warning");

const listSample = {
  structured: {
    code: [
      _.Card({ header: "Release control room" },
        _.Toolbar({
          divider: true,
          start: _.Btn({ outline: true, icon: "arrow_back", size: "sm" }, "Roadmap"),
          title: "Checkout refresh 4.2",
          subtitle: "Gestisce titolo, meta, azioni e una seconda riga senza layout custom aggiuntivo.",
          meta: [
            _.Chip({ color: "info", size: "xs" }, "Canary 20%"),
            _.Chip({ color: "warning", size: "xs", outline: true }, "Monitor 30 min")
          ],
          end: _.Toolbar({ dense: true, gap: "8px" },
            _.Btn({ size: "sm", outline: true }, "Apri runbook"),
            _.Btn({ size: "sm", color: "primary", icon: "rocket_launch" }, "Deploy")
          ),
          after: _.Toolbar({ dense: true, gap: "8px", wrap: true },
            _.Chip({ size: "xs", outline: true }, "owner: release"),
            _.Chip({ size: "xs", outline: true }, "SLA 17 min"),
            _.Chip({ size: "xs", color: "success" }, "Smoke test ok")
          )
        })
      )
    ],
    sample: [
      "_.Toolbar({",
      "  divider: true,",
      '  start: _.Btn({ outline: true, icon: "arrow_back", size: "sm" }, "Roadmap"),',
      '  title: "Checkout refresh 4.2",',
      '  subtitle: "Gestisce titolo, meta, azioni e una seconda riga senza layout custom aggiuntivo.",',
      "  meta: [",
      '    _.Chip({ color: "info", size: "xs" }, "Canary 20%"),',
      '    _.Chip({ color: "warning", size: "xs", outline: true }, "Monitor 30 min")',
      "  ],",
      '  end: _.Toolbar({ dense: true, gap: "8px" },',
      '    _.Btn({ size: "sm", outline: true }, "Apri runbook"),',
      '    _.Btn({ size: "sm", color: "primary", icon: "rocket_launch" }, "Deploy")',
      "  ),",
      '  after: _.Toolbar({ dense: true, gap: "8px", wrap: true },',
      '    _.Chip({ size: "xs", outline: true }, "owner: release"),',
      '    _.Chip({ size: "xs", color: "success" }, "Smoke test ok")',
      "  )",
      "});"
    ]
  },
  filters: {
    code: [
      _.Card({ header: "Toolbar filtri catalogo" },
        _.Toolbar({
          gap: "12px",
          wrap: true,
          start: _.Input({
            label: "Search",
            placeholder: "SKU, brand o campaign",
            icon: "search",
            model: catalogSearch,
            style: { minWidth: "260px" }
          }),
          center: _.Toolbar({ dense: true, gap: "8px", wrap: true },
            _.Chip({ color: "info", outline: true }, "Marketplace"),
            _.Chip({ color: "secondary", outline: true }, "Spring 2026"),
            _.Chip({ color: "warning", outline: true }, "High margin")
          ),
          end: _.Toolbar({ dense: true, gap: "8px", wrap: true },
            _.Select({
              label: "Ordina per",
              model: catalogSort,
              clearable: true,
              style: { minWidth: "180px" },
              options: [
                { value: "priority", label: "Priorita" },
                { value: "margin", label: "Margine" },
                { value: "eta", label: "ETA spedizione" }
              ]
            }),
            _.Btn({ outline: true, size: "sm", icon: "tune" }, "Preset"),
            _.Btn({ color: "primary", size: "sm" }, "Aggiorna")
          ),
          after: _.Toolbar({ dense: true, gap: "14px", wrap: true },
            _.Checkbox({ color: "success", model: catalogOnlyStock }, "Solo stock disponibile"),
            _.Checkbox({ color: "warning", model: catalogFastLane }, "Fast lane")
          )
        })
      )
    ],
    sample: [
      "_.Toolbar({",
      '  gap: "12px",',
      "  wrap: true,",
      "  start: _.Input({",
      '    label: "Search",',
      '    placeholder: "SKU, brand o campaign",',
      '    icon: "search",',
      "    model: catalogSearch",
      "  }),",
      '  center: _.Toolbar({ dense: true, gap: "8px", wrap: true },',
      '    _.Chip({ color: "info", outline: true }, "Marketplace"),',
      '    _.Chip({ color: "secondary", outline: true }, "Spring 2026")',
      "  ),",
      '  end: _.Toolbar({ dense: true, gap: "8px", wrap: true },',
      '    _.Select({ label: "Ordina per", model: catalogSort, options: [...] }),',
      '    _.Btn({ color: "primary", size: "sm" }, "Aggiorna")',
      "  ),",
      '  after: _.Toolbar({ dense: true, gap: "14px", wrap: true },',
      '    _.Checkbox({ color: "success", model: catalogOnlyStock }, "Solo stock disponibile"),',
      '    _.Checkbox({ color: "warning", model: catalogFastLane }, "Fast lane")',
      "  )",
      "});"
    ]
  },
  slots: {
    code: [
      _.Card({ header: "Toolbar con slots" },
        _.Toolbar({
          elevated: true,
          slots: {
            start: () => _.Toolbar({ dense: true, gap: "10px" },
              _.Avatar({ label: "OPS", size: "sm" }),
              _.Badge({ color: "danger", label: "2 alert" })
            ),
            meta: () => [
              _.Chip({ color: "danger", size: "xs" }, "Incident room"),
              _.Chip({ color: "info", size: "xs", outline: true }, "Warehouse Milano 2")
            ],
            title: () => "Ordini prioritari in coda",
            subtitle: () => "Le slot permettono di generare start, meta e azioni partendo da una sorgente dati esterna.",
            actions: () => _.Toolbar({ dense: true, gap: "8px", wrap: true },
              _.Btn({ size: "sm", outline: true }, "Apri dashboard"),
              _.Btn({ size: "sm", color: "danger", icon: "notification_important" }, "Escalate")
            ),
            after: () => _.Toolbar({ dense: true, gap: "8px", wrap: true },
              _.Chip({ size: "xs", outline: true }, "owner: logistics"),
              _.Chip({ size: "xs", outline: true }, "ETA corriere 17 min"),
              _.Chip({ size: "xs", color: "success" }, "Backup carrier ready")
            )
          }
        })
      )
    ],
    sample: [
      "_.Toolbar({",
      "  elevated: true,",
      "  slots: {",
      '    start: () => _.Toolbar({ dense: true, gap: "10px" },',
      '      _.Avatar({ label: "OPS", size: "sm" }),',
      '      _.Badge({ color: "danger", label: "2 alert" })',
      "    ),",
      "    meta: () => [_.Chip({ color: \"danger\", size: \"xs\" }, \"Incident room\")],",
      '    title: () => "Ordini prioritari in coda",',
      '    subtitle: () => "Le slot permettono di generare la toolbar da dati esterni.",',
      '    actions: () => _.Toolbar({ dense: true, gap: "8px" },',
      '      _.Btn({ size: "sm", color: "danger" }, "Escalate")',
      "    )",
      "  }",
      "});"
    ]
  },
  live: {
    code: [
      _.Card({ header: "Playground" },
        _.Grid({ cols: 1, gap: "16px" },
          _.GridCol({ span: 12, md: 4 },
            _.Card({ header: "Controlli" },
              _.Toolbar({ dense: true, wrap: true, gap: "12px", style: { marginBottom: "12px" } },
                _.div(
                  _.b("Size"),
                  _.Radio({ value: "sm", model: liveSize, color: "secondary" }, "sm"),
                  _.Radio({ value: "md", model: liveSize, color: "secondary" }, "md"),
                  _.Radio({ value: "lg", model: liveSize, color: "secondary" }, "lg")
                ),
                _.div(
                  _.b("Align"),
                  _.Radio({ value: "flex-start", model: liveAlign, color: "info" }, "start"),
                  _.Radio({ value: "center", model: liveAlign, color: "info" }, "center"),
                  _.Radio({ value: "flex-end", model: liveAlign, color: "info" }, "end")
                ),
                _.div(
                  _.b("Tone"),
                  _.Radio({ value: "info", model: liveTone, color: "info" }, "info"),
                  _.Radio({ value: "warning", model: liveTone, color: "warning" }, "warning"),
                  _.Radio({ value: "success", model: liveTone, color: "success" }, "success")
                ),
                _.Checkbox({ color: "secondary", model: liveWrap }, "Wrap"),
                _.Checkbox({ color: "secondary", model: liveDivider }, "Divider"),
                _.Checkbox({ color: "secondary", model: liveElevated }, "Elevated"),
                _.Checkbox({ color: "secondary", model: liveSticky }, "Sticky")
              ),
              _.div(
                _.b("Justify"),
                _.Radio({ value: "flex-start", model: liveJustify, color: "primary" }, "start"),
                _.Radio({ value: "center", model: liveJustify, color: "primary" }, "center"),
                _.Radio({ value: "space-between", model: liveJustify, color: "primary" }, "space-between")
              )
            )
          ),
          _.GridCol({ span: 12, md: 8 },
            _.Card({ header: "Anteprima live" },
              _.Toolbar({
                size: () => liveSize.value,
                align: () => liveAlign.value,
                justify: () => liveJustify.value,
                wrap: () => liveWrap.value,
                divider: () => liveDivider.value,
                elevated: () => liveElevated.value,
                sticky: () => liveSticky.value,
                start: _.Btn({ outline: true, size: "sm", icon: "menu" }, "Queue"),
                meta: [
                  _.Chip({ color: () => liveTone.value, size: "xs" }, () => `state: ${liveTone.value}`),
                  _.Chip({ size: "xs", outline: true }, () => `size: ${liveSize.value}`)
                ],
                title: _.span(() => `Fulfillment board ${liveJustify.value === "space-between" ? "wide" : "focused"}`),
                subtitle: _.span(() => liveWrap.value ? "Le regioni possono andare a capo senza rompere le azioni." : "Wrap disattivato per una barra piu compatta."),
                end: _.Toolbar({ dense: true, gap: "8px", wrap: true },
                  _.Btn({ size: "sm", outline: true }, "Export"),
                  _.Btn({ size: "sm", color: () => liveTone.value }, "Apply")
                ),
                after: _.Toolbar({ dense: true, gap: "8px", wrap: true },
                  _.Chip({ size: "xs", outline: true }, () => liveDivider.value ? "divider on" : "divider off"),
                  _.Chip({ size: "xs", outline: true }, () => liveElevated.value ? "elevated on" : "elevated off"),
                  _.Chip({ size: "xs", outline: true }, () => liveSticky.value ? "sticky on" : "sticky off")
                )
              })
            )
          )
        )
      )
    ],
    sample: [
      "const liveSize = _.rod(\"md\");",
      "const liveWrap = _.rod(true);",
      "const liveTone = _.rod(\"warning\");",
      "_.Toolbar({",
      "  size: () => liveSize.value,",
      "  wrap: () => liveWrap.value,",
      "  divider: () => liveDivider.value,",
      "  elevated: () => liveElevated.value,",
      '  start: _.Btn({ outline: true, size: "sm", icon: "menu" }, "Queue"),',
      "  meta: [",
      '    _.Chip({ color: () => liveTone.value, size: "xs" }, () => `state: ${liveTone.value}`)',
      "  ],",
      '  title: _.span(() => "Fulfillment board"),',
      '  end: _.Toolbar({ dense: true, gap: "8px" },',
      '    _.Btn({ size: "sm", color: () => liveTone.value }, "Apply")',
      "  )",
      "});"
    ]
  }
};

const toolbar = _.div({ class: "cms-panel cms-page" },
  _.h1("Toolbar"),
  _.p("Toolbar standardizzata per action bar, header operativi e filtri: mantiene l'uso semplice con children ma aggiunge regioni strutturate come start, center, end, meta e after."),
  _.h2("Props principali"),
  _.List(
    _.Item("start, center/body/content, end/actions, before e after per comporre la struttura"),
    _.Item("title, subtitle e meta per costruire una toolbar informativa senza wrapper manuali"),
    _.Item("gap, align, justify, wrap, size, dense, divider, elevated e sticky per il layout"),
    _.Item("slots omonime per generare toolbar dinamiche da dati o stati applicativi")
  ),
  _.h2("Documentazione API"),
  _.docTable("Toolbar"),
  _.h2("Esempi completi"),
  boxCode("Toolbar strutturata", listSample.structured, 24),
  boxCode("Toolbar filtri reali", listSample.filters, 24),
  boxCode("Toolbar con slots", listSample.slots, 24),
  boxCode("Playground live", listSample.live, 24)
);

export { toolbar };
