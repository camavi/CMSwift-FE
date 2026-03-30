const tooltipSample = _.div({ class: "cms-panel cms-page" },
  _.h2("Tooltip sample"),
  _.p("Tooltip con titolo, body e footer. Aprilo via click per inserire azioni rapide senza cambiare schermata."),
  _.Card({ header: "Release controls" },
    _.Tooltip({
      trigger: "click",
      interactive: true,
      title: "Rollout progressivo",
      icon: "rocket_launch",
      content: _.List(
        _.Item("10% traffico iniziale"),
        _.Item("Monitoraggio error rate"),
        _.Item("Rollback automatico se necessario")
      ),
      footer: _.Btn({ size: "sm", color: "primary", "data-tooltip-close": true }, "Chiudi")
    }, _.Btn({ color: "primary" }, "Apri tooltip"))
  )
);

export { tooltipSample };
