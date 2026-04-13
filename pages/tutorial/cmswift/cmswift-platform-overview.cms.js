import {
  deepDiveCard,
  grid,
  metricCard,
  quickLink,
  renderCmswiftTutorialPage,
  cmswiftDeepDives,
} from "./cmswift-shared.js";

const platformOverviewPage = renderCmswiftTutorialPage("platform", {
  title: "CMSwift Platform Layer",
  summary:
    "Quando il progetto esce dalla sola UI, CMSwift ti mette a disposizione moduli pubblici per router, store, http, overlay e auth. Il punto non e aggiungere magia, ma completare il framework con strumenti coerenti.",
  highlights: [
    ["info", "router"],
    ["success", "store + http"],
    ["warning", "overlay + auth"],
  ],
  sections: [
    grid(
      metricCard({
        title: "Router",
        value: "view flow",
        note: "route, query, hash, lazy views",
        tone: "primary",
      }),
      metricCard({
        title: "Store",
        value: "shared state",
        note: "persistenza e scope",
        tone: "secondary",
      }),
      metricCard({
        title: "HTTP",
        value: "request layer",
        note: "hook before/after/error",
        tone: "info",
      }),
      metricCard({
        title: "Overlay/Auth",
        value: "runtime UX",
        note: "dialoghi, focus, permessi",
        tone: "success",
      }),
    ),
    _.Card(
      {
        title: "Come usarlo bene",
        subtitle: "Il platform layer non sostituisce l'architettura, la rende piu lineare",
      },
      _.List(
        _.Item("usa il router per orchestrare viste e contesto di pagina"),
        _.Item("usa store e rod per separare stato condiviso e stato locale"),
        _.Item("usa http come boundary esplicito verso il backend"),
        _.Item("usa overlay e auth per casi trasversali che non vuoi ricodificare in ogni pagina"),
      ),
    ),
    deepDiveCard("Approfondimenti platform", [
      { label: "CMS Platform", route: cmswiftDeepDives.platform, tone: "success" },
      { label: "Docs Index", route: cmswiftDeepDives.docs, tone: "info" },
    ]),
    _.Card(
      {
        title: "Jump veloce",
        subtitle: "Route utili da aprire subito",
      },
      _.div(
        { style: { display: "flex", gap: "8px", flexWrap: "wrap" } },
        quickLink("Renderer", cmswiftDeepDives.renderer, "primary"),
        quickLink("Reactive", cmswiftDeepDives.reactive, "warning"),
        quickLink("Rod", cmswiftDeepDives.rod, "secondary"),
        quickLink("Platform", cmswiftDeepDives.platform, "success"),
      ),
    ),
  ],
});

export { platformOverviewPage };
