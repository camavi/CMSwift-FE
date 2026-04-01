const toolbarRow = (...children) => _.div({
  style: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
    alignItems: "center"
  }
}, ...children);

const liveMode = _.rod("ops");
const liveDense = _.rod(false);
const liveStack = _.rod(false);
const livePriority = _.rod(true);
const liveSort = _.rod("sla");

const liveHeaderMap = {
  ops: {
    eyebrow: "Operations / Fulfillment",
    title: "Control room logistica",
    subtitle: "Pipeline ordini, saturazione baie e SLA di preparazione in una sola testata.",
    badge: "OPS",
    tone: "warning",
    metric: "12 ordini bloccati"
  },
  finance: {
    eyebrow: "Finance / Billing",
    title: "Revenue audit center",
    subtitle: "Fatture pendenti, scarti ERP e riconciliazione giornaliera in evidenza.",
    badge: "FIN",
    tone: "danger",
    metric: "3 riconciliazioni critiche"
  },
  support: {
    eyebrow: "Support / Customer care",
    title: "Support cockpit",
    subtitle: "Ticket ad alta priorita, owner di turno e backlog live per il team.",
    badge: "SUP",
    tone: "info",
    metric: "SLA medio 17 min"
  }
};

const currentHeader = () => liveHeaderMap[liveMode.value] || liveHeaderMap.ops;
const currentSortLabel = () => ({
  sla: "SLA",
  volume: "Volume",
  owner: "Owner"
}[liveSort.value] || "SLA");

