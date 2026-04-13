import {
  codeBlock,
  deepDiveCard,
  grid,
  renderCmswiftTutorialPage,
  stack,
  cmswiftDeepDives,
} from "./cmswift-shared.js";

const rodBindingPage = _.component((props, ctx) => {
  const workspace = _.rod({
    name: "Release workspace",
    owner: "Frontend team",
    mode: "guided",
    flags: {
      renderer: true,
      reactive: true,
      ui: true,
      platform: false,
    },
  });

  const activeFlags = _.computed(() => {
    const out = [];
    if (workspace.value.flags.renderer) out.push("Renderer");
    if (workspace.value.flags.reactive) out.push("Reactive");
    if (workspace.value.flags.ui) out.push("UI");
    if (workspace.value.flags.platform) out.push("Platform");
    return out;
  });

  ctx.onDispose(() => {
    activeFlags.dispose?.();
  });

  const sample = [
    "const workspace = _.rod({",
    '  name: "Release workspace",',
    '  mode: "guided",',
    "  flags: { renderer: true, reactive: true, ui: true, platform: false }",
    "});",
    "",
    '_.Checkbox({ model: workspace.value.flags.renderer, color: "primary" }, "Renderer");',
    '_.Radio({ model: workspace.value.mode, value: "guided" }, "Guided");',
    "_.input({",
    "  value: () => workspace.value.name,",
    "  onInput: (event) => { workspace.value.name = event.target.value; }",
    "});",
  ];

  return renderCmswiftTutorialPage("rod", {
    title: "CMSwift Rod Binding",
    summary:
      "`_.rod` e il layer che rende piu semplice collegare stato e UI. Ti permette di lavorare su oggetti annidati mantenendo lettura e scrittura dirette, e di usarli come model nei componenti UI.",
    highlights: [
      ["success", "nested state"],
      ["primary", "model binding"],
      ["secondary", "low ceremony"],
    ],
    sections: [
      grid(
        _.Card(
          {
            title: "Editor stato",
            subtitle: "Rod su oggetto annidato",
          },
          stack(
            _.label({ for: "rod-name", style: { fontWeight: 700 } }, "Workspace name"),
            _.input({
              id: "rod-name",
              value: () => workspace.value.name,
              onInput: (event) => {
                workspace.value.name = event.target.value;
              },
              style: {
                width: "100%",
                padding: "10px 12px",
                borderRadius: "12px",
                border: "1px solid var(--cms-border, rgba(0,0,0,.12))",
              },
            }),
            _.label({ for: "rod-owner", style: { fontWeight: 700 } }, "Owner"),
            _.input({
              id: "rod-owner",
              value: () => workspace.value.owner,
              onInput: (event) => {
                workspace.value.owner = event.target.value;
              },
              style: {
                width: "100%",
                padding: "10px 12px",
                borderRadius: "12px",
                border: "1px solid var(--cms-border, rgba(0,0,0,.12))",
              },
            }),
            _.div({ style: { fontWeight: 700 } }, "Mode"),
            _.Radio({ model: workspace.value.mode, value: "guided", color: "primary" }, "Guided"),
            _.Radio({ model: workspace.value.mode, value: "advanced", color: "secondary" }, "Advanced"),
            _.div({ style: { fontWeight: 700 } }, "Layer attivi"),
            _.Checkbox({ model: workspace.value.flags.renderer, color: "primary" }, "Renderer"),
            _.Checkbox({ model: workspace.value.flags.reactive, color: "secondary" }, "Reactive"),
            _.Checkbox({ model: workspace.value.flags.ui, color: "info" }, "UI"),
            _.Checkbox({ model: workspace.value.flags.platform, color: "success" }, "Platform"),
          ),
        ),
        _.Card(
          {
            title: "Output",
            subtitle: "Lo stato viene letto senza adattatori extra",
          },
          stack(
            _.div(
              {
                style: {
                  display: "grid",
                  gap: "8px",
                  padding: "14px",
                  borderRadius: "14px",
                  background: "linear-gradient(135deg, rgba(12, 166, 120, .08), rgba(14, 165, 233, .1))",
                },
              },
              _.h3(() => workspace.value.name),
              _.p(() => `Owner: ${workspace.value.owner}`),
              _.p(() => `Mode: ${workspace.value.mode}`),
              _.p(() => `Layer attivi: ${activeFlags().join(", ") || "nessuno"}`),
            ),
            _.pre(
              {
                style: {
                  margin: 0,
                  padding: "12px",
                  borderRadius: "12px",
                  background: "#0f172a",
                  color: "#e2e8f0",
                  overflowX: "auto",
                },
              },
              () => JSON.stringify(workspace.value, null, 2),
            ),
          ),
        ),
      ),
      _.Card(
        {
          title: "Quando usare rod",
          subtitle: "Il caso ideale",
        },
        _.List(
          _.Item("form state e filtri annidati"),
          _.Item("workspace state con flag e preferenze"),
          _.Item("binding veloce ai componenti UI tramite `model`"),
          _.Item("editor dove leggere e scrivere oggetti complessi con poco codice"),
        ),
      ),
      _.Card(
        {
          title: "Snippet",
          subtitle: "Rod + componenti UI",
        },
        codeBlock(sample),
      ),
      deepDiveCard("Demo collegate", [
        { label: "CMS Rod", route: cmswiftDeepDives.rod, tone: "success" },
        { label: "Form", route: cmswiftDeepDives.form, tone: "info" },
      ]),
    ],
  });
});

export { rodBindingPage };
