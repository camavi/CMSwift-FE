const createSection = (code, sample) => ({
  code: Array.isArray(code) ? code : [code],
  sample: Array.isArray(sample) ? sample : [sample]
});

const row = (...children) => _.div({
  style: {
    display: "flex",
    flexWrap: "wrap",
    gap: "12px",
    alignItems: "center"
  }
}, ...children);

const rolloutTooltip = _.Tooltip({
  title: "Rollout progressivo",
  icon: "rocket_launch",
  placement: "right",
  interactive: true,
  content: _.div(
    _.p("La release parte dal 10% del traffico, monitora error rate e completa il rollout entro 45 minuti."),
    _.List(
      _.Item("Canale web e app iOS"),
      _.Item("Rollback automatico se error rate > 1.5%"),
      _.Item("Notifica Slack al termine del rollout")
    )
  ),
  footer: _.div({
    style: {
      display: "flex",
      gap: "8px",
      flexWrap: "wrap"
    }
  },
    _.Btn({ size: "sm", outline: true }, "Apri checklist"),
    _.Btn({ size: "sm", color: "primary", "data-tooltip-close": true }, "Chiudi")
  )
});

const rolloutAnchor = _.Btn({ outline: true }, "Dettaglio rollout");
rolloutTooltip.bind(rolloutAnchor);

