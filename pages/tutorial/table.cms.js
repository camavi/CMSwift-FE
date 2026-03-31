const euro = new Intl.NumberFormat("it-IT", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0
});
const shortDate = new Intl.DateTimeFormat("it-IT", {
  day: "2-digit",
  month: "short"
});

const leadRows = [
  { id: "LD-1042", customer: "Aurora Hotels", sector: "Hospitality", city: "Milano", owner: "Luca Ferri", status: "In trattativa", plan: "Suite", segment: "enterprise", mrr: 4200, lastContact: "2026-03-28" },
  { id: "LD-1038", customer: "Delta Parts", sector: "Manufacturing", city: "Bologna", owner: "Giulia Rizzi", status: "Demo fissata", plan: "Growth", segment: "scale", mrr: 1850, lastContact: "2026-03-25" },
  { id: "LD-1031", customer: "Northwind Care", sector: "Healthcare", city: "Torino", owner: "Martina Sala", status: "Negoziazione", plan: "Suite", segment: "enterprise", mrr: 5100, lastContact: "2026-03-27" },
  { id: "LD-1024", customer: "Pixel Foods", sector: "Retail", city: "Parma", owner: "Davide Serra", status: "Follow-up", plan: "Start", segment: "startup", mrr: 690, lastContact: "2026-03-19" },
  { id: "LD-1019", customer: "Futura Mobility", sector: "Mobility", city: "Roma", owner: "Elena Fontana", status: "Offerta inviata", plan: "Growth", segment: "scale", mrr: 2400, lastContact: "2026-03-24" },
  { id: "LD-1014", customer: "Blue Ocean Travel", sector: "Travel", city: "Venezia", owner: "Chiara Greco", status: "Chiusura attesa", plan: "Suite", segment: "enterprise", mrr: 3900, lastContact: "2026-03-29" },
  { id: "LD-1007", customer: "Spark Energy", sector: "Energy", city: "Genova", owner: "Paolo Villa", status: "Demo fissata", plan: "Growth", segment: "scale", mrr: 1600, lastContact: "2026-03-20" },
  { id: "LD-1002", customer: "Studio Atlas", sector: "Agency", city: "Firenze", owner: "Sara Conti", status: "Qualifica", plan: "Start", segment: "startup", mrr: 450, lastContact: "2026-03-18" }
];

const inventoryRows = [
  { sku: "WH-184", product: "Router Industrial 5G", warehouse: "Milano Hub", stock: 62, reorderPoint: 25, trend: "+12%", risk: "Stabile", supplier: "Alpine Networks" },
  { sku: "WH-215", product: "Barcode Scanner Pro", warehouse: "Bologna Hub", stock: 18, reorderPoint: 20, trend: "-8%", risk: "Da riordinare", supplier: "Scanloop" },
  { sku: "WH-237", product: "Label Printer X2", warehouse: "Padova Hub", stock: 31, reorderPoint: 16, trend: "+4%", risk: "Stabile", supplier: "Nord Print" },
  { sku: "WH-266", product: "Thermal Sensor Kit", warehouse: "Torino Hub", stock: 11, reorderPoint: 15, trend: "-16%", risk: "Critico", supplier: "Core Motion" },
  { sku: "WH-301", product: "IoT Gateway Edge", warehouse: "Roma Hub", stock: 44, reorderPoint: 18, trend: "+9%", risk: "Stabile", supplier: "Wave Systems" }
];

const opsRows = [
  { id: "OPS-17", feature: "Checkout 3DS", squad: "Payments", severity: "critical", incidents: 4, sla: "84%", updatedAt: "2026-03-30T08:42:00" },
  { id: "OPS-15", feature: "Catalog search", squad: "Growth", severity: "warning", incidents: 2, sla: "96%", updatedAt: "2026-03-30T08:12:00" },
  { id: "OPS-12", feature: "Mobile onboarding", squad: "Identity", severity: "critical", incidents: 5, sla: "79%", updatedAt: "2026-03-30T07:54:00" },
  { id: "OPS-11", feature: "Invoice export", squad: "Finance", severity: "healthy", incidents: 0, sla: "100%", updatedAt: "2026-03-30T07:10:00" },
  { id: "OPS-09", feature: "Refund queue", squad: "Support", severity: "warning", incidents: 1, sla: "93%", updatedAt: "2026-03-29T18:44:00" }
];

const selectedLead = _.rod("Nessuna riga selezionata");
const leadSegment = _.rod("all");
const simulateLoading = _.rod(false);
const onlyCritical = _.rod(false);

const statusTone = {
  "Qualifica": "secondary",
  "Demo fissata": "info",
  "In trattativa": "warning",
  "Negoziazione": "warning",
  "Offerta inviata": "primary",
  "Chiusura attesa": "success",
  "Follow-up": "dark"
};

