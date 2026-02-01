const loadingBar = _ui.LoadingBar();
const loadingBarControls = _ui.Row(
  _ui.Btn({ onClick: () => loadingBar.start() }, "Start"),
  _ui.Btn({ onClick: () => loadingBar.stop() }, "Stop")
);

const loadingBarSample = _h.div({ class: "cms-panel cms-page" },
  _h.h2("LoadingBar sample"),
  _h.p("Barra di caricamento fissa in alto con API imperativa `set/start/stop`. Montata su `target` o body."),
  _ui.Card({ header: "Esempio" },
    loadingBarControls
  )
);

export { loadingBarSample };
