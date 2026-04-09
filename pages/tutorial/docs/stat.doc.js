const statDoc = {
  name: "Stat",
  title: "Stat",
  status: "stable",
  tags: ["metrics", "dashboard", "summary"],
  summary: "Superficie compatta per metriche singole, delta e metadata operative. Serve quando vuoi una lettura rapida e ripetibile in board, dashboard e summary panel.",
  signature: "_.Stat(props, ...children)",
  quickFacts: [
    { label: "Best for", value: "metriche singole, mini-summary, KPI secondari, pannelli stretti in dashboard" },
    { label: "Avoid for", value: "hero metrics narrative o blocchi che chiedono media e CTA forti" },
    { label: "Mental model", value: "metrica compatta con valore principale e delta leggibile a colpo d'occhio" }
  ],
  useWhen: [
    { title: "Ti serve densita alta", text: "Stat funziona bene quando devi mostrare molte metriche senza costruire card complete." },
    { title: "Il delta conta quanto il valore", text: "Valore, trend e note restano nello stesso blocco con una grammatica chiara." },
    { title: "Vuoi comporre righe o grid di metriche", text: "In griglie, toolbar o card dense lo stat regge meglio di una KPI card piena." }
  ],
  avoidWhen: [
    { title: "La metrica ha bisogno di storytelling", text: "Se servono media, hero number e footer piu ricco, `_.Kpi` e il pattern migliore." },
    { title: "Il contenuto principale non e numerico", text: "Per messaggi, empty state o alert operativi usa componenti di feedback." }
  ],
  essentialProps: [
    { name: "label / title", description: "Nome della metrica. Deve essere corto e scannabile." },
    { name: "value", description: "Dato principale. E il punto visivo piu importante del componente." },
    { name: "delta / trend", description: "Scostamento o direzione. Da usare quando la variazione conta davvero." },
    { name: "note / meta", description: "Contesto operativo o badge secondari sotto il valore." },
    { name: "icon / aside / actions", description: "Leve opzionali per scenari un po piu ricchi senza diventare una card." }
  ],
  anatomy: [
    { title: "Head", text: "Label, eyebrow e icon costruiscono il contesto della metrica." },
    { title: "Core", text: "Value e delta restano il focus assoluto." },
    { title: "Support", text: "Note, meta e footer danno ownership, timestamp o micro-contesto." }
  ],
  patterns: [
    { title: "Ops metric tile", text: "Valore grande, delta e nota breve sotto. Pattern ideale per stato ordini, stock o SLA.", tags: ["ops", "dashboard"] },
    { title: "Compact KPI strip", text: "Più Stat in grid o row per confronti rapidi senza peso visivo eccessivo.", tags: ["grid", "summary"] }
  ],
  accessibility: [
    { title: "Label sempre esplicita", text: "Non affidarti solo a icon o colore per spiegare cosa misura il valore." }
  ],
  gotchas: [
    { title: "Delta senza contesto puo essere ambiguo", text: "Se mostri `+18%`, chiarisci sempre rispetto a cosa o almeno in che direzione leggere il dato." },
    { title: "Troppe azioni rompono la densita", text: "Se ti servono CTA vere, forse vuoi una `Kpi` o una `Card`." }
  ]
};

export default statDoc;
