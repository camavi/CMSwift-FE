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

const architectureSample = [
  "const app = _.component((props, ctx) => {",
  "  const state = _.rod({ filters: { urgent: true }, view: 'overview' });",
  "",
  "  return _.Layout({",
  "    header: _.Header({ title: 'Workspace' }),",
  "    aside: _.Drawer({ items: [...] }),",
  "    page: _.Page({ title: 'Dashboard' },",
  "      _.Card({ title: 'Summary' }, _.p(() => state.value.view)),",
  "      _.List(_.Item('Renderer + reactive + UI + platform'))",
  "    )",
  "  });",
  "});",
];

const architectureLayers = grid(
  _.Card(
    { title: "1. Renderer" },
    _.p("Base dichiarativa: helper HTML, SVG, props, style, eventi e children dinamici."),
  ),
  _.Card(
    { title: "2. Reactive Core" },
    _.p("Signal, computed, effect e batch forniscono il motore di stato e derivazione."),
  ),
  _.Card(
    { title: "3. UI Layer" },
    _.p("Componenti compositivi che riusano renderer e reattivita senza cambiare sintassi."),
  ),
  _.Card(
    { title: "4. Platform" },
    _.p("Router, store, http, overlay e auth completano il framework per applicazioni vere."),
  ),
);

const architectureFlow = _.Card(
  {
    title: "Come leggere CMSwift",
    subtitle: "Dal basso verso l'alto",
  },
  _.List(
    _.Item("Renderer: come nasce il DOM"),
    _.Item("Reactive core: come nasce il dato vivo"),
    _.Item("Rod e componenti: come colleghi stato e UI"),
    _.Item("UI layer: come comporre interfacce mantenibili"),
    _.Item("Platform: come chiudi il cerchio applicativo"),
  ),
);

const architecturePage = renderCmswiftTutorialPage("architecture", {
  title: "CMSwift Architecture",
  summary:
    "CMSwift non va letto come una libreria di widget. Va letto come una pila coerente: renderer, core reattivo, binding, componenti, UI e moduli platform costruiti per convivere nella stessa API pubblica.",
  highlights: [
    ["secondary", "renderer first"],
    ["info", "reactive core"],
    ["success", "application ready"],
  ],
  sections: [
    grid(
      metricCard({
        title: "Mental model",
        value: "1 API",
        note: "stessa sintassi dal tag al layout",
        tone: "primary",
      }),
      metricCard({
        title: "Growth path",
        value: "simple → app",
        note: "senza cambiare paradigma",
        tone: "secondary",
      }),
      metricCard({
        title: "Goal",
        value: "coerenza",
        note: "meno attrito tra livelli diversi",
        tone: "success",
      }),
    ),
    architectureLayers,
    architectureFlow,
    _.Card(
      {
        title: "Schema di composizione",
        subtitle: "Un esempio di come i layer si incontrano nella pratica",
      },
      codeBlock(architectureSample),
    ),
    _.Card(
      {
        title: "Principio chiave",
        subtitle: "Perche questo approccio conta",
      },
      stack(
        _.p(
          "Il vantaggio vero di CMSwift e che non devi cambiare linguaggio mentale quando passi da markup nativo, stato, componenti o moduli applicativi.",
        ),
        _.p(
          "Questa continuita riduce boilerplate, aiuta manutenzione e rende piu facile far crescere una pagina in un workspace vero senza refactor traumatici.",
        ),
      ),
    ),
    deepDiveCard("Approfondimenti collegati", [
      { label: "HTML Helpers", route: cmswiftDeepDives.html, tone: "primary" },
      { label: "Renderer Demo", route: cmswiftDeepDives.renderer, tone: "info" },
      { label: "Reactive Demo", route: cmswiftDeepDives.reactive, tone: "warning" },
      { label: "Platform Demo", route: cmswiftDeepDives.platform, tone: "success" },
    ]),
  ],
});

export { architecturePage };
