const renderProgress = (options = {}, label = "") => {
  if (!Object.keys(options).length && !label) return _.Progress();
  if (!Object.keys(options).length) return _.Progress(label);
  return label ? _.Progress(options, label) : _.Progress(options);
};

const renderProgressSample = (options = {}, label = "") => {
  if (!Object.keys(options).length && !label) return "_.Progress();";
  if (!Object.keys(options).length) return `_.Progress("${label}");`;
  return label ? `_.Progress(${serializeOptions(options)}, "${label}");` : `_.Progress(${serializeOptions(options)});`;
};

const createSection = (entries) => ({
  code: entries.map(({ label = "", options }) => renderProgress(options, label)),
  sample: entries.map(({ label = "", options }) => renderProgressSample(options, label))
});

const liveValue = _.rod(68);
const liveBuffer = _.rod(86);
const liveState = _.rod("primary");
const liveStriped = _.rod(true);
const liveIndeterminate = _.rod(false);
const liveInside = _.rod(false);

const stateEntries = [
  { label: "Onboarding clienti", options: { value: 22, state: "secondary", showValue: true } },
  { label: "Sync catalogo", options: { value: 48, state: "warning", showValue: true } },
  { label: "Ordini evasione", options: { value: 81, state: "success", showValue: true } },
  { label: "Controllo quality gate", options: { value: 63, state: "info", showValue: true } },
  { label: "Recovery pagamenti", options: { value: 37, state: "danger", showValue: true } },
  { label: "Brand custom", options: { value: 54, color: "#22c55e", showValue: true } }
];

const sizeEntries = [
  { label: "Queue compatta", options: { value: 34, height: "xs", showValue: true } },
  { label: "Deploy standard", options: { value: 52, height: "sm", showValue: true, state: "primary" } },
  { label: "Upload media", options: { value: 71, height: "md", radius: "xl", state: "success", showValue: true } },
  { label: "Replica database", options: { value: 89, height: "lg", radius: "full", state: "info", showValue: true } }
];

