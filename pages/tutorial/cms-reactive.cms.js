const infoLine = (label, getter) => _.div({ class: "cms-m-b-xs" }, _.b(`${label}: `), _.span(getter));

const actionRow = (...children) => _.div({
  style: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap"
  }
}, ...children);

const stack = (...children) => _.div({
  style: {
    display: "grid",
    gap: "12px"
  }
}, ...children);

const cmsReactive = _.component((props, ctx) => {
  const [getCount, setCount] = _.signal(2);
  const [getStep, setStep] = _.signal(3);
  const [getDebug, setDebug] = _.signal(10);

  const [getEffectLeft, setEffectLeft] = _.signal(1);
  const [getEffectRight, setEffectRight] = _.signal(5);
  const [getEffectEnabled, setEffectEnabled] = _.signal(true);
  const [getEffectRuns, setEffectRuns] = _.signal(0);
  const [getCleanupRuns, setCleanupRuns] = _.signal(0);
  const [getEffectMessage, setEffectMessage] = _.signal("effect ready");
  const [getBatchLeft, setBatchLeft] = _.signal(1);
  const [getBatchRight, setBatchRight] = _.signal(10);
  const [getBatchView, setBatchView] = _.signal("runs=0 snapshot=1:10");
  const [getBatchStatus, setBatchStatus] = _.signal("idle");

  const product = _.computed(() => getCount() * getStep());
  const summary = _.computed(() => `count=${getCount()} step=${getStep()} product=${product()}`);
  const untrackedSummary = _.computed(() => {
    const count = getCount();
    const debugSnapshot = _.untracked(() => getDebug());
    return `count=${count}, debug snapshot=${debugSnapshot}`;
  });

  let effectRunCount = 0;
  let cleanupRunCount = 0;
  let batchRunCount = 0;
  let stopMirrorEffect = null;
  const stopBatchEffect = _.effect(() => {
    const snapshot = `${getBatchLeft()}:${getBatchRight()}`;
    batchRunCount += 1;
    setBatchView(`runs=${batchRunCount} snapshot=${snapshot}`);
  });

  const startMirrorEffect = () => {
    if (stopMirrorEffect) return;
    setEffectEnabled(true);
    stopMirrorEffect = _.effect((onCleanup) => {
      const left = getEffectLeft();
      const right = getEffectRight();
      effectRunCount += 1;
      setEffectRuns(effectRunCount);
      setEffectMessage(`effect saw ${left} + ${right} = ${left + right}`);
      onCleanup(() => {
        cleanupRunCount += 1;
        setCleanupRuns(cleanupRunCount);
      });
    });
  };

  const stopEffect = () => {
    if (!stopMirrorEffect) return;
    stopMirrorEffect();
    stopMirrorEffect = null;
    setEffectEnabled(false);
    setEffectMessage("effect disposed");
  };

  startMirrorEffect();

  ctx.onDispose(() => {
    stopMirrorEffect?.();
    stopBatchEffect?.();
    product.dispose?.();
    summary.dispose?.();
    untrackedSummary.dispose?.();
  });

  const runSyncBatch = () => {
    _.batch(() => {
      setBatchLeft(getBatchLeft() + 1);
      setBatchRight(getBatchRight() + 10);
    });
    setBatchStatus(`sync batch closed -> ${getBatchView()}`);
  };

  const runMicrotaskBatch = () => {
    _.batch(() => {
      setBatchLeft(getBatchLeft() + 1);
      setBatchRight(getBatchRight() + 10);
    }, { flush: "microtask" });

    setBatchStatus(`immediately after microtask batch -> ${getBatchView()}`);
    queueMicrotask(() => {
      setBatchStatus(`after microtask flush -> ${getBatchView()}`);
    });
  };

  const listSample = {
    signalComputed: {
      code: [
        _.Card({ title: "Signal + computed", subtitle: "Derivazioni pure sul core reattivo" },
          stack(
            actionRow(
              _.Btn({ size: "sm", outline: true, onClick: () => setCount(getCount() - 1) }, "count -"),
              _.Btn({ size: "sm", onClick: () => setCount(getCount() + 1) }, "count +"),
              _.Btn({ size: "sm", outline: true, onClick: () => setStep(getStep() - 1) }, "step -"),
              _.Btn({ size: "sm", onClick: () => setStep(getStep() + 1) }, "step +")
            ),
            infoLine("count()", () => String(getCount())),
            infoLine("step()", () => String(getStep())),
            infoLine("product()", () => String(product())),
            infoLine("summary()", () => summary())
          )
        )
      ],
      sample: [
        'const [getCount, setCount] = _.signal(2);',
        'const [getStep, setStep] = _.signal(3);',
        'const product = _.computed(() => getCount() * getStep());',
        'const summary = _.computed(() => `count=${getCount()} step=${getStep()} product=${product()}`);',
        '_.div(() => summary());'
      ]
    },
    effectCleanup: {
      code: [
        _.Card({ title: "Effect + cleanup + dispose", subtitle: "L effect vede i signal e rilascia cleanup ai rerun" },
          stack(
            actionRow(
              _.Btn({ size: "sm", outline: true, onClick: () => setEffectLeft(getEffectLeft() - 1) }, "left -"),
              _.Btn({ size: "sm", onClick: () => setEffectLeft(getEffectLeft() + 1) }, "left +"),
              _.Btn({ size: "sm", outline: true, onClick: () => setEffectRight(getEffectRight() - 1) }, "right -"),
              _.Btn({ size: "sm", onClick: () => setEffectRight(getEffectRight() + 1) }, "right +"),
              _.Btn({ size: "sm", color: "warning", onClick: stopEffect }, "dispose effect"),
              _.Btn({ size: "sm", color: "success", onClick: startMirrorEffect }, "restart effect")
            ),
            infoLine("effect enabled", () => getEffectEnabled() ? "true" : "false"),
            infoLine("effect runs", () => String(getEffectRuns())),
            infoLine("cleanup runs", () => String(getCleanupRuns())),
            infoLine("message", () => getEffectMessage())
          )
        )
      ],
      sample: [
        'let stop = _.effect((onCleanup) => {',
        '  const left = getEffectLeft();',
        '  const right = getEffectRight();',
        '  setEffectMessage(`effect saw ${left} + ${right} = ${left + right}`);',
        '  onCleanup(() => setCleanupRuns(getCleanupRuns() + 1));',
        '});',
        'stop();'
      ]
    },
    untracked: {
      code: [
        _.Card({ title: "Untracked snapshot", subtitle: "La lettura untracked non crea dipendenza reattiva" },
          stack(
            actionRow(
              _.Btn({ size: "sm", outline: true, onClick: () => setDebug(getDebug() - 1) }, "debug -"),
              _.Btn({ size: "sm", onClick: () => setDebug(getDebug() + 1) }, "debug +"),
              _.Btn({ size: "sm", color: "primary", onClick: () => setCount(getCount() + 1) }, "touch tracked count")
            ),
            infoLine("debug signal", () => String(getDebug())),
            infoLine("untracked summary", () => untrackedSummary()),
            _.p({ class: "cms-muted" }, "Se cambi solo `debug`, `untrackedSummary()` non si aggiorna. Si aggiorna quando cambia `count`, che e la dipendenza tracciata.")
          )
        )
      ],
      sample: [
        'const untrackedSummary = _.computed(() => {',
        '  const count = getCount();',
        '  const debugSnapshot = _.untracked(() => getDebug());',
        '  return `count=${count}, debug snapshot=${debugSnapshot}`;',
        '});'
      ]
    },
    batch: {
      code: [
        _.Card({ title: "Batch sync vs microtask", subtitle: "Il batch puo flush-are subito o nel microtask successivo" },
          stack(
            actionRow(
              _.Btn({ size: "sm", onClick: runSyncBatch }, "run sync batch"),
              _.Btn({ size: "sm", color: "secondary", onClick: runMicrotaskBatch }, "run microtask batch")
            ),
            infoLine("batch signals", () => `${getBatchLeft()}:${getBatchRight()}`),
            infoLine("batch effect view", () => getBatchView()),
            infoLine("batch status", () => getBatchStatus()),
            _.p({ class: "cms-muted" }, "Con `flush: \"microtask\"` il rerun dell effect non avviene subito alla chiusura del batch: lo vedi nel passaggio da `immediately after...` a `after microtask flush...`.")
          )
        )
      ],
      sample: [
        '_.batch(() => {',
        '  setLeft(2);',
        '  setRight(20);',
        '}, { flush: "microtask" });'
      ]
    }
  };

  return _.div({ class: "cms-panel cms-page" },
    _.h1("CMS Reactive"),
    _.p("Tutorial minimo del core reattivo di CMSwift. Qui usiamo direttamente `_.signal`, `_.effect`, `_.computed` e `_.untracked`, senza passare dai componenti UI piu alti."),
    _.h2("API disponibili"),
    _.List(
      _.Item("`_.signal(initial)` -> `[get, set, dispose]`"),
      _.Item("`_.effect(fn)` -> esegue subito l effect e restituisce `dispose()`"),
      _.Item("`_.computed(fn)` -> getter derivato con `dispose()`"),
      _.Item("`_.untracked(fn)` -> legge senza registrare dipendenze"),
      _.Item("`_.batch(fn, { flush })` -> raggruppa update e puo flush-are in sync o microtask")
    ),
    _.h2("Esempi"),
    boxCode("Signal + computed", listSample.signalComputed, 24),
    boxCode("Effect + cleanup + dispose", listSample.effectCleanup, 24),
    boxCode("Untracked", listSample.untracked, 24),
    boxCode("Batch", listSample.batch, 24)
  );
});

export { cmsReactive };