const planTone = {
  Start: "secondary",
  Growth: "info",
  Suite: "primary"
};

const riskTone = {
  Stabile: "success",
  "Da riordinare": "warning",
  Critico: "danger"
};

const severityTone = {
  healthy: "success",
  warning: "warning",
  critical: "danger"
};

const renderMoney = (value) => _.b(euro.format(value));
const renderDate = (value) => shortDate.format(new Date(value));
const renderStatusChip = (value) => _.Chip({ color: statusTone[value] || "secondary", size: "sm" }, value);
const renderPlanChip = (value) => _.Chip({ color: planTone[value] || "secondary", size: "sm", outline: true }, value);
const renderRiskChip = (value) => _.Chip({ color: riskTone[value] || "secondary", size: "sm" }, value);
const renderSeverityChip = (value) => _.Chip({ color: severityTone[value] || "secondary", size: "sm" }, value.toUpperCase());

const listSample = {
  crm: {
    code: [
      _.div({ class: "cms-m-b-md" },
        _.b("Lead selezionato: "),
        _.span(selectedLead)
      ),
      _.Table({
        title: "Pipeline commerciale",
        subtitle: "Vista operativa per account executive e customer success",
        rows: leadRows,
        rowKey: "id",
        searchable: "Cerca account, owner, piano o stato",
        pageSize: 5,
        initialSort: { key: "mrr", dir: "desc" },
        filter: (row) => leadSegment.value === "all" || row.segment === leadSegment.value,
        toolbarEnd: _.div({ class: "cms-row", style: { gap: "12px" } },
          _.Radio({ model: leadSegment, value: "all", name: "lead-segment" }, "Tutti"),
          _.Radio({ model: leadSegment, value: "enterprise", name: "lead-segment", color: "primary" }, "Enterprise"),
          _.Radio({ model: leadSegment, value: "scale", name: "lead-segment", color: "info" }, "Scale"),
          _.Radio({ model: leadSegment, value: "startup", name: "lead-segment", color: "secondary" }, "Startup")
        ),
        onRowClick: (row) => {
          selectedLead.value = `${row.customer} · owner ${row.owner}`;
        },
        columns: [
          {
            key: "customer",
            label: "Account",
            minWidth: 240,
            render: (row) => _.div(
              _.b(row.customer),
              _.div({ class: "cms-muted", style: { fontSize: "12px" } }, `${row.sector} · ${row.city}`)
            )
          },
          { key: "owner", label: "Owner", nowrap: true },
          { key: "plan", label: "Piano", align: "center", render: (row) => renderPlanChip(row.plan) },
          { key: "status", label: "Stato", minWidth: 160, render: (row) => renderStatusChip(row.status) },
          {
            key: "lastContact",
            label: "Ultimo contatto",
            nowrap: true,
            get: (row) => new Date(row.lastContact).getTime(),
            render: (row) => renderDate(row.lastContact)
          },
          {
            key: "mrr",
            label: "MRR",
            align: "right",
            get: (row) => row.mrr,
            render: (row) => renderMoney(row.mrr)
          },
          {
            label: "Azioni",
            get: (row) => row.mrr,
            style: { minWidth: "160px" },
            render: (row) => {
              return _.div(

                _.Btn({
                  outline: true,
                  onClick: () => {
                    selectedLead.value = `Follow-up pianificato per ${row.customer}`;
                  }
                }, "Follow-up"),
                _.Btn({
                  color: "primary",
                  onClick: () => {
                    selectedLead.value = `Scheda aperta: ${row.id}`;
                  }
                }, "Apri")

              );
            }
          }
        ],
      })
    ],
    sample: [
      'const selectedLead = _.rod("Nessuna riga selezionata");',
      'const leadSegment = _.rod("all");',
      '_.Table({',
      '  title: "Pipeline commerciale",',
      '  rows: leadRows,',
      '  searchable: true,',
      '  pageSize: 5,',
      '  initialSort: { key: "mrr", dir: "desc" },',
      '  filter: (row) => leadSegment.value === "all" || row.segment === leadSegment.value,',
      '  toolbarEnd: _.div(_.Radio(...), _.Radio(...), _.Radio(...)),',
      '  actions: (row) => [_.Btn({ outline: true }, "Follow-up"), _.Btn({ color: "primary" }, "Apri")]',
      '});'
    ]
  },
  compact: {
    code: [
      _.Table({
        title: "SLA logistici",
        subtitle: "Tabella compatta per operations e acquisti",
        rows: inventoryRows,
        rowKey: "sku",
        dense: true,
        striped: true,
        hover: false,
        pagination: false,
        minTableWidth: 860,
        footer: _.div({ class: "cms-row", style: { gap: "10px" } },
          _.Chip({ color: "success", outline: true }, `SKU monitorati: ${inventoryRows.length}`),
          _.Chip({ color: "warning", outline: true }, "Refresh ogni 15 minuti")
        ),
        columns: [
          { key: "sku", label: "SKU", nowrap: true, minWidth: 92 },
          {
            key: "product",
            label: "Prodotto",
            minWidth: 240,
            render: (row) => _.div(
              _.b(row.product),
              _.div({ class: "cms-muted", style: { fontSize: "12px" } }, row.supplier)
            )
          },
          { key: "warehouse", label: "Magazzino", nowrap: true },
          { key: "stock", label: "Stock", align: "right", nowrap: true },
          { key: "reorderPoint", label: "Reorder point", align: "right", nowrap: true },
          {
            key: "trend",
            label: "Trend 7g",
            align: "center",
            render: (row) => _.Chip({ color: row.trend.startsWith("-") ? "danger" : "success", size: "sm", outline: true }, row.trend)
          },
          {
            key: "risk",
            label: "Rischio",
            align: "right",
            style: { whiteSpace: "nowrap" },
            render: (row) => renderRiskChip(row.risk)
          }
        ]
      })
    ],
    sample: [
      '_.Table({',
      '  title: "SLA logistici",',
      '  rows: inventoryRows,',
      '  dense: true,',
      '  striped: true,',
      '  pagination: false,',
      '  footer: _.div(_.Chip(...), _.Chip(...)),',
      '  columns: [{ key: "sku" }, { key: "product", render: (row) => ... }, { key: "risk", render: (row) => _.Chip(...) }]',
      '});'
    ]
  },
  states: {
    code: [
      _.div({ class: "cms-m-b-md cms-row", style: { gap: "16px", alignItems: "center", flexWrap: "wrap" } },
        _.Checkbox({ model: simulateLoading }, "Simula loading"),
        _.Checkbox({ model: onlyCritical, color: "danger" }, "Solo criticità"),
        _.Chip({ color: "info", outline: true }, () => `Righe correnti: ${onlyCritical.value ? opsRows.filter((row) => row.severity === "critical").length : opsRows.length}`)
      ),
      _.Table({
        title: "Operations board",
        subtitle: "Stati live, filtri reattivi ed empty state",
        rows: () => onlyCritical.value ? opsRows.filter((row) => row.severity === "critical") : opsRows,
        loading: () => simulateLoading.value,
        searchable: "Cerca feature o team",
        pageSize: 4,
        emptyText: _.div(
          _.b("Nessuna anomalia trovata"),
          _.div({ class: "cms-muted", style: { marginTop: "6px" } }, "Prova a cambiare filtro oppure a resettare la ricerca.")
        ),
        columns: [
          { key: "id", label: "Ticket", nowrap: true },
          { key: "feature", label: "Feature", minWidth: 220 },
          { key: "squad", label: "Squad", nowrap: true },
          { key: "incidents", label: "Incidenti", align: "right", nowrap: true },
          {
            key: "severity",
            label: "Severità",
            align: "center",
            render: (row) => renderSeverityChip(row.severity)
          },
          { key: "sla", label: "SLA", align: "right", nowrap: true },
          {
            key: "updatedAt",
            label: "Ultimo update",
            nowrap: true,
            get: (row) => new Date(row.updatedAt).getTime(),
            render: (row) => new Date(row.updatedAt).toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" })
          }
        ]
      })
    ],
    sample: [
      'const simulateLoading = _.rod(false);',
      'const onlyCritical = _.rod(false);',
      '_.Checkbox({ model: simulateLoading }, "Simula loading");',
      '_.Table({',
      '  rows: () => onlyCritical.value ? opsRows.filter((row) => row.severity === "critical") : opsRows,',
      '  loading: () => simulateLoading.value,',
      '  searchable: true,',
      '  emptyText: _.div(_.b("Nessuna anomalia trovata"), _.div("Prova a cambiare filtro"))',
      '});'
    ]
  }
};

const table = _.div({ class: "cms-panel cms-page" },
  _.h1("Table"),
  _.p("Componente tabellare standard per dati operativi: toolbar, ricerca, ordinamento, paginazione, stati, footer custom e rendering libero di celle e azioni."),
  _.h2("Props principali"),
  _.List(
    _.Item("columns: definisce label, sorting, width, formatter e render custom per ogni colonna"),
    _.Item("rows, loading, filter, searchModel: permettono una tabella reattiva e controllabile"),
    _.Item("toolbarStart, toolbarEnd, footer, slots: estendono il layout senza forzare markup esterno"),
    _.Item("dense, striped, hover, minTableWidth: rendono il componente adattabile a dashboard e backoffice")
  ),
  _.h2("Documentazione API"),
  _.docTable("Table"),
  _.h2("Esempio completo"),
  boxCode("CRM table con search, filtri e azioni", listSample.crm),
  boxCode("Tabella compatta per analytics operative", listSample.compact),
  boxCode("Loading, filtri live ed empty state", listSample.states)
);

export { table };