const listSample = {
  state: createSection(stateEntries),
  size: createSection(sizeEntries),
  content: {
    code: [
      _.Progress({
        value: 64,
        buffer: 82,
        state: "primary",
        showValue: true,
        label: "Pubblicazione catalogo primavera",
        note: "214 prodotti confermati, 36 immagini ancora in ottimizzazione",
        startLabel: "Draft",
        endLabel: "Live"
      }),
      _.Progress({
        value: 43,
        buffer: 70,
        color: "#f59e0b",
        showValue: "inside",
        insideLabel: "43 / 100 asset",
        label: "Pacchetto media marketplace",
        note: "La barra supporta testo interno, buffer e label di contesto."
      }),
      _.Progress({
        value: 18,
        showValue: true,
        label: "Migrazione ERP",
        note: "Slot personalizzato per il valore",
        slots: {
          value: ({ value, max }) => _.Chip({ color: "warning", size: "sm" }, `${value} / ${max}`)
        }
      })
    ],
    sample: [
      '_.Progress({ value: 64, buffer: 82, state: "primary", showValue: true, label: "Pubblicazione catalogo primavera", note: "214 prodotti confermati, 36 immagini ancora in ottimizzazione", startLabel: "Draft", endLabel: "Live" });',
      '_.Progress({ value: 43, buffer: 70, color: "#f59e0b", showValue: "inside", insideLabel: "43 / 100 asset", label: "Pacchetto media marketplace", note: "La barra supporta testo interno, buffer e label di contesto." });',
      '_.Progress({ value: 18, showValue: true, label: "Migrazione ERP", note: "Slot personalizzato per il valore", slots: { value: ({ value, max }) => _.Chip({ color: "warning", size: "sm" }, `${value} / ${max}`) } });'
    ]
  },
  loading: {
    code: [
      _.Progress({
        indeterminate: true,
        state: "info",
        striped: true,
        animated: true,
        label: "Verifica feed fornitori",
        note: "Job in corso senza percentuale disponibile"
      }),
      _.Progress({
        value: 58,
        striped: true,
        animated: true,
        state: "success",
        showValue: true,
        label: "Elaborazione ordini B2B",
        note: "Pattern striped utile quando il task avanza in batch"
      }),
      _.Progress({
        value: 74,
        striped: true,
        animated: true,
        reverse: true,
        color: "#38bdf8",
        showValue: true,
        label: "Rollback controllato",
        note: "Modalita reverse per casi particolari o timeline inverse"
      })
    ],
    sample: [
      '_.Progress({ indeterminate: true, state: "info", striped: true, animated: true, label: "Verifica feed fornitori", note: "Job in corso senza percentuale disponibile" });',
      '_.Progress({ value: 58, striped: true, animated: true, state: "success", showValue: true, label: "Elaborazione ordini B2B", note: "Pattern striped utile quando il task avanza in batch" });',
      '_.Progress({ value: 74, striped: true, animated: true, reverse: true, color: "#38bdf8", showValue: true, label: "Rollback controllato", note: "Modalita reverse per casi particolari o timeline inverse" });'
    ]
  },
  real: {
    code: [
      _.Card({
        title: "Import ordini ERP",
        subtitle: "Monitor live della pipeline",
        aside: _.Chip({ color: "warning", size: "sm" }, "12 batch")
      },
        _.Progress({
          value: 57,
          buffer: 79,
          state: "warning",
          showValue: true,
          label: "Validazione righe ordine",
          note: "2.394 record letti, 168 con controlli aggiuntivi",
          startLabel: "Lettura",
          endLabel: "Conferma"
        }),
        _.div({ class: "cms-d-flex", style: { gap: "8px", flexWrap: "wrap", alignItems: "center", marginTop: "12px" } },
          _.Chip({ color: "warning" }, "ETA 4 min"),
          _.Btn({ outline: true, size: "sm" }, "Apri log"),
          _.Btn({ size: "sm" }, "Metti in pausa")
        )
      ),
      _.Card({
        title: "Stato deploy",
        subtitle: "Uso reale dentro una dashboard operativa"
      },
        _.Progress({
          value: 91,
          state: "success",
          height: "lg",
          showValue: "inside",
          insideLabel: "Release quasi completata"
        }),
        _.div({ class: "cms-d-flex", style: { gap: "8px", flexWrap: "wrap", marginTop: "12px" } },
          _.Chip({ color: "success" }, "Smoke test OK"),
          _.Chip({ color: "info" }, "4 servizi aggiornati"),
          _.Chip({ color: "secondary" }, "staging-eu-west")
        )
      )
    ],
    sample: [
      '_.Card({ title: "Import ordini ERP", subtitle: "Monitor live della pipeline", aside: _.Chip({ color: "warning", size: "sm" }, "12 batch") },',
      '  _.Progress({ value: 57, buffer: 79, state: "warning", showValue: true, label: "Validazione righe ordine", note: "2.394 record letti, 168 con controlli aggiuntivi", startLabel: "Lettura", endLabel: "Conferma" }),',
      '  _.div({ class: "cms-d-flex", style: { gap: "8px", flexWrap: "wrap", alignItems: "center", marginTop: "12px" } },',
      '    _.Chip({ color: "warning" }, "ETA 4 min"),',
      '    _.Btn({ outline: true, size: "sm" }, "Apri log"),',
      '    _.Btn({ size: "sm" }, "Metti in pausa")',
      "  )",
      ");",
      '_.Progress({ value: 91, state: "success", height: "lg", showValue: "inside", insideLabel: "Release quasi completata" });'
    ]
  },
  live: {
    code: [
      _.div({ class: "cms-d-flex", style: { gap: "8px", flexWrap: "wrap", alignItems: "center", marginBottom: "12px" } },
        _.Btn({ onClick: () => { liveState.value = "primary"; } }, "Primary"),
        _.Btn({ onClick: () => { liveState.value = "success"; } }, "Success"),
        _.Btn({ onClick: () => { liveState.value = "warning"; } }, "Warning"),
        _.Btn({ onClick: () => { liveState.value = "danger"; } }, "Danger"),
        _.Btn({ onClick: () => { liveState.value = "info"; } }, "Info")
      ),
      _.div({ style: { marginBottom: "12px" } },
        _.Slider({
          min: 0,
          max: 100,
          model: liveValue,
          label: "Value",
          showValue: true,
          markers: [0, 25, 50, 75, 100]
        }),
        _.Slider({
          min: 0,
          max: 100,
          model: liveBuffer,
          label: "Buffer",
          showValue: true,
          markers: [0, 25, 50, 75, 100]
        })
      ),
      _.div({ class: "cms-d-flex", style: { gap: "12px", flexWrap: "wrap", alignItems: "center", marginBottom: "12px" } },
        _.Checkbox({ model: liveStriped }, "Striped"),
        _.Checkbox({ model: liveIndeterminate }, "Indeterminate"),
        _.Checkbox({ model: liveInside }, "Value inside")
      ),
      _.Card({
        title: "Anteprima live",
        subtitle: "Il componente reagisce direttamente a rod e signal"
      },
        _.Progress({
          value: () => liveValue.value,
          buffer: () => Math.max(liveValue.value, liveBuffer.value),
          state: () => liveState.value,
          striped: () => liveStriped.value,
          animated: true,
          indeterminate: () => liveIndeterminate.value,
          showValue: () => liveInside.value ? "inside" : true,
          insideLabel: () => `${liveValue.value}% completato`,
          label: "Deploy multi-tenant",
          note: "Modifica stato, valore, buffer e modalita di rendering senza ricreare il componente",
          startLabel: "Build",
          endLabel: "Delivery"
        })
      )
    ],
    sample: [
      'const liveValue = _.rod(68);',
      'const liveBuffer = _.rod(86);',
      'const liveState = _.rod("primary");',
      'const liveStriped = _.rod(true);',
      'const liveIndeterminate = _.rod(false);',
      '_.Progress({',
      '  value: () => liveValue.value,',
      '  buffer: () => Math.max(liveValue.value, liveBuffer.value),',
      '  state: () => liveState.value,',
      '  striped: () => liveStriped.value,',
      '  animated: true,',
      '  indeterminate: () => liveIndeterminate.value,',
      '  showValue: () => liveInside.value ? "inside" : true,',
      '  insideLabel: () => `${liveValue.value}% completato`,',
      '  label: "Deploy multi-tenant",',
      '  note: "Modifica stato, valore, buffer e modalita di rendering senza ricreare il componente"',
      "});"
    ]
  }
};

