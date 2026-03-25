const loadingBar = _.LoadingBar();
const loadingBarControls = _.Row(
  _.Btn({ onClick: () => loadingBar.start() }, "Start"),
  _.Btn({ onClick: () => loadingBar.stop() }, "Stop")
);

const loadingBar = _.div({ class: "cms-panel cms-page" },
  _.h1("LoadingBar"),
  _.p("Barra di caricamento fissa in alto con API imperativa `set/start/stop`. Montata su `target` o body."),
  _.h2("Props principali"),
  _.List(
    _.Item("size: dimensione del componente (xs-sm-md-lg-xl)"),
    _.Item("state: success, warning, danger, info, primary, secondary"),
    _.Item("outline, shadow, borderRadius, clickable per stile e interazione")
  ),
  _.h2("Esempio completo"),
  _.Card({ header: "Demo" },
    loadingBarControls
  ),
  _.h2("Documentazione API"),
  _.docTable("LoadingBar")
);

export { loadingBar };
