import {
  actions,
  codeBlock,
  deepDiveCard,
  grid,
  renderCmswiftTutorialPage,
  stack,
  cmswiftDeepDives,
} from "./cmswift-shared.js";

const rendererTutorialPage = _.component((props, ctx) => {
  const [getAccent, setAccent] = _.signal("primary");
  const [getClicks, setClicks] = _.signal(0);
  const [getShowNote, setShowNote] = _.signal(true);

  const sample = [
    'const [getClicks, setClicks] = _.signal(0);',
    "",
    "_.section(",
    "  {",
    "    style: {",
    '      border: () => `2px solid var(--cms-${getAccent()})`,',
    '      padding: "16px",',
    '      borderRadius: "16px"',
    "    }",
    "  },",
    '  _.h3("Renderer demo"),',
    '  _.p(() => `clicks: ${getClicks()}`),',
    "  _.Btn({ onClick: () => setClicks(getClicks() + 1) }, 'Incrementa')",
    ");",
  ];

  ctx.onDispose(() => {});

  return renderCmswiftTutorialPage("renderer", {
    title: "CMSwift Renderer",
    summary:
      "Il renderer e il punto da cui parte tutto: helper HTML/SVG, props normali o reattive, children dinamici e listener evento convivono nella stessa sintassi.",
    highlights: [
      ["info", "HTML helpers"],
      ["secondary", "reactive props"],
      ["success", "SVG included"],
    ],
    sections: [
      _.Card(
        {
          title: "Cosa mostra questa pagina",
          subtitle: "Le primitive che userai ovunque",
        },
        _.List(
          _.Item("helper `_.tag(...)` per creare DOM dichiarativo"),
          _.Item("props statiche o calcolate con funzioni reattive"),
          _.Item("children testuali, nodi e blocchi dinamici"),
          _.Item("eventi DOM senza cambiare modello di composizione"),
        ),
      ),
      grid(
        _.Card(
          {
            title: "Controlli live",
            subtitle: "Aggiorna props, children e SVG",
          },
          stack(
            actions(
              _.Btn(
                {
                  size: "sm",
                  color: "primary",
                  outline: () => getAccent() !== "primary",
                  onClick: () => setAccent("primary"),
                },
                "Primary",
              ),
              _.Btn(
                {
                  size: "sm",
                  color: "secondary",
                  outline: () => getAccent() !== "secondary",
                  onClick: () => setAccent("secondary"),
                },
                "Secondary",
              ),
              _.Btn(
                {
                  size: "sm",
                  color: "success",
                  outline: () => getAccent() !== "success",
                  onClick: () => setAccent("success"),
                },
                "Success",
              ),
            ),
            actions(
              _.Btn(
                {
                  size: "sm",
                  outline: true,
                  onClick: () => setClicks(getClicks() + 1),
                },
                "Click +",
              ),
              _.Btn(
                {
                  size: "sm",
                  outline: true,
                  onClick: () => setShowNote(!getShowNote()),
                },
                "Toggle note",
              ),
            ),
          ),
        ),
        _.Card(
          {
            title: "Preview renderer",
            subtitle: "HTML e SVG nella stessa vista",
          },
          _.section(
            {
              style: {
                display: "grid",
                gap: "12px",
                padding: "16px",
                borderRadius: "18px",
                border: () => `2px solid var(--cms-${getAccent()})`,
                background: "linear-gradient(135deg, rgba(15, 23, 42, .02), rgba(15, 23, 42, .05))",
              },
            },
            _.div(
              { style: { display: "flex", gap: "8px", flexWrap: "wrap" } },
              _.Chip({ color: () => getAccent() }, () => `accent: ${getAccent()}`),
              _.Chip({ outline: true }, () => `clicks: ${getClicks()}`),
            ),
            _.h3("Renderer demo"),
            _.p(
              "Stai guardando helper HTML, props reattive, children condizionali e un blocco SVG nello stesso albero.",
            ),
            () =>
              getShowNote()
                ? _.p(
                    {
                      style: {
                        margin: 0,
                        padding: "10px 12px",
                        borderRadius: "12px",
                        background: "rgba(255,255,255,.72)",
                      },
                    },
                    "La nota e renderizzata in modo condizionale tramite child dinamico.",
                  )
                : null,
            _.svg(
              {
                viewBox: "0 0 180 90",
                width: 220,
                height: 120,
              },
              _.circle({
                cx: 44,
                cy: 45,
                r: 24,
                fill: () =>
                  getAccent() === "primary"
                    ? "#1d4ed8"
                    : getAccent() === "secondary"
                      ? "#7c3aed"
                      : "#059669",
              }),
              _.rect({
                x: 82,
                y: 22,
                width: 56,
                height: 46,
                rx: 14,
                fill: "#5ad1ff",
              }),
              _.text(
                {
                  x: 22,
                  y: 84,
                  fill: "#1f2937",
                  "font-size": 12,
                },
                () => `render ${getClicks()}`,
              ),
            ),
          ),
        ),
      ),
      _.Card(
        {
          title: "Snippet",
          subtitle: "Sintassi minima del renderer",
        },
        codeBlock(sample),
      ),
      deepDiveCard("Demo collegate", [
        { label: "HTML Tutorial", route: cmswiftDeepDives.html, tone: "primary" },
        { label: "CMS Renderer", route: cmswiftDeepDives.renderer, tone: "info" },
      ]),
    ],
  });
});

export { rendererTutorialPage };
