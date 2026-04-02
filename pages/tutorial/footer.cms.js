const createSection = (code, sample) => ({
  code: Array.isArray(code) ? code : [code],
  sample: Array.isArray(sample) ? sample : [sample]
});

const row = (...children) => _.div({
  style: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    alignItems: "center"
  }
}, ...children);

const stack = (...children) => _.div({
  style: {
    display: "grid",
    gap: "var(--cms-s-md)"
  }
}, ...children);

const reviewMode = _.rod("gradual");

const listSample = {
  structured: createSection(
    _.Card({
      title: "Checkout rollout",
      subtitle: "Esempio reale con summary, meta e CTA finali"
    },
      _.List({ marker: false, divider: true },
        _.Item({ title: "Smoke test", subtitle: "IT, ES e FR completati", aside: _.Chip({ color: "success", outline: true, size: "xs" }, "pass") }),
        _.Item({ title: "Rollback", subtitle: "Pronto in 90 secondi", aside: _.Chip({ color: "info", outline: true, size: "xs" }, "ready") }),
        _.Item({ title: "Support team", subtitle: "War room aperta fino alle 18:00", aside: _.Chip({ color: "secondary", outline: true, size: "xs" }, "live") })
      ),
      _.Footer({
        icon: "rocket_launch",
        eyebrow: "Release handoff",
        title: "Checkout progressive rollout al 10%",
        subtitle: "La build e pronta, i test automatici sono verdi e il monitoraggio resta attivo per 30 minuti.",
        meta: row(
          _.Chip({ color: "success", outline: true, size: "sm" }, "smoke ok"),
          _.Chip({ color: "info", outline: true, size: "sm" }, "rollback ready")
        ),
        actions: [
          _.Btn({ size: "sm", outline: true }, "Apri changelog"),
          _.Btn({ size: "sm", color: "primary" }, "Conferma release")
        ]
      })
    ),
    `_.Footer({
  icon: "rocket_launch",
  eyebrow: "Release handoff",
  title: "Checkout progressive rollout al 10%",
  subtitle: "La build e pronta, i test automatici sono verdi e il monitoraggio resta attivo per 30 minuti.",
  meta: row(
    _.Chip({ color: "success", outline: true, size: "sm" }, "smoke ok"),
    _.Chip({ color: "info", outline: true, size: "sm" }, "rollback ready")
  ),
  actions: [
    _.Btn({ size: "sm", outline: true }, "Apri changelog"),
    _.Btn({ size: "sm", color: "primary" }, "Conferma release")
  ]
});`
  ),
  actionBar: createSection(
    _.Card({
      title: "Cart review",
      subtitle: "Footer usato come barra finale per pricing, compliance e CTA"
    },
      stack(
        _.Grid({ cols: 3, gap: 12 },
          _.GridCol(_.Card({ title: "Subtotale", subtitle: "Ordine B2B" }, _.div({ class: "cms-h3" }, "EUR 12.480"))),
          _.GridCol(_.Card({ title: "Fee logistica", subtitle: "Carrier + handling" }, _.div({ class: "cms-h3" }, "EUR 640"))),
          _.GridCol(_.Card({ title: "Margine", subtitle: "Dopo promo" }, _.div({ class: "cms-h3" }, "18.4%")))
        ),
        _.Footer({
          dense: true,
          elevated: true,
          left: row(
            _.Chip({ color: "warning", size: "sm" }, "Review richiesta"),
            _.span({ class: "cms-muted" }, "Ordine #10492 - customer wholesale - ETA 12 min")
          ),
          actions: [
            _.Btn({ size: "sm", outline: true }, "Esporta PDF"),
            _.Btn({ size: "sm" }, "Salva bozza"),
            _.Btn({ size: "sm", color: "warning" }, "Approva eccezione")
          ]
        })
      )
    ),
    `_.Footer({
  dense: true,
  elevated: true,
  left: row(
    _.Chip({ color: "warning", size: "sm" }, "Review richiesta"),
    _.span({ class: "cms-muted" }, "Ordine #10492 - customer wholesale - ETA 12 min")
  ),
  actions: [
    _.Btn({ size: "sm", outline: true }, "Esporta PDF"),
    _.Btn({ size: "sm" }, "Salva bozza"),
    _.Btn({ size: "sm", color: "warning" }, "Approva eccezione")
  ]
});`
  ),
  slots: createSection(
    _.Card({
      title: "Slot driven footer",
      subtitle: "Quando vuoi un layout piu editoriale o piu applicativo"
    },
      _.div({ class: "cms-m-b-md" },
        _.Radio({ model: reviewMode, value: "gradual", color: "primary" }, "Gradual rollout"),
        _.Radio({ model: reviewMode, value: "full", color: "success" }, "Full rollout"),
        _.Radio({ model: reviewMode, value: "hold", color: "warning" }, "Hold release")
      ),
      _.Footer({
        divider: false,
        slots: {
          left: () => _.Avatar({ label: "OPS", color: "secondary", size: 42 }),
          body: () => stack(
            _.div(
              _.div({ class: "cms-footer-eyebrow" }, "Decisione pubblicazione"),
              _.div({ class: "cms-footer-title" }, () => reviewMode.value === "hold" ? "Release in hold" : "Release pronta per il canale selezionato"),
              _.div({ class: "cms-footer-subtitle" }, () => reviewMode.value === "full"
                ? "Tutti i market owner hanno approvato. Il rollout puo partire al 100%."
                : (reviewMode.value === "gradual"
                  ? "Partenza progressiva con osservabilita rinforzata sui primi 15 minuti."
                  : "Serve allineamento finale con support e finance prima di procedere."))
            ),
            row(
              _.Checkbox({ model: _.rod(true), color: "success" }, "Rollback verificato"),
              _.Checkbox({ model: _.rod(true), color: "success" }, "Smoke test completati"),
              _.Checkbox({ model: _.rod(false), color: "warning" }, "Customer success informato")
            )
          ),
          end: () => _.Chip({
            color: () => reviewMode.value === "hold" ? "warning" : (reviewMode.value === "full" ? "success" : "info"),
            outline: true,
            size: "sm"
          }, () => `mode: ${reviewMode.value}`),
          actions: () => [
            _.Btn({ size: "sm", outline: true }, "Apri war room"),
            _.Btn({ size: "sm", color: "primary" }, "Applica decisione")
          ]
        }
      })
    ),
    `const reviewMode = _.rod("gradual");

_.Footer({
  divider: false,
  slots: {
    left: () => _.Avatar({ label: "OPS", color: "secondary", size: 42 }),
    body: () => stack(
      _.div(
        _.div({ class: "cms-footer-eyebrow" }, "Decisione pubblicazione"),
        _.div({ class: "cms-footer-title" }, () => reviewMode.value === "hold" ? "Release in hold" : "Release pronta"),
        _.div({ class: "cms-footer-subtitle" }, () => reviewMode.value === "full" ? "Rollout al 100%." : "Partenza progressiva con monitoraggio.")
      ),
      row(
        _.Checkbox({ model: _.rod(true), color: "success" }, "Rollback verificato"),
        _.Checkbox({ model: _.rod(true), color: "success" }, "Smoke test completati")
      )
    ),
    end: () => _.Chip({ color: "info", outline: true, size: "sm" }, () => \`mode: \${reviewMode.value}\`),
    actions: () => [
      _.Btn({ size: "sm", outline: true }, "Apri war room"),
      _.Btn({ size: "sm", color: "primary" }, "Applica decisione")
    ]
  }
});`
  )
};

const footer = _.div({ class: "cms-panel cms-page" },
  _.h1("Footer"),
  _.p("Footer standardizzato per chiudere pagine, shell applicative, card operative e barre azione. Ora supporta una struttura coerente con il resto della UI: aree `start/body/end`, copy tipizzata, meta, actions e slot dedicati."),
  _.h2("Props principali"),
  _.List(
    _.Item("title, subtitle, eyebrow, icon, meta per costruire un footer strutturato senza markup ripetuto"),
    _.Item("left, right, actions oppure slots.left/body/end/actions per gestire regioni stabili e layout custom"),
    _.Item("sticky, dense, elevated, divider, align, justify, wrap, gap, minHeight per adattare il comportamento visivo"),
    _.Item("children come fallback di `content`, quindi i casi semplici restano compatti e retrocompatibili")
  ),
  _.h2("Documentazione API"),
  _.docTable("Footer"),
  _.h2("Esempi completi"),
  boxCode("Footer strutturato per handoff release", listSample.structured, 24),
  boxCode("Action bar per pricing e approvazioni", listSample.actionBar, 24),
  boxCode("Footer costruito via slot", listSample.slots, 24)
);

export { footer };