const progress = _.div({ class: "cms-panel cms-page" },
  _.h1("Progress"),
  _.p("Progress standardizzato per stati di avanzamento reali: supporta valore reattivo, buffer, label e note contestuali, percentuale fuori o dentro la barra, stati semantici e modalita indeterminate senza workaround manuali."),
  _.h2("Props principali"),
  _.List(
    _.Item("value, model, min, max e buffer per gestire progresso e pre-caricamento"),
    _.Item("label, note, startLabel, endLabel, valueLabel e insideLabel per comporre il contenuto"),
    _.Item("state oppure color, trackColor, bufferColor, height, radius e width per la resa visiva"),
    _.Item("showValue, striped, animated, indeterminate e reverse per i diversi casi d'uso"),
    _.Item("slots icon, label, note, value, inside, startLabel, endLabel e default per custom rendering")
  ),
  _.h2("Documentazione API"),
  _.docTable("Progress"),
  _.h2("Esempi completi"),
  boxCode("State + custom color", listSample.state),
  boxCode("Height + radius", listSample.size),
  boxCode("Label, note, buffer e slot", listSample.content),
  boxCode("Striped, animated e indeterminate", listSample.loading),
  boxCode("Casi reali", listSample.real),
  boxCode("Anteprima live", listSample.live)
);

export { progress };
