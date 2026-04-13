import {
  actions,
  codeBlock,
  deepDiveCard,
  grid,
  metricCard,
  renderCmswiftTutorialPage,
  stack,
  cmswiftDeepDives,
} from "./cmswift-shared.js";

const cmswiftTutorialIntro = _.component((props, ctx) => {
  const [getProjectName, setProjectName] = _.signal("CMSwift tutorial");
  const [getAudience, setAudience] = _.signal("Frontend team");
  const [getStage, setStage] = _.signal("overview");

  const pillars = _.rod({
    renderer: true,
    reactive: true,
    ui: true,
    platform: false,
  });

  const activePillars = _.computed(() => {
    const out = [];
    if (pillars.value.renderer) out.push("Renderer");
    if (pillars.value.reactive) out.push("Reactive");
    if (pillars.value.ui) out.push("UI");
    if (pillars.value.platform) out.push("Platform");
    return out;
  });

  const stageTone = _.computed(() => {
    const stage = getStage();
    if (stage === "overview") return "primary";
    if (stage === "build") return "secondary";
    return "success";
  });

  const frameworkPitch = _.computed(() => {
    return `${getProjectName()} per ${getAudience()} con ${activePillars().length} layer attivi.`;
  });

  ctx.onDispose(() => {
    activePillars.dispose?.();
    stageTone.dispose?.();
    frameworkPitch.dispose?.();
  });

  const introSample = [
    'const [getProjectName, setProjectName] = _.signal("CMSwift tutorial");',
    'const pillars = _.rod({ renderer: true, reactive: true, ui: true, platform: false });',
    "",
    "const activePillars = _.computed(() => {",
    "  const out = [];",
    '  if (pillars.value.renderer) out.push("Renderer");',
    '  if (pillars.value.reactive) out.push("Reactive");',
    '  if (pillars.value.ui) out.push("UI");',
    '  if (pillars.value.platform) out.push("Platform");',
    "  return out;",
    "});",
    "",
    '_.Card({ title: "Framework state" },',
    "  _.p(() => getProjectName()),",
    '  _.div(() => activePillars().join(" • "))',
    ");",
  ];

  return renderCmswiftTutorialPage("intro", {
    title: "CMSwift Overview",
    summary:
      "Questa e la porta d'ingresso del tutorial CMSwift. Qui il framework viene letto come sistema: renderer dichiarativo, core reattivo, binding ad alto livello, componenti, UI e moduli platform dentro la stessa API pubblica.",
    highlights: [
      ["primary", "framework overview"],
      ["secondary", "reactive + UI"],
      ["success", "independent tutorial"],
    ],
    sections: [
      grid(
      _.Card(
        { title: "Renderer dichiarativo" },
        _.p(
          "Scrivi HTML, SVG e componenti custom con la stessa sintassi `_.…`, senza cambiare mental model tra markup nativo e UI astratta.",
        ),
      ),
      _.Card(
        { title: "Reactive core" },
        _.p(
          "`_.signal`, `_.computed`, `_.effect`, `_.untracked` e `_.batch` permettono di costruire stato leggibile, derivazioni e side effect controllati.",
        ),
      ),
      _.Card(
        { title: "UI layer" },
        _.p(
          "Il layer UI si appoggia allo stesso core e permette di passare da markup semplice a layout applicativi complessi senza boilerplate inutile.",
        ),
      ),
      _.Card(
        { title: "Platform modules" },
        _.p(
          "Router, store, http, overlay e auth restano accessibili dal layer pubblico e completano il framework per casi reali, non solo demo isolate.",
        ),
      ),
      ),
      grid(
        metricCard({
          title: "Un solo linguaggio",
          value: "HTML + state + UI",
          note: "stessa superficie pubblica",
          tone: "primary",
        }),
        metricCard({
          title: "Scala bene",
          value: "dal tag al workspace",
          note: "piccolo nel semplice, compositivo nel complesso",
          tone: "secondary",
        }),
        metricCard({
          title: "Core separato",
          value: "tutorial indipendente",
          note: "nessuna modifica a cms.js o ui.js",
          tone: "success",
        }),
      ),
      grid(
      _.Card(
        {
          title: "Configura la demo",
          subtitle: "Stato locale con API pubbliche",
        },
        stack(
          _.label(
            { for: "cmswift-project-name", style: { fontWeight: 700 } },
            "Nome progetto",
          ),
          _.input({
            id: "cmswift-project-name",
            type: "text",
            value: () => getProjectName(),
            onInput: (event) => setProjectName(event.target.value),
            style: {
              width: "100%",
              padding: "10px 12px",
              borderRadius: "12px",
              border: "1px solid var(--cms-border, rgba(0,0,0,.12))",
            },
          }),
          _.label(
            { for: "cmswift-audience", style: { fontWeight: 700 } },
            "Audience",
          ),
          _.input({
            id: "cmswift-audience",
            type: "text",
            value: () => getAudience(),
            onInput: (event) => setAudience(event.target.value),
            style: {
              width: "100%",
              padding: "10px 12px",
              borderRadius: "12px",
              border: "1px solid var(--cms-border, rgba(0,0,0,.12))",
            },
          }),
          actions(
            _.Btn(
              {
                size: "sm",
                color: () => (getStage() === "overview" ? "primary" : null),
                outline: () => getStage() !== "overview",
                onClick: () => setStage("overview"),
              },
              "Overview",
            ),
            _.Btn(
              {
                size: "sm",
                color: () => (getStage() === "build" ? "secondary" : null),
                outline: () => getStage() !== "build",
                onClick: () => setStage("build"),
              },
              "Build",
            ),
            _.Btn(
              {
                size: "sm",
                color: () => (getStage() === "ship" ? "success" : null),
                outline: () => getStage() !== "ship",
                onClick: () => setStage("ship"),
              },
              "Ship",
            ),
          ),
          _.div({ style: { fontWeight: 700, marginTop: "4px" } }, "Layer attivi"),
          _.Checkbox({ model: pillars.value.renderer, color: "primary" }, "Renderer"),
          _.Checkbox({ model: pillars.value.reactive, color: "secondary" }, "Reactive"),
          _.Checkbox({ model: pillars.value.ui, color: "info" }, "UI"),
          _.Checkbox({ model: pillars.value.platform, color: "success" }, "Platform"),
        ),
      ),
      _.Card(
        {
          title: "Risultato",
          subtitle: "Lo stesso stato alimenta markup, chip e summary",
          aside: _.Chip(
            { color: () => stageTone(), outline: true, size: "sm" },
            () => getStage(),
          ),
        },
        stack(
          _.section(
            {
              style: {
                display: "grid",
                gap: "8px",
                padding: "14px",
                borderRadius: "14px",
                background: "linear-gradient(135deg, rgba(18, 94, 255, .08), rgba(90, 209, 255, .12))",
              },
            },
            _.small("Markup nativo con stato reattivo"),
            _.h3(() => getProjectName()),
            _.p(() => frameworkPitch()),
          ),
          _.div(
            { style: { display: "flex", gap: "8px", flexWrap: "wrap" } },
            _.Chip({ color: () => stageTone() }, () => getStage()),
            _.Chip(
              {
                outline: () => !pillars.value.renderer,
                color: () => (pillars.value.renderer ? "primary" : null),
              },
              "Renderer",
            ),
            _.Chip(
              {
                outline: () => !pillars.value.reactive,
                color: () => (pillars.value.reactive ? "secondary" : null),
              },
              "Reactive",
            ),
            _.Chip(
              {
                outline: () => !pillars.value.ui,
                color: () => (pillars.value.ui ? "info" : null),
              },
              "UI",
            ),
            _.Chip(
              {
                outline: () => !pillars.value.platform,
                color: () => (pillars.value.platform ? "success" : null),
              },
              "Platform",
            ),
          ),
          _.List(
            _.Item(() => `Project: ${getProjectName()}`),
            _.Item(() => `Audience: ${getAudience()}`),
            _.Item(() => `Layer attivi: ${activePillars().join(", ") || "nessuno"}`),
            _.Item(
              () =>
                `Messaggio guida: CMSwift puo partire piccolo e diventare applicativo senza cambiare paradigma.`,
            ),
        ),
        ),
      ),
      ),
      _.Card(
        {
          title: "API pubblica mostrata in questa pagina",
          subtitle: "HTML helper + signal + rod + computed",
        },
        codeBlock(introSample),
      ),
      _.Card(
        {
          title: "Roadmap del tutorial",
          subtitle: "Le sezioni che ora compongono il percorso completo",
        },
        _.List(
          _.Item("Architecture"),
          _.Item("Renderer"),
          _.Item("Reactive Core"),
          _.Item("Rod Binding"),
          _.Item("Components & Lifecycle"),
          _.Item("UI Composition"),
          _.Item("Platform"),
          _.Item("App Patterns"),
        ),
      ),
      deepDiveCard("Route collegate", [
        { label: "Architecture", route: "/demo/component/cmswift-architecture", tone: "secondary" },
        { label: "Renderer", route: "/demo/component/cmswift-renderer", tone: "info" },
        { label: "Reactive", route: "/demo/component/cmswift-reactive", tone: "warning" },
        { label: "Rod", route: "/demo/component/cmswift-rod", tone: "success" },
        { label: "Legacy Demos", route: cmswiftDeepDives.docs, tone: "primary" },
      ]),
    ],
  });
});

export { cmswiftTutorialIntro };