const listSample = {
  basic: createSection(
    row(
      _.Tooltip(_.Btn({ color: "primary" }, "Save"), "Salva la bozza e mantiene aperto l'editor."),
      _.Tooltip(
        _.Chip({ color: "warning", dense: true }, "Pending review"),
        "In attesa di approvazione da Legal e Brand."
      ),
      _.Tooltip(
        _.Icon({ name: "info", clickable: true }),
        "Le metriche vengono aggiornate ogni 5 minuti."
      ),
      _.Tooltip(
        _.Avatar({ label: "AR", size: "lg" }),
        "Anna Rossi, owner del progetto Q2."
      )
    ),
    [
      "_.Tooltip(_.Btn({ color: \"primary\" }, \"Save\"), \"Salva la bozza e mantiene aperto l'editor.\");",
      '_.Tooltip(_.Chip({ color: "warning", dense: true }, "Pending review"), "In attesa di approvazione da Legal e Brand.");',
      '_.Tooltip(_.Icon({ name: "info", clickable: true }), "Le metriche vengono aggiornate ogni 5 minuti.");',
      '_.Tooltip(_.Avatar({ label: "AR", size: "lg" }), "Anna Rossi, owner del progetto Q2.");'
    ]
  ),
  rich: createSection(
    _.Card({
      eyebrow: "Campaign health",
      title: "Launch newsletter onboarding",
      subtitle: "CTR stabile, conversione in crescita e backlog contenuti quasi chiuso.",
      aside: _.Tooltip({
        title: "Ultimo aggiornamento",
        icon: "insights",
        content: "I dati arrivano da GA4, CRM e automation platform con sync ogni 15 minuti.",
        footer: _.span({ class: "cms-muted" }, "Fonte: Growth Ops")
      }, _.Chip({ color: "success", dense: true, outline: true }, "Live")),
      footer: _.span({ class: "cms-muted" }, "Owner: Growth team"),
      actions: [
        _.Btn({ outline: true }, "Apri report"),
        _.Btn({ color: "primary" }, "Ottimizza")
      ]
    },
      _.div({
        style: {
          display: "flex",
          gap: "10px",
          flexWrap: "wrap"
        }
      },
        _.Tooltip({
          title: "Open rate",
          icon: "mail",
          content: "Target 38%, risultato attuale 41.2%.",
          placement: "top"
        }, _.Chip({ dense: true, glass: true }, "Open 41.2%")),
        _.Tooltip({
          title: "CTR",
          icon: "ads_click",
          content: "CTR stabile dopo il cambio hero. Segmento migliore: returning users.",
          placement: "top"
        }, _.Chip({ color: "info", dense: true, outline: true }, "CTR 6.8%")),
        _.Tooltip({
          title: "Subscribers",
          icon: "group",
          content: "Nuovi iscritti nelle ultime 24h da blog, webinar e referral.",
          placement: "top"
        }, _.Chip({ color: "secondary", dense: true }, "+284 subscribers"))
      ),
      _.p("Usa tooltip piccoli per spiegare KPI, soglie o sorgenti dati senza caricare il layout principale.")
    ),
    `_.Card({
  eyebrow: "Campaign health",
  title: "Launch newsletter onboarding",
  subtitle: "CTR stabile, conversione in crescita e backlog contenuti quasi chiuso.",
  aside: _.Tooltip({
    title: "Ultimo aggiornamento",
    icon: "insights",
    content: "I dati arrivano da GA4, CRM e automation platform con sync ogni 15 minuti.",
    footer: _.span({ class: "cms-muted" }, "Fonte: Growth Ops")
  }, _.Chip({ color: "success", dense: true, outline: true }, "Live"))
},
  _.Tooltip({ title: "Open rate", icon: "mail", content: "Target 38%, risultato attuale 41.2%." }, _.Chip({ dense: true }, "Open 41.2%")),
  _.Tooltip({ title: "CTR", icon: "ads_click", content: "CTR stabile dopo il cambio hero." }, _.Chip({ color: "info", dense: true, outline: true }, "CTR 6.8%"))
);`
  ),
  interactive: createSection(
    row(
      _.Tooltip({
        trigger: "click",
        interactive: true,
        placement: "bottom-start",
        title: "Filtri attivi",
        icon: "filter_alt",
        content: _.List(
          _.Item("Paese: Italia"),
          _.Item("Canale: Paid social"),
          _.Item("Periodo: ultimi 14 giorni")
        ),
        footer: _.div({
          style: {
            display: "flex",
            gap: "8px",
            flexWrap: "wrap"
          }
        },
          _.Btn({ size: "sm", outline: true }, "Modifica"),
          _.Btn({ size: "sm", color: "primary", "data-tooltip-close": true }, "Chiudi")
        )
      }, _.Btn({ color: "secondary" }, "Mostra filtri")),
      _.span({ class: "cms-muted" }, "Click per aprire, poi puoi interagire con il contenuto del tooltip.")
    ),
    [
      '_.Tooltip({',
      '  trigger: "click",',
      '  interactive: true,',
      '  placement: "bottom-start",',
      '  title: "Filtri attivi",',
      '  icon: "filter_alt",',
      '  content: _.List(_.Item("Paese: Italia"), _.Item("Canale: Paid social"), _.Item("Periodo: ultimi 14 giorni")),',
      '  footer: _.div(_.Btn({ size: "sm", outline: true }, "Modifica"), _.Btn({ size: "sm", color: "primary", "data-tooltip-close": true }, "Chiudi"))',
      '}, _.Btn({ color: "secondary" }, "Mostra filtri"));'
    ]
  ),
  imperative: createSection(
    [
      _.p("Quando ti serve controllo completo puoi usare l'API `bind/open/close/toggle` senza wrapper implicito."),
      row(
        rolloutAnchor,
        _.Btn({ color: "primary", onClick: () => rolloutTooltip.open(rolloutAnchor) }, "Open"),
        _.Btn({ outline: true, onClick: () => rolloutTooltip.close() }, "Close"),
        _.Btn({ outline: true, onClick: () => rolloutTooltip.toggle(rolloutAnchor) }, "Toggle")
      )
    ],
    [
      'const rolloutTooltip = _.Tooltip({',
      '  title: "Rollout progressivo",',
      '  icon: "rocket_launch",',
      '  placement: "right",',
      '  interactive: true,',
      '  content: _.p("La release parte dal 10% del traffico e completa il rollout entro 45 minuti."),',
      '  footer: _.Btn({ size: "sm", color: "primary", "data-tooltip-close": true }, "Chiudi")',
      '});',
      '',
      'const rolloutAnchor = _.Btn({ outline: true }, "Dettaglio rollout");',
      'rolloutTooltip.bind(rolloutAnchor);',
      '_.Btn({ color: "primary", onClick: () => rolloutTooltip.open(rolloutAnchor) }, "Open");',
      '_.Btn({ outline: true, onClick: () => rolloutTooltip.close() }, "Close");'
    ]
  )
};

const tooltip = _.div({ class: "cms-panel cms-page" },
  _.h1("Tooltip"),
  _.p("Tooltip standardizzato per microcopy, spiegazioni KPI e azioni rapide. Supporta wrapper diretto, trigger configurabili, contenuto ricco con titolo/icona/footer e API imperativa."),
  _.h2("Props principali"),
  _.List(
    _.Item("title, content, text, footer, icon per costruire tooltip semplici o ricchi"),
    _.Item("trigger: hover/focus, click o manual per controllare come si apre"),
    _.Item("interactive, closeOnOutside, closeOnEsc, delay, hideDelay per affinare UX"),
    _.Item("slots target/icon/title/content/footer e API bind/open/show/hide/close/toggle")
  ),
  _.h2("Documentazione API"),
  _.docTable("Tooltip"),
  _.h2("Esempi completi"),
  boxCode("Microcopy inline", listSample.basic),
  boxCode("Tooltip ricco in una card", listSample.rich),
  boxCode("Click + interactive", listSample.interactive),
  boxCode("API imperativa", listSample.imperative)
);

export { tooltip };
