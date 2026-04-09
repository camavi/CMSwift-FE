const emptyStateDoc = {
  name: "EmptyState",
  title: "EmptyState",
  status: "stable",
  tags: ["zero data", "onboarding", "recovery"],
  summary: "Pattern per pagine, pannelli o sezioni senza dati, risultati o contenuto ancora creato. L'obiettivo non e solo dire che manca qualcosa, ma spiegare perche e cosa fare dopo.",
  signature: "_.EmptyState(props, ...children)",
  quickFacts: [
    { label: "Best for", value: "zero results, first-run setup, empty dashboard, cartelle o board senza contenuto" },
    { label: "Avoid for", value: "errori transitori, warning inline o casi dove esiste ancora contenuto rilevante nella vista" },
    { label: "Mental model", value: "messaggio vuoto con recovery action chiara" }
  ],
  useWhen: [
    { title: "L'utente non ha ancora dati", text: "Primo progetto, prima campagna o sezione appena creata: il pattern spiega cosa succede e come iniziare." },
    { title: "Una ricerca non trova risultati", text: "Message, description e CTA di reset o creazione aiutano a recuperare il flusso." },
    { title: "Vuoi guidare il prossimo passo", text: "Le azioni sono parte del pattern, non un'aggiunta eventuale." }
  ],
  avoidWhen: [
    { title: "Hai un errore tecnico o di rete", text: "Per failure di sistema il linguaggio giusto e piu vicino ad `Alert` o `Banner`." },
    { title: "Esiste ancora contenuto utile", text: "Se la schermata ha comunque dati importanti, un empty state centrale puo sembrare sproporzionato." }
  ],
  essentialProps: [
    { name: "title / message / description", description: "Stack di copy fondamentale: cosa manca, cosa significa e cosa fare." },
    { name: "actions", description: "CTA primaria e secondaria per creare, resettare filtri o aprire docs." },
    { name: "icon / illustration / media", description: "Supporto visuale per dare tono senza trasformare il componente in una hero." },
    { name: "meta", description: "Spazio per chip, filtri attivi o piccolo contesto operativo." },
    { name: "compact / inline", description: "Varianti per pannelli piccoli o sezioni interne, non solo pagine intere." }
  ],
  anatomy: [
    { title: "Visual cue", text: "Icon o illustrazione dichiarano il tono del vuoto e aiutano la scansione." },
    { title: "Explanation", text: "Titolo e messaggio devono chiarire perche la sezione e vuota, non solo constatarlo." },
    { title: "Recovery", text: "Le azioni servono a rimettere l'utente in movimento." }
  ],
  patterns: [
    { title: "Zero results", text: "Message breve, meta con filtri attivi e CTA per reset o modifica filtri.", tags: ["search", "filters"] },
    { title: "First-run onboarding", text: "Titolo aspirazionale, description chiara e CTA di creazione o setup.", tags: ["onboarding", "create"] },
    { title: "Empty panel inline", text: "Versione `compact` o `inline` per card, tab o side panel senza dati.", tags: ["compact", "panel"] }
  ],
  accessibility: [
    { title: "Il vuoto va spiegato, non decorato", text: "Non affidarti solo all'illustrazione: il testo deve restare autosufficiente." }
  ],
  gotchas: [
    { title: "Illustrazione troppo forte", text: "Se l'immagine domina tutto, la CTA e il motivo del vuoto passano in secondo piano." },
    { title: "CTA vaghe", text: "Azioni come `Continua` o `Vai` spiegano poco. Meglio copy diretti come `Crea prima campagna`." }
  ]
};

export default emptyStateDoc;
