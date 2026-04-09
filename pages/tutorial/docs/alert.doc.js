const alertDoc = {
  name: "Alert",
  title: "Alert",
  status: "stable",
  tags: ["feedback", "inline", "persistent"],
  summary: "Blocco compatto per warning, note operative e feedback persistente dentro page, card e pannelli. Sta tra `Banner` e testo helper: piu strutturato del secondo, meno editoriale del primo.",
  signature: "_.Alert(props, ...children)",
  quickFacts: [
    { label: "Best for", value: "warning inline, policy note, validation summary, feedback persistente vicino al contenuto" },
    { label: "Avoid for", value: "toast temporanei, messaging ricco o note che meritano un Banner completo" },
    { label: "Mental model", value: "alert compatto con tono, copy principale e CTA veloci" }
  ],
  useWhen: [
    { title: "Vuoi tenere il feedback dentro il flusso", text: "Usalo quando il messaggio deve stare attaccato a form, card o sezioni di pagina, non in overlay." },
    { title: "Serve una gerarchia chiara ma leggera", text: "Title, message, description e meta tengono ordine senza introdurre la grammatica piu corposa di `Banner`." },
    { title: "Hai CTA piccole e contestuali", text: "Le azioni possono restare vicine al messaggio, per esempio retry, review, apri dettagli." }
  ],
  avoidWhen: [
    { title: "Il messaggio deve sparire da solo", text: "Per feedback breve e transient usa `_.Notify`." },
    { title: "Hai molto contenuto o piu zone visuali", text: "Se il blocco diventa editoriale o corposo, `_.Banner` regge meglio." },
    { title: "Stai costruendo un empty state", text: "Per zero-data, onboarding o empty workspace il pattern giusto e `_.EmptyState`." }
  ],
  essentialProps: [
    { name: "type / state", description: "Definisce tono, colore e icona automatica. E la prima leva da impostare.", tags: ["success", "warning", "danger", "info", "primary", "secondary"] },
    { name: "title / message / description", description: "Stack di copy consigliato: headline breve, messaggio operativo, contesto secondario." },
    { name: "actions / aside", description: "CTA e contenuti laterali leggeri, utili per retry o badge di ownership." },
    { name: "dismissible / onDismiss", description: "Per messaggi che l'utente puo chiudere localmente o in modo persistente." },
    { name: "slots", description: "Override puntuali di icon, title, message, description, meta, actions, aside e dismiss." }
  ],
  anatomy: [
    { title: "Tone rail", text: "Il colore e l'icona dichiarano subito il livello del feedback." },
    { title: "Copy stack", text: "Title e message restano il cuore dell'alert; description e meta vanno usati solo quando aggiungono contesto." },
    { title: "Quick action zone", text: "La zona laterale serve per CTA minime o dismiss, non per toolbar intere." }
  ],
  slots: [
    { title: "`icon`", text: "Per sostituire l'icona automatica con avatar, badge o simboli di dominio." },
    { title: "`actions` e `aside`", text: "Per aggiungere CTA o meta laterali senza rompere il layout compatto." },
    { title: "`dismiss`", text: "Quando vuoi un close control custom ma restare dentro il contratto dell'alert." }
  ],
  patterns: [
    { title: "Validation / review summary", text: "Warning o danger con titolo corto, messaggio concreto e una CTA di recupero.", tags: ["forms", "review"] },
    { title: "Policy note persistente", text: "Info o secondary con meta e dismiss, utile per note di rollout o regole aggiornate.", tags: ["policy", "inline"] },
    { title: "Retry action inline", text: "Alert con una sola azione primaria vicino al contenuto che ha fallito.", tags: ["ops", "retry"] }
  ],
  accessibility: [
    { title: "Ruolo ARIA coerente", text: "Warning e danger vanno su `alert`, gli altri toni su `status`." },
    { title: "Dismiss leggibile", text: "Se il close e custom, mantieni sempre un'etichetta o un controllo chiaro." }
  ],
  gotchas: [
    { title: "Non trasformarlo in un mini layout", text: "Se inizi a metterci troppi blocchi, liste o toolbar, il componente sta gia chiedendo un altro pattern." },
    { title: "Troppe CTA abbassano la priorita", text: "Un alert regge meglio una o due azioni, non una action bar completa." }
  ]
};

export default alertDoc;
