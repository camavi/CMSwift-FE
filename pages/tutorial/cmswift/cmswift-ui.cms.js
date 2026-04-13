import {
  actions,
  codeBlock,
  deepDiveCard,
  grid,
  renderCmswiftTutorialPage,
  stack,
  cmswiftDeepDives,
} from "./cmswift-shared.js";

const workspaceCard = (title, subtitle, tone, items) =>
  _.Card(
    {
      title,
      subtitle,
      aside: _.Chip({ color: tone, outline: true, size: "sm" }, tone),
    },
    _.List(...items.map((item) => _.Item(item))),
  );

const uiCompositionPage = renderCmswiftTutorialPage("ui", {
  title: "CMSwift UI Composition",
  summary:
    "Il layer UI di CMSwift serve a comporre interfacce vere velocemente. Non sostituisce il renderer: lo estende con componenti riusabili per layout, card, liste, azioni e pagine complesse.",
  highlights: [
    ["primary", "layout ready"],
    ["info", "component composition"],
    ["secondary", "less boilerplate"],
  ],
  sections: [
    grid(
      workspaceCard("Operations", "Vista priorita e task live", "danger", [
        "Ordine #48291 in review",
        "SLA monitor in warning",
        "Escalation pronta per support",
      ]),
      workspaceCard("Content", "Pipeline editoriale", "secondary", [
        "Hero draft pronto",
        "Localizzazione FR da verificare",
        "Publish window alle 17:00",
      ]),
      workspaceCard("QA", "Checklist release", "success", [
        "Smoke test completati",
        "Rollback verificato",
        "Monitoraggio live attivo",
      ]),
    ),
    _.Card(
      {
        title: "Pattern di composizione",
        subtitle: "Come il layer UI accelera il lavoro",
      },
      _.List(
        _.Item("Combina `Card`, `List`, `Chip`, `Btn`, `Page`, `Header`, `Drawer` nello stesso linguaggio"),
        _.Item("Usa componenti piu alti quando il layout cresce, ma resta libero di inserire HTML nativo dove serve"),
        _.Item("La composizione e incrementale: una pagina semplice puo diventare una dashboard senza rifare il renderer"),
      ),
    ),
    _.Card(
      {
        title: "Mini workspace",
        subtitle: "UI components dentro una vista tutoriale",
      },
      stack(
        actions(
          _.Btn({ size: "sm", outline: true }, "Nuovo report"),
          _.Btn({ size: "sm", color: "primary" }, "Condividi"),
          _.Btn({ size: "sm", color: "secondary" }, "Apri backlog"),
        ),
        _.div(
          {
            style: {
              display: "grid",
              gap: "12px",
              gridTemplateColumns: "1.2fr .8fr",
            },
          },
          _.Card(
            {
              title: "Main workspace",
              subtitle: "Layout applicativo composto da componenti semplici",
            },
            _.p(
              "Questa card rappresenta il blocco principale di una pagina applicativa. In CMSwift puoi portare lo stesso approccio dentro `Layout`, `Page` o `AppShell` quando la vista cresce.",
            ),
          ),
          _.Card(
            {
              title: "Aside",
              subtitle: "Azioni e stato rapido",
            },
            _.List(
              _.Item("3 issue aperte"),
              _.Item("2 revisioni pending"),
              _.Item("1 release live"),
            ),
          ),
        ),
      ),
    ),
    _.Card(
      {
        title: "Snippet",
        subtitle: "UI composition nel punto giusto",
      },
      codeBlock([
        "_.Layout({",
        "  header: _.Header({ title: 'Workspace' }),",
        "  aside: _.Drawer({ items: navItems }),",
        "  page: _.Page({ title: 'Operations' },",
        "    _.Card({ title: 'Summary' }, _.List(...items)),",
        "    _.Card({ title: 'Actions' }, _.Btn('Nuovo task'))",
        "  )",
        "});",
      ]),
    ),
    deepDiveCard("Demo collegate", [
      { label: "Layout", route: cmswiftDeepDives.layout, tone: "primary" },
      { label: "Page", route: cmswiftDeepDives.page, tone: "secondary" },
      { label: "Drawer", route: cmswiftDeepDives.drawer, tone: "info" },
    ]),
  ],
});

export { uiCompositionPage };
