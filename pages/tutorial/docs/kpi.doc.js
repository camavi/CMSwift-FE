const kpiDoc = {
  name: "Kpi",
  title: "Kpi",
  status: "stable",
  tags: ["headline metric", "dashboard", "executive summary"],
  summary: "Superficie per metriche headline, numeri principali e mini dashboard summary. Ha piu presenza di `Stat` e regge bene visuali secondarie, meta e footer operativo.",
  signature: "_.Kpi(props, ...children)",
  quickFacts: [
    { label: "Best for", value: "hero metrics, executive dashboards, scorecard di prodotto, summary panel con numero principale" },
    { label: "Avoid for", value: "metriche dense in grandi volumi o liste di numeri dove basta `_.Stat`" },
    { label: "Mental model", value: "card metrica focalizzata sul numero principale" }
  ],
  useWhen: [
    { title: "Il numero e il protagonista", text: "Kpi da piu peso a value e delta, quindi funziona bene per revenue, conversion, NPS o ordini." },
    { title: "Hai bisogno di un blocco autosufficiente", text: "Meta, media, footer e actions permettono di tenere nello stesso componente lettura e next step." },
    { title: "Vuoi una metrica con piu respiro", text: "Quando `Stat` e troppo denso, `Kpi` ti da un pannello piu narrativo." }
  ],
  avoidWhen: [
    { title: "Stai costruendo una tabella o una riga compatta", text: "Per confronto multiplo e densita alta, `Stat` resta piu efficiente." },
    { title: "Ti serve un contenitore generico", text: "Se il numero non e il fulcro, probabilmente serve una `Card`." }
  ],
  essentialProps: [
    { name: "title / label", description: "Nome della KPI. Deve restare corta e immediata." },
    { name: "value", description: "Numero principale. E il centro visivo del componente." },
    { name: "delta / trend", description: "Variazione o direzione, utile per dare interpretazione al dato." },
    { name: "note / meta / media", description: "Contesto, badge, mini visual o note che aiutano a leggere la KPI." },
    { name: "footer / actions", description: "Quando la KPI deve anche suggerire un follow-up operativo." }
  ],
  anatomy: [
    { title: "Header", text: "Eyebrow, title, icon e aside impostano contesto e ownership." },
    { title: "Core metric", text: "Value e delta sono il focus. Il layout gli da il massimo peso." },
    { title: "Support rails", text: "Note, meta, media e footer tengono il componente utile anche in dashboard ricche." }
  ],
  patterns: [
    { title: "Executive KPI", text: "Numero grande, delta e nota con finestra temporale. Ideale per pannelli di sintesi.", tags: ["executive", "headline"] },
    { title: "Ops summary card", text: "KPI con chips meta, mini chart o body extra per far capire subito priorita e next step.", tags: ["ops", "summary"] }
  ],
  accessibility: [
    { title: "Titolo sempre leggibile", text: "Anche se il numero domina, il titolo deve restare chiaro per screen reader e scansione visuale." }
  ],
  gotchas: [
    { title: "Non caricarla di troppi dettagli", text: "Se media, meta, footer e body competono tutti insieme, il numero perde forza." },
    { title: "Delta senza frame temporale e debole", text: "Quando possibile chiarisci se il confronto e vs ieri, settimana o trimestre." }
  ]
};

export default kpiDoc;
