import {
  actions,
  codeBlock,
  deepDiveCard,
  grid,
  renderCmswiftTutorialPage,
  stack,
  cmswiftDeepDives,
} from "./cmswift-shared.js";

const PulseWidget = _.component((props, ctx) => {
  const [getTicks, setTicks] = _.signal(0);
  const label = () => props?.label || "Component";

  const timer = setInterval(() => {
    setTicks(getTicks() + 1);
  }, 1000);

  ctx.onDispose(() => {
    clearInterval(timer);
  });

  return _.Card(
    {
      title: () => label(),
      subtitle: "Componente con cleanup su dispose",
    },
    _.p(() => `ticks: ${getTicks()}`),
    _.p("Quando il componente viene smontato, l'intervallo viene rilasciato."),
  );
});

const componentLifecyclePage = _.component((props, ctx) => {
  const [getMounted, setMounted] = _.signal(true);
  const [getLabel, setLabel] = _.signal("Pulse widget");

  ctx.onDispose(() => {});

  const sample = [
    "const PulseWidget = _.component((props, ctx) => {",
    "  const [getTicks, setTicks] = _.signal(0);",
    "  const timer = setInterval(() => setTicks(getTicks() + 1), 1000);",
    "",
    "  ctx.onDispose(() => {",
    "    clearInterval(timer);",
    "  });",
    "",
    "  return _.Card({ title: props.label }, _.p(() => getTicks()));",
    "});",
  ];

  return renderCmswiftTutorialPage("components", {
    title: "CMSwift Components & Lifecycle",
    summary:
      "`_.component` ti permette di comporre comportamento, stato locale e cleanup in unita piccole. `ctx.onDispose` chiude il ciclo di vita e impedisce che timer, listener o side effect rimangano vivi oltre il dovuto.",
    highlights: [
      ["secondary", "_.component"],
      ["warning", "ctx.onDispose"],
      ["success", "safe cleanup"],
    ],
    sections: [
      grid(
        _.Card(
          {
            title: "Controlli",
            subtitle: "Monta, smonta e rinomina il componente",
          },
          stack(
            actions(
              _.Btn(
                {
                  size: "sm",
                  color: "primary",
                  onClick: () => setMounted(!getMounted()),
                },
                () => (getMounted() ? "Smonta" : "Monta"),
              ),
            ),
            _.label({ for: "component-label", style: { fontWeight: 700 } }, "Label"),
            _.input({
              id: "component-label",
              value: () => getLabel(),
              onInput: (event) => setLabel(event.target.value),
              style: {
                width: "100%",
                padding: "10px 12px",
                borderRadius: "12px",
                border: "1px solid var(--cms-border, rgba(0,0,0,.12))",
              },
            }),
          ),
        ),
        _.Card(
          {
            title: "Preview lifecycle",
            subtitle: "Il componente pulisce il timer quando sparisce",
          },
          () =>
            getMounted()
              ? PulseWidget({ label: getLabel() })
              : _.div(
                  {
                    style: {
                      padding: "16px",
                      borderRadius: "14px",
                      background: "rgba(255, 244, 229, .9)",
                    },
                  },
                  "Componente smontato: il timer interno non deve continuare a girare.",
                ),
        ),
      ),
      _.Card(
        {
          title: "Perche conta",
          subtitle: "Il lifecycle evita leak e side effect zombie",
        },
        _.List(
          _.Item("timer e intervalli vengono rilasciati"),
          _.Item("listener DOM possono essere rimossi nel dispose"),
          _.Item("watch, subscription o cleanup custom restano locali al componente"),
          _.Item("componenti piccoli restano affidabili quando la pagina cresce"),
        ),
      ),
      _.Card(
        {
          title: "Snippet",
          subtitle: "Componente con cleanup",
        },
        codeBlock(sample),
      ),
      deepDiveCard("Demo collegate", [
        { label: "CMS Lifecycle", route: cmswiftDeepDives.lifecycle, tone: "warning" },
      ]),
    ],
  });
});

export { componentLifecyclePage };