const listSample = {
  basic: {
    code: [
      _.Header({
        sticky: false,
        title: "CMSwift",
        subtitle: "Header essenziale per pagine interne e shell applicative"
      })
    ],
    sample: [
      '_.Header({',
      '  sticky: false,',
      '  title: "CMSwift",',
      '  subtitle: "Header essenziale per pagine interne e shell applicative"',
      '});'
    ]
  },
  structured: {
    code: [
      _.Header({
        sticky: false,
        icon: _.Avatar({ label: "OPS", size: "lg" }),
        eyebrow: "Warehouse / EU-West",
        title: "Fulfillment control room",
        subtitle: "Monitora picking, packing e saturazione baie in tempo reale",
        content: toolbarRow(
          _.Chip({ color: "warning", size: "sm" }, "12 ordini bloccati"),
          _.Chip({ color: "info", outline: true, size: "sm" }, "Cut-off 18:00"),
          _.Chip({ color: "secondary", outline: true, size: "sm" }, "Dock 04")
        ),
        meta: toolbarRow(
          _.Chip({ color: "success", size: "sm" }, "SLA 97.8%"),
          _.Chip({ color: "primary", outline: true, size: "sm" }, "Batch 148")
        ),
        actions: toolbarRow(
          _.Btn({ size: "sm", outline: true, icon: "download" }, "Export"),
          _.Btn({ size: "sm", icon: "add" }, "Nuova regola")
        )
      })
    ],
    sample: [
      '_.Header({',
      '  sticky: false,',
      '  icon: _.Avatar({ label: "OPS", size: "lg" }),',
      '  eyebrow: "Warehouse / EU-West",',
      '  title: "Fulfillment control room",',
      '  subtitle: "Monitora picking, packing e saturazione baie in tempo reale",',
      '  content: _.div({ style: { display: "flex", gap: "8px", flexWrap: "wrap" } },',
      '    _.Chip({ color: "warning", size: "sm" }, "12 ordini bloccati"),',
      '    _.Chip({ color: "info", outline: true, size: "sm" }, "Cut-off 18:00")',
      '  ),',
      '  meta: _.Chip({ color: "success", size: "sm" }, "SLA 97.8%"),',
      '  actions: _.div({ style: { display: "flex", gap: "8px" } },',
      '    _.Btn({ size: "sm", outline: true }, "Export"),',
      '    _.Btn({ size: "sm" }, "Nuova regola")',
      '  )',
      '});'
    ]
  },
  reactive: {
    code: [
      _.Card({
        title: "Controlli live",
        subtitle: "Il componente reagisce a stato, densita e contenuti"
      },
        toolbarRow(
          _.Radio({ value: "ops", model: liveMode, color: "secondary" }, "Ops"),
          _.Radio({ value: "finance", model: liveMode, color: "secondary" }, "Finance"),
          _.Radio({ value: "support", model: liveMode, color: "secondary" }, "Support")
        ),
        toolbarRow(
          _.Radio({ value: "sla", model: liveSort, color: "info" }, "Sort SLA"),
          _.Radio({ value: "volume", model: liveSort, color: "info" }, "Sort Volume"),
          _.Radio({ value: "owner", model: liveSort, color: "info" }, "Sort Owner")
        ),
        toolbarRow(
          _.Checkbox({ model: liveDense, color: "warning" }, "Dense"),
          _.Checkbox({ model: liveStack, color: "primary" }, "Stack"),
          _.Checkbox({ model: livePriority, color: "danger" }, "Solo priorita")
        )
      ),
      _.Header({
        sticky: false,
        dense: liveDense,
        stack: liveStack,
        eyebrow: () => currentHeader().eyebrow,
        title: () => currentHeader().title,
        subtitle: () => currentHeader().subtitle,
        icon: () => _.Avatar({ label: currentHeader().badge, size: "md" }),
        content: () => toolbarRow(
          _.Chip({ color: currentHeader().tone, size: "sm" }, currentHeader().metric),
          _.Chip({ outline: true, size: "sm" }, `Sort ${currentSortLabel()}`)
        ),
        meta: () => _.Chip(
          { color: livePriority.value ? "warning" : "success", size: "sm" },
          livePriority.value ? "Focus on priority" : "Vista completa"
        ),
        actions: toolbarRow(
          _.Btn({ size: "sm", outline: true }, "Apri board"),
          _.Btn({ size: "sm", icon: "bolt" }, "Esegui playbook")
        )
      })
    ],
    sample: [
      'const liveMode = _.rod("ops");',
      'const liveDense = _.rod(false);',
      'const liveStack = _.rod(false);',
      '',
      '_.Header({',
      '  sticky: false,',
      '  dense: liveDense,',
      '  stack: liveStack,',
      '  eyebrow: () => currentHeader().eyebrow,',
      '  title: () => currentHeader().title,',
      '  subtitle: () => currentHeader().subtitle,',
      '  icon: () => _.Avatar({ label: currentHeader().badge, size: "md" }),',
      '  content: () => _.Chip({ color: currentHeader().tone, size: "sm" }, currentHeader().metric),',
      '  actions: _.Btn({ size: "sm" }, "Apri board")',
      '});'
    ]
  },
  slots: {
    code: [
      _.Header({
        sticky: false,
        stack: true,
        left: false,
        slots: {
          left: ({ toggleDrawer }) => _.Btn({ size: "sm", outline: true, onClick: toggleDrawer }, "Toggle nav"),
          center: () => _.div({
            style: {
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              width: "100%"
            }
          },
            toolbarRow(
              _.Avatar({ label: "CM", size: "md" }),
              _.div(
                _.div({ class: "cms-title" }, "Campaign studio"),
                _.div({ class: "cms-muted", style: { fontSize: "12px" } }, "Header costruito interamente via slot center")
              )
            ),
            toolbarRow(
              _.Chip({ color: "secondary", size: "sm" }, "Q2 rollout"),
              _.Chip({ color: "info", outline: true, size: "sm" }, "5 landing online"),
              _.Chip({ color: "success", outline: true, size: "sm" }, "CTR +12.4%")
            )
          ),
          right: () => toolbarRow(
            _.Btn({ size: "sm", outline: true, icon: "edit" }, "Modifica"),
            _.Btn({ size: "sm", icon: "publish" }, "Pubblica")
          )
        }
      })
    ],
    sample: [
      '_.Header({',
      '  sticky: false,',
      '  stack: true,',
      '  left: false,',
      '  slots: {',
      '    left: ({ toggleDrawer }) => _.Btn({ size: "sm", outline: true, onClick: toggleDrawer }, "Toggle nav"),',
      '    center: () => _.div("Contenuto completamente custom"),',
      '    right: () => _.Btn({ size: "sm" }, "Pubblica")',
      '  }',
      '});'
    ]
  }
};

const header = _.div({ class: "cms-panel cms-page" },
  _.h1("Header"),
  _.p("Header strutturato per shell applicative e pagine operative: supporta aree start/body/end, toggle drawer integrato, metadata, contenuti extra e override completo via slots."),
  _.h2("Props principali"),
  _.List(
    _.Item("title, subtitle, eyebrow, icon, content e meta per costruire una testata completa senza markup custom"),
    _.Item("left, right, actions e drawerStateKey per integrarsi con Layout, Drawer e AppShell"),
    _.Item("slots start/left, center/body, end/right, title, subtitle, meta, content e actions per override mirati"),
    _.Item("dense, stack, gap, minHeight, sticky, divider ed elevated per controllare layout e resa visiva")
  ),
  _.h2("Documentazione API"),
  _.docTable("Header"),
  _.h2("Esempi completi"),
  boxCode("Basic", listSample.basic),
  boxCode("Structured Header", listSample.structured),
  boxCode("Reactive Preview", listSample.reactive),
  boxCode("Slots / Custom Layout", listSample.slots)
);

export { header };
