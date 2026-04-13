import {
  actions,
  codeBlock,
  deepDiveCard,
  grid,
  renderCmswiftTutorialPage,
  stack,
  cmswiftDeepDives,
} from "./cmswift-shared.js";

const reactiveCorePage = _.component((props, ctx) => {
  const [getLeft, setLeft] = _.signal(2);
  const [getRight, setRight] = _.signal(4);
  const [getEffectRuns, setEffectRuns] = _.signal(0);
  const [getCleanupRuns, setCleanupRuns] = _.signal(0);
  const [getEffectState, setEffectState] = _.signal("effect ready");

  const total = _.computed(() => getLeft() + getRight());
  const product = _.computed(() => getLeft() * getRight());

  let stopLiveEffect = null;
  const startEffect = () => {
    if (stopLiveEffect) return;
    stopLiveEffect = _.effect((onCleanup) => {
      const sum = getLeft() + getRight();
      setEffectRuns(getEffectRuns() + 1);
      setEffectState(`effect saw sum=${sum}`);
      onCleanup(() => {
        setCleanupRuns(getCleanupRuns() + 1);
      });
    });
  };

  const stopEffect = () => {
    stopLiveEffect?.();
    stopLiveEffect = null;
    setEffectState("effect disposed");
  };

  startEffect();

  ctx.onDispose(() => {
    stopLiveEffect?.();
    total.dispose?.();
    product.dispose?.();
  });

  const runBatch = () => {
    _.batch(() => {
      setLeft(getLeft() + 1);
      setRight(getRight() + 2);
    });
  };

  const sample = [
    'const [getLeft, setLeft] = _.signal(2);',
    'const [getRight, setRight] = _.signal(4);',
    'const total = _.computed(() => getLeft() + getRight());',
    "",
    "const stop = _.effect((onCleanup) => {",
    "  const sum = getLeft() + getRight();",
    "  console.log(sum);",
    "  onCleanup(() => console.log('cleanup'));",
    "});",
    "",
    "_.batch(() => {",
    "  setLeft(getLeft() + 1);",
    "  setRight(getRight() + 2);",
    "});",
  ];

  return renderCmswiftTutorialPage("reactive", {
    title: "CMSwift Reactive Core",
    summary:
      "Il core reattivo e la spina dorsale del framework. Qui vedi come `signal`, `computed`, `effect` e `batch` formano uno strato piccolo ma sufficiente per derivazioni, side effect e update coordinati.",
    highlights: [
      ["warning", "signals"],
      ["secondary", "computed"],
      ["success", "batch + cleanup"],
    ],
    sections: [
      grid(
        _.Card(
          {
            title: "Controlli",
            subtitle: "Aggiorna i signal e osserva le derivazioni",
          },
          stack(
            actions(
              _.Btn({ size: "sm", outline: true, onClick: () => setLeft(getLeft() - 1) }, "left -"),
              _.Btn({ size: "sm", outline: true, onClick: () => setLeft(getLeft() + 1) }, "left +"),
              _.Btn({ size: "sm", outline: true, onClick: () => setRight(getRight() - 1) }, "right -"),
              _.Btn({ size: "sm", outline: true, onClick: () => setRight(getRight() + 1) }, "right +"),
            ),
            actions(
              _.Btn({ size: "sm", color: "secondary", onClick: runBatch }, "Run batch"),
              _.Btn({ size: "sm", color: "warning", onClick: stopEffect }, "Dispose effect"),
              _.Btn({ size: "sm", color: "success", onClick: startEffect }, "Restart effect"),
            ),
          ),
        ),
        _.Card(
          {
            title: "Stato",
            subtitle: "Signal, computed ed effect in azione",
          },
          _.List(
            _.Item(() => `left: ${getLeft()}`),
            _.Item(() => `right: ${getRight()}`),
            _.Item(() => `total: ${total()}`),
            _.Item(() => `product: ${product()}`),
            _.Item(() => `effect runs: ${getEffectRuns()}`),
            _.Item(() => `cleanup runs: ${getCleanupRuns()}`),
            _.Item(() => `status: ${getEffectState()}`),
          ),
        ),
      ),
      _.Card(
        {
          title: "Cosa impari qui",
          subtitle: "Il cuore del modello reattivo",
        },
        _.List(
          _.Item("`_.signal` crea stato minimale e sincronizzato"),
          _.Item("`_.computed` deriva valore senza duplicare stato"),
          _.Item("`_.effect` connette stato e side effect"),
          _.Item("`onCleanup` rilascia lavoro tra un rerun e l'altro"),
          _.Item("`_.batch` raggruppa update correlati"),
        ),
      ),
      _.Card(
        {
          title: "Snippet",
          subtitle: "Uso base del core reattivo",
        },
        codeBlock(sample),
      ),
      deepDiveCard("Demo collegate", [
        { label: "CMS Reactive", route: cmswiftDeepDives.reactive, tone: "warning" },
      ]),
    ],
  });
});

export { reactiveCorePage };
