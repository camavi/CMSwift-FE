import {
  codeBlock,
  deepDiveCard,
  grid,
  renderCmswiftTutorialPage,
  cmswiftDeepDives,
} from "./cmswift-shared.js";

const patternCard = (title, note, bullets, tone) =>
  _.Card(
    {
      title,
      subtitle: note,
      aside: _.Chip({ color: tone, outline: true, size: "sm" }, tone),
    },
    _.List(...bullets.map((item) => _.Item(item))),
  );

const appPatternsPage = renderCmswiftTutorialPage("patterns", {
  title: "CMSwift App Patterns",
  summary:
    "L'obiettivo finale del tutorial non e imparare API isolate. E arrivare a pattern applicativi reali: dashboard, workspace, form complessi, pagine docs e ambienti operativi costruiti con una base coerente.",
  highlights: [
    ["success", "real world"],
    ["secondary", "repeatable patterns"],
    ["primary", "scale with control"],
  ],
  sections: [
    grid(
      patternCard(
        "Dashboard operativa",
        "Metriche, card, liste e stream eventi",
        [
          "Layout + Header + Card + List",
          "Signal o store per stato live",
          "Renderer semplice per contenuti dinamici",
        ],
        "primary",
      ),
      patternCard(
        "Workspace con filtri",
        "Sidebar, filtri, risultati e drawer",
        [
          "Rod per stato annidato",
          "UI components per form e navigazione",
          "Router per view state e deep link",
        ],
        "secondary",
      ),
      patternCard(
        "Release room / operations",
        "Checklist, timeline, azioni e monitoraggio",
        [
          "Componenti piccoli con cleanup esplicito",
          "Overlay per conferme e focus",
          "Platform modules per request e sincronizzazione",
        ],
        "success",
      ),
    ),
    _.Card(
      {
        title: "Build order consigliato",
        subtitle: "Come costruire una vera app CMSwift senza confondersi",
      },
      _.List(
        _.Item("1. Parti dal renderer e da una struttura HTML minima"),
        _.Item("2. Introduci signal e computed dove serve stato locale"),
        _.Item("3. Passa a rod quando lo stato diventa annidato o molto form-driven"),
        _.Item("4. Componi la UI con Card, List, Page, Layout e Drawer"),
        _.Item("5. Chiudi con router, store, http e overlay per trasformare la pagina in applicazione"),
      ),
    ),
    _.Card(
      {
        title: "Blueprint",
        subtitle: "Scheletro di un'app CMSwift",
      },
      codeBlock([
        "const app = _.component((props, ctx) => {",
        "  const filters = _.rod({ search: '', urgent: true, view: 'board' });",
        "  const stats = _.computed(() => deriveStats(filters.value));",
        "",
        "  return _.Layout({",
        "    header: _.Header({ title: 'Operations room' }),",
        "    aside: _.Drawer({ items: navItems }),",
        "    page: _.Page({ title: 'Dashboard' },",
        "      _.Card({ title: 'Stats' }, _.p(() => JSON.stringify(stats()))),",
        "      _.Card({ title: 'Filters' }, _.Checkbox({ model: filters.value.urgent }, 'Urgent only'))",
        "    )",
        "  });",
        "});",
      ]),
    ),
    deepDiveCard("Route utili per pattern reali", [
      { label: "Layout", route: cmswiftDeepDives.layout, tone: "primary" },
      { label: "Page", route: cmswiftDeepDives.page, tone: "secondary" },
      { label: "Form", route: cmswiftDeepDives.form, tone: "info" },
      { label: "Platform", route: cmswiftDeepDives.platform, tone: "success" },
    ]),
  ],
});

export { appPatternsPage };
