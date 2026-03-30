const globalLoadingBar = _.LoadingBar({
  height: 4,
  state: "primary",
  striped: true,
  animated: true,
  glow: true,
  shadow: true
});

let globalLoadingTimer = null;
const stopGlobalLoadingTimer = () => {
  if (globalLoadingTimer) {
    clearInterval(globalLoadingTimer);
    globalLoadingTimer = null;
  }
};
const runGlobalLoading = () => {
  stopGlobalLoadingTimer();
  globalLoadingBar.reset();
  globalLoadingBar.start(14);
  globalLoadingTimer = setInterval(() => {
    const current = globalLoadingBar.get();
    if (current >= 88) {
      stopGlobalLoadingTimer();
      setTimeout(() => globalLoadingBar.done(), 320);
      return;
    }
    globalLoadingBar.inc(current < 40 ? 12 : (current < 75 ? 7 : 3));
  }, 380);
};

const inlineValue = _.rod(36);
const inlineBuffer = _.rod(58);
const inlineLoadingBar = _.LoadingBar({
  mount: false,
  position: "relative",
  model: inlineValue,
  buffer: inlineBuffer,
  height: 12,
  state: "success",
  showValue: "inside",
  insideLabel: () => `Deploy ${inlineValue.value}%`,
  startLabel: "queued",
  endLabel: "production",
  striped: true,
  animated: true,
  radius: "xl",
  trackColor: "rgba(35, 197, 94, 0.15)",
  bufferColor: "rgba(35, 197, 94, 0.28)"
});

const scopedTarget = _.div({
  class: "cms-panel cms-p-md",
  style: {
    position: "relative",
    minHeight: "112px",
    overflow: "hidden"
  }
},
  _.div({ class: "cms-m-t-md" },
    _.b("Sincronizzazione asset"),
    _.p("Esempio reale montato dentro un container custom con `target` e `position: \"absolute\"`.")
  )
);

const scopedLoadingBar = _.LoadingBar({
  target: scopedTarget,
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  height: 6,
  color: "#f59e0b",
  trackColor: "rgba(245, 158, 11, 0.12)",
  bufferColor: "rgba(245, 158, 11, 0.24)",
  striped: true,
  animated: true,
  shadow: true
});

let scopedLoadingTimer = null;
const stopScopedLoadingTimer = () => {
  if (scopedLoadingTimer) {
    clearInterval(scopedLoadingTimer);
    scopedLoadingTimer = null;
  }
};
const runScopedLoading = () => {
  stopScopedLoadingTimer();
  scopedLoadingBar.reset();
  scopedLoadingBar.start(8);
  scopedLoadingTimer = setInterval(() => {
    const current = scopedLoadingBar.get();
    if (current >= 92) {
      stopScopedLoadingTimer();
      setTimeout(() => scopedLoadingBar.done(), 240);
      return;
    }
    scopedLoadingBar.inc(current < 55 ? 15 : 6);
    scopedLoadingBar.setBuffer(Math.min(100, scopedLoadingBar.get() + 10));
  }, 320);
};

const listSample = {
  global: {
    code: [
      _.p("Controlla una barra globale fissata in alto alla pagina. L'esempio usa l'API imperativa completa per simulare una richiesta reale."),
      _.Row(
        _.Btn({ onClick: runGlobalLoading }, "Run request"),
        _.Btn({ onClick: () => globalLoadingBar.start() }, "Start"),
        _.Btn({ onClick: () => globalLoadingBar.inc(18) }, "Increment +18"),
        _.Btn({ onClick: () => globalLoadingBar.done() }, "Done"),
        _.Btn({ onClick: () => { stopGlobalLoadingTimer(); globalLoadingBar.reset(); } }, "Reset")
      )
    ],
    sample: [
      'const loadingBar = _.LoadingBar({ height: 4, state: "primary", striped: true, animated: true });',
      'loadingBar.start(14);',
      'loadingBar.inc(18);',
      'loadingBar.done();',
      'loadingBar.reset();'
    ]
  },
  inline: {
    code: [
      _.div({ class: "cms-m-b-md" },
        _.b("Value: "),
        _.span(() => `${inlineValue.value}%`),
        _.span("  "),
        _.b("Buffer: "),
        _.span(() => `${inlineBuffer.value}%`)
      ),
      inlineLoadingBar,
      _.Row(
        _.Btn({ onClick: () => inlineLoadingBar.set(24) }, "Set 24%"),
        _.Btn({ onClick: () => inlineLoadingBar.inc(12) }, "Increment +12"),
        _.Btn({ onClick: () => inlineLoadingBar.setBuffer(Math.min(100, inlineBuffer.value + 14)) }, "Buffer +14"),
        _.Btn({ onClick: () => inlineLoadingBar.done() }, "Done")
      )
    ],
    sample: [
      'const value = _.rod(36);',
      'const buffer = _.rod(58);',
      '_.LoadingBar({',
      '  mount: false,',
      '  position: "relative",',
      '  model: value,',
      '  buffer: buffer,',
      '  height: 12,',
      '  state: "success",',
      '  showValue: "inside",',
      '  insideLabel: () => `Deploy ${value.value}%`,',
      '  startLabel: "queued",',
      '  endLabel: "production",',
      '  striped: true,',
      '  animated: true,',
      '  radius: "xl"',
      '});'
    ]
  },
  scoped: {
    code: [
      scopedTarget,
      _.Row(
        _.Btn({ onClick: runScopedLoading }, "Run sync"),
        _.Btn({ onClick: () => scopedLoadingBar.set(48) }, "Set 48%"),
        _.Btn({ onClick: () => scopedLoadingBar.setBuffer(80) }, "Buffer 80%"),
        _.Btn({ onClick: () => scopedLoadingBar.done() }, "Complete")
      )
    ],
    sample: [
      'const panel = _.div({ style: { position: "relative", minHeight: "112px", overflow: "hidden" } });',
      'const loadingBar = _.LoadingBar({',
      '  target: panel,',
      '  position: "absolute",',
      '  top: 0, left: 0, right: 0,',
      '  height: 6,',
      '  color: "#f59e0b",',
      '  trackColor: "rgba(245, 158, 11, 0.12)",',
      '  bufferColor: "rgba(245, 158, 11, 0.24)",',
      '  striped: true,',
      '  animated: true',
      '});',
      'loadingBar.start(8);'
    ]
  }
};

const loadingBar = _.div({ class: "cms-panel cms-page" },
  _.h1("LoadingBar"),
  _.p("Loading bar standardizzata costruita sopra `_.Progress`: puo essere globale, inline o montata dentro un container specifico, con controllo tramite `model` o API imperativa."),
  _.h2("Props principali"),
  _.List(
    _.Item("`model`, `value`, `buffer`: controllo reattivo o imperativo dello stato"),
    _.Item("`mount`, `target`, `position`, `top/right/bottom/left`: gestione del montaggio e del layout"),
    _.Item("`start()`, `inc()`, `setBuffer()`, `done()`, `reset()`: API rapida per richieste, upload e sync"),
    _.Item("eredita le props visive di `_.Progress`: `state`, `color`, `height`, `striped`, `animated`, `showValue`, `insideLabel`, `radius`")
  ),
  _.h2("Documentazione API"),
  _.docTable("LoadingBar"),
  _.h2("Esempio completo"),
  boxCode("Global fixed loading bar", listSample.global),
  boxCode("Inline loading bar con model e buffer", listSample.inline),
  boxCode("Loading bar montata in un container", listSample.scoped)
);

export { loadingBar };
