const loadingBar = _ui.LoadingBar();
const loadingBarControls = _ui.Row(
  _ui.Btn({ onClick: () => loadingBar.start() }, "Start"),
  _ui.Btn({ onClick: () => loadingBar.stop() }, "Stop")
);

const loadingBar = _h.div({ class: "cms-panel cms-page" },
  _h.h1("LoadingBar"),
  _h.p("Barra di caricamento fissa in alto con API imperativa `set/start/stop`. Montata su `target` o body."),
  _h.h2("Props principali"),
  _ui.List(
    _ui.Item("size: dimensione del componente (xs-sm-md-lg-xl)"),
    _ui.Item("state: success, warning, danger, info, primary, secondary"),
    _ui.Item("outline, shadow, borderRadius, clickable per stile e interazione")
  ),
  _h.h2("Esempio completo"),
  _ui.Card({ header: "Demo" },
    loadingBarControls
  ),
  _h.h2("Documentazione API"),
  CMSwift.ui.DocTable("LoadingBar")
);

export { loadingBar };
