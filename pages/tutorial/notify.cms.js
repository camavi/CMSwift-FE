const manualToastId = _.rod("");

const actionRow = (...children) => _.div({
  style: {
    display: "flex",
    gap: "var(--cms-s-sm)",
    flexWrap: "wrap",
    alignItems: "center"
  }
}, ...children);

const sampleCode = (lines) => Array.isArray(lines) ? lines : [lines];

const listSample = {
  shortcuts: {
    code: [
      actionRow(
        _.Btn({
          color: "success",
          icon: "check_circle",
          onClick: () => _.Notify.success("Catalogo sincronizzato con 24 SKU aggiornati.", "Sync completata")
        }, "Success"),
        _.Btn({
          color: "warning",
          icon: "warning",
          onClick: () => _.Notify.warning("3 payout richiedono revisione manuale.", "Attenzione")
        }, "Warning"),
        _.Btn({
          color: "danger",
          icon: "error",
          onClick: () => _.Notify.error("Il provider shipping non risponde da 90 secondi.", "Errore provider")
        }, "Error"),
        _.Btn({
          color: "info",
          icon: "info",
          onClick: () => _.Notify.info("Nuova release pubblicata su staging EU.", "Info")
        }, "Info")
      )
    ],
    sample: sampleCode([
      '_.Notify.success("Catalogo sincronizzato con 24 SKU aggiornati.", "Sync completata");',
      '_.Notify.warning("3 payout richiedono revisione manuale.", "Attenzione");',
      '_.Notify.error("Il provider shipping non risponde da 90 secondi.", "Errore provider");',
      '_.Notify.info("Nuova release pubblicata su staging EU.", "Info");'
    ])
  },
  structured: {
    code: [
      _.Card(
        {
          title: "Notify con payload strutturato",
          subtitle: "Title, message, description, meta, actions e posizione custom",
          aside: _.Chip({ color: "info", outline: true, size: "sm" }, "versatile")
        },
        _.cardBody(
          _.p("Questo esempio mostra il payload completo usabile in produzione per incident, handoff o task operativi."),
          actionRow(
            _.Btn({
              color: "primary",
              onClick: () => _.Notify({
                type: "primary",
                position: "top-right",
                title: "Rollout checkout in canary",
                message: "Il 20% del traffico e gia sul nuovo checkout React.",
                description: "Mantieni monitor aperto per 30 minuti e verifica error rate, conversion e latency.",
                meta: actionRow(
                  _.Chip({ color: "info", outline: true, size: "xs" }, "SLA 17 min"),
                  _.Chip({ color: "secondary", outline: true, size: "xs" }, "owner: release")
                ),
                actions: ({ close }) => [
                  _.Btn({ outline: true, size: "sm", onClick: close }, "Chiudi"),
                  _.Btn({
                    color: "primary",
                    size: "sm",
                    onClick: () => _.Notify.success("Dashboard rollout aperta.", "Navigazione")
                  }, "Apri dashboard")
                ],
                closable: true,
                timeout: 0
              })
            }, "Apri notify completa")
          )
        )
      )
    ],
    sample: sampleCode(`_.Notify({
  type: "primary",
  position: "top-right",
  title: "Rollout checkout in canary",
  message: "Il 20% del traffico e gia sul nuovo checkout React.",
  description: "Mantieni monitor aperto per 30 minuti e verifica error rate, conversion e latency.",
  meta: _.div(
    _.Chip({ color: "info", outline: true, size: "xs" }, "SLA 17 min"),
    _.Chip({ color: "secondary", outline: true, size: "xs" }, "owner: release")
  ),
  actions: ({ close }) => [
    _.Btn({ outline: true, size: "sm", onClick: close }, "Chiudi"),
    _.Btn({ color: "primary", size: "sm" }, "Apri dashboard")
  ],
  closable: true,
  timeout: 0
});`)
  },
  slots: {
    code: [
      _.Card(
        {
          title: "Slots API",
          subtitle: "Custom icon, title, message, meta e actions senza perdere lo standard notify"
        },
        _.cardBody(
          actionRow(
            _.Btn({
              outline: true,
              onClick: () => _.Notify({
                type: "success",
                variant: "outline",
                timeout: 0,
                closable: true,
                slots: {
                  icon: () => _.Avatar({ label: "QA", size: "sm" }),
                  title: () => "QA gate completato",
                  message: () => "Smoke test, test payment e retry webhook sono tutti verdi.",
                  meta: () => actionRow(
                    _.Chip({ color: "success", size: "xs" }, "pass"),
                    _.Chip({ color: "secondary", outline: true, size: "xs" }, "staging-eu")
                  ),
                  actions: ({ close }) => [
                    _.Btn({ size: "sm", outline: true, onClick: close }, "Archivia"),
                    _.Btn({
                      size: "sm",
                      color: "success",
                      onClick: () => _.Notify.info("Checklist QA aperta in un nuovo pannello.", "Docs")
                    }, "Apri checklist")
                  ]
                }
              })
            }, "Apri notify via slots")
          )
        )
      )
    ],
    sample: sampleCode(`_.Notify({
  type: "success",
  variant: "outline",
  timeout: 0,
  closable: true,
  slots: {
    icon: () => _.Avatar({ label: "QA", size: "sm" }),
    title: () => "QA gate completato",
    message: () => "Smoke test, test payment e retry webhook sono tutti verdi.",
    meta: () => [
      _.Chip({ color: "success", size: "xs" }, "pass"),
      _.Chip({ color: "secondary", outline: true, size: "xs" }, "staging-eu")
    ],
    actions: ({ close }) => [
      _.Btn({ size: "sm", outline: true, onClick: close }, "Archivia"),
      _.Btn({ size: "sm", color: "success" }, "Apri checklist")
    ]
  }
});`)
  },
  lifecycle: {
    code: [
      _.Card(
        {
          title: "Lifecycle",
          subtitle: "show, update, remove e clear per gestire task lunghi o toasts persistenti",
          aside: _.Chip({ color: "warning", outline: true, size: "sm" }, () => manualToastId.value ? `id: ${manualToastId.value}` : "nessun toast")
        },
        _.cardBody(
          _.p("Crea un toast persistente, aggiornalo dopo alcuni step e rimuovilo in modo esplicito."),
          actionRow(
            _.Btn({
              color: "secondary",
              onClick: () => {
                const id = _.Notify({
                  type: "secondary",
                  timeout: 0,
                  closable: true,
                  title: "Export ERP in coda",
                  message: "Preparazione payload CSV e allegati...",
                  meta: _.Chip({ color: "secondary", outline: true, size: "xs" }, "queue")
                });
                manualToastId.value = id || "";
              }
            }, "Crea toast persistente"),
            _.Btn({
              outline: true,
              onClick: () => {
                if (!manualToastId.value) return;
                _.Notify.update(manualToastId.value, {
                  type: "warning",
                  title: "Export ERP in elaborazione",
                  message: "Compressione dei file e upload su storage europeo.",
                  meta: _.Chip({ color: "warning", outline: true, size: "xs" }, "processing")
                });
              }
            }, "Aggiorna"),
            _.Btn({
              color: "success",
              onClick: () => {
                if (!manualToastId.value) return;
                _.Notify.update(manualToastId.value, {
                  type: "success",
                  timeout: 2800,
                  title: "Export completato",
                  message: "Il file e disponibile per il download.",
                  meta: _.Chip({ color: "success", outline: true, size: "xs" }, "ready")
                });
                manualToastId.value = "";
              }
            }, "Completa"),
            _.Btn({
              color: "danger",
              outline: true,
              onClick: () => {
                if (!manualToastId.value) return;
                _.Notify.remove(manualToastId.value);
                manualToastId.value = "";
              }
            }, "Rimuovi"),
            _.Btn({
              outline: true,
              onClick: () => {
                _.Notify.clear();
                manualToastId.value = "";
              }
            }, "Clear all")
          )
        )
      )
    ],
    sample: sampleCode([
      'const id = _.Notify({ type: "secondary", timeout: 0, title: "Export ERP in coda", message: "Preparazione payload CSV..." });',
      '_.Notify.update(id, { type: "warning", title: "Export ERP in elaborazione", message: "Compressione file e upload..." });',
      '_.Notify.update(id, { type: "success", timeout: 2800, title: "Export completato", message: "Il file e disponibile." });',
      "_.Notify.remove(id);",
      "_.Notify.clear();"
    ])
  },
  promise: {
    code: [
      _.Card(
        {
          title: "Promise helper",
          subtitle: "Gestisce loading, success ed error nello stesso flusso"
        },
        _.cardBody(
          _.p("Molto utile per submit, sync e operazioni asincrone dove vuoi un feedback completo ma uniforme."),
          actionRow(
            _.Btn({
              color: "primary",
              onClick: () => _.Notify.promise(
                () => new Promise((resolve) => setTimeout(() => resolve({ batch: 42 }), 1200)),
                {
                  loading: {
                    title: "Sincronizzazione in corso",
                    message: "Aggiorno ordini, stock e spedizioni sui canali esterni..."
                  },
                  success: (result) => ({
                    title: "Sync completata",
                    message: `Batch #${result.batch} completato senza errori.`,
                    meta: _.Chip({ color: "success", outline: true, size: "xs" }, "all green")
                  })
                }
              )
            }, "Promise success"),
            _.Btn({
              color: "danger",
              onClick: () => _.Notify.promise(
                () => new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout del provider ERP")), 1200)),
                {
                  loading: {
                    title: "Invio dati ERP",
                    message: "Attendo conferma dal sistema remoto..."
                  },
                  error: (error) => ({
                    title: "Sync fallita",
                    message: error.message,
                    description: "Riprova il job o apri l'incident room se il problema persiste."
                  })
                }
              ).catch(() => {})
            }, "Promise error")
          )
        )
      )
    ],
    sample: sampleCode(`_.Notify.promise(
  () => api.syncOrders(),
  {
    loading: {
      title: "Sincronizzazione in corso",
      message: "Aggiorno ordini, stock e spedizioni..."
    },
    success: (result) => ({
      title: "Sync completata",
      message: \`Batch #\${result.batch} completato senza errori.\`
    }),
    error: (error) => ({
      title: "Sync fallita",
      message: error.message
    })
  }
);`)
  }
};

const notify = _.div({ class: "cms-panel cms-page" },
  _.h1("Notify"),
  _.p("Notify e il layer standard per toast e micro-feedback applicativi. Ora supporta payload strutturato, shortcut semantiche, update/remove/clear, slots custom e promise helper per flussi asincroni."),
  _.h2("Props principali"),
  _.List(
    _.Item("type/state/color, variant e position per tono visivo e collocazione"),
    _.Item("title, message, description, meta, body, icon, actions e dismiss per comporre contenuti reali"),
    _.Item("timeout, closable, dismissLabel per il lifecycle del toast"),
    _.Item("slots: icon, title, message, description, meta, actions, dismiss, default per casi avanzati"),
    _.Item("methods: success, warning, error, info, update, remove, clear, promise")
  ),
  _.h2("Documentazione API"),
  _.docTable("Notify"),
  _.h2("Esempi completi"),
  boxCode("Shortcut rapide", listSample.shortcuts),
  boxCode("Payload strutturato", listSample.structured),
  boxCode("Slots API", listSample.slots),
  boxCode("Lifecycle e update", listSample.lifecycle),
  boxCode("Promise helper", listSample.promise)
);

export { notify };
