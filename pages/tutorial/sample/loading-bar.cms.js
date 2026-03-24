const loadingBar = _.LoadingBar();
const loadingBarControls = _.Row(
  _.Btn({ onClick: () => loadingBar.start() }, "Start"),
  _.Btn({ onClick: () => loadingBar.stop() }, "Stop")
);

const loadingBarSample = _.div({ class: "cms-panel cms-page" },
  _.h2("LoadingBar sample"),
  _.p("Barra di caricamento fissa in alto con API imperativa `set/start/stop`. Montata su `target` o body."),
  _.Card({ header: "Esempio" },
    loadingBarControls
  )
);

export { loadingBarSample };
