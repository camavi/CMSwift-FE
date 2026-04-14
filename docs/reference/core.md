# CMSwift Core

Documento operativo del core `CMSwift`.

Scopo:
- tenere una roadmap tecnica chiara del framework
- documentare i moduli core e i loro limiti attuali
- aggiornare passo passo ogni intervento strutturale sul core in `packages/core/src`

Regola di aggiornamento:
- quando cambia un modulo core, aggiornare questo file
- quando cambia la superficie macchina utile ad AI/devtools, aggiornare anche `CMSwift.meta` dentro `packages/core/src/00-bootstrap.js`
- `npm run build:cms` genera `packages/core/dist/cms.js` e `packages/core/dist/min-cms.js`
- `npm run build:ui` genera `packages/ui/dist/ui.js` e `packages/ui/dist/min-ui.js`
- `pages/_cmswift-fe/js/*` resta un mirror locale compatibile

## Priorita attuali

Stato generale oggi:
- renderer: milestone 3 chiusa
- reactive core: milestone 2 chiusa
- rod: milestone 2 chiusa
- lifecycle / mount / cleanup: milestone 2 chiusa
- moduli platform: milestone 2 chiusa
- test automatici core: prima base attiva con `node:test`

Stato del ciclo corrente:
- ciclo tecnico corrente chiuso
- il core ha demo browser, meta, documentazione e test automatici allineati
- i form controls principali e i casi rari gia trattati nel renderer sono coperti
- il prossimo passo non e tecnico ma organizzativo: creare un checkpoint/commit e aprire il ciclo successivo solo quando c'e una nuova priorita chiara
- la checklist operativa per una possibile `v1` e in `docs/release/release-plan-v1.md`

1. Renderer DOM e bridge props
- file: `packages/core/dist/cms.js`
- area: `createElement`, `setProp`, `bindProp`, gestione `style`, attributi, eventi, children
- motivo: ogni bug qui impatta tutto il framework
- obiettivo: rendere prevedibile la traduzione `props -> DOM` e coprire gli edge case con test
- stato: milestone 3 chiusa, con mini-terzo-giro e micro-giro avanzato chiusi su style, eventi, children e props/attr speciali

2. Reactive core
- area: `CMSwift.reactive.signal` e `CMSwift.reactive.effect`
- motivo: oggi il core e minimale e manca una semantica forte su dispose, scheduling e loop safety
- obiettivo: definire invarianti chiare del modello reattivo
- stato: milestone 2 chiusa, con `batch(...)`, flush opzionale `microtask` e copertura automatica dedicata

3. Rod
- area: `_.rod`, `CMSwift.rodBind`, `CMSwift.rodModel`, interpolation buffer
- motivo: e potente ma ha una superficie API ampia e in parte sovrapposta al reactive core
- obiettivo: chiarire il ruolo di `rod` e allinearlo meglio al resto del sistema
- stato: milestone 2 chiusa, con bridge DOM condiviso, key speciali riallineati e copertura automatica del primo giro

4. Lifecycle, mount e cleanup
- area: `CMSwift.mount`, `CMSwift.component`, cleanup registry, auto cleanup
- motivo: e la zona dove possono nascere leak, listener duplicati e componenti non smontati bene
- obiettivo: definire il lifecycle e rendere affidabile unmount/cleanup
- stato: milestone 2 chiusa, con helper interni estratti e copertura automatica del primo giro

5. Moduli platform nel core
- area: overlay, store, auth, http, router, `CMSwift.ui.meta`
- motivo: sono utili, ma oggi vivono tutti nello stesso file con responsabilita molto ampie
- obiettivo: modularita interna migliore, documentazione per modulo e confini piu chiari
- stato: milestone 2 chiusa, con helper interni estratti modulo per modulo e copertura automatica invariata

## Stato iniziale

Osservazioni emerse durante il lavoro sulla UI:
- il renderer aveva un bug reale sulle CSS custom properties `--*`
- il valore arrivava nei props, ma non veniva sempre applicato al DOM reale
- la fix corretta e globale e stata fatta in `cms.js` usando `style.setProperty(...)` quando la chiave style e una custom property o una CSS property con trattino

Implicazioni:
- il renderer va trattato come priorita assoluta
- prima di aggiungere troppe feature UI, conviene blindare il core

## Strategia di lavoro

Fase 1: Renderer
- mappare i casi supportati di `class`, `style`, attributi DOM, property DOM, eventi e children
- definire comportamento atteso
- aggiungere casi demo o test minimi per evitare regressioni

Stato:
- milestone 1 completata a livello funzionale
- milestone 2 chiusa sul piano strutturale: bridge DOM condiviso, helper estratti e parsing finale separato
- milestone 3 chiusa sul piano qualitativo: il mini-terzo-giro ha chiuso il cleanup di `style`, `eventi` e `children` dinamici
- nel terzo giro il blocco eventi del renderer dispone ora davvero gli `effect` dei listener dinamici quando il nodo viene smontato
- nel terzo giro anche i `children` dinamici puliscono il subtree precedente e dispongono i relativi cleanup/effect quando fanno replace
- chiuso anche un micro-giro avanzato del renderer su composizione eventi, `children` con `rod` annidati e key speciali `attr:`, `@`, `style.*`, path annidati e semantica `aria-*`

## Renderer: contratto attuale

Area:
- `createElement`
- `setProp`
- `bindProp`
- interpolazione testo
- append dei children

### Cosa supporta oggi

Props:
- `class` come stringa, array annidati o object-map, applicata via attributo `class`
- `style` come oggetto
- style normale applicato via `el.style[name]`
- CSS custom properties e property con trattino applicate via `el.style.setProperty(...)`
- eventi `onClick`, `onInput`, `on:custom-event`
- content props: `innerHTML`, `innerText`, `textContent`, `value`
- property DOM diretta se `key in el`
- fallback ad attributo DOM con `setAttribute`
- props reattive via function
- props reattive via `rod`

Semantica base dei valori props:
- `null` e `undefined` rimuovono l'attributo o resettano la property quando applicabile
- `false` rimuove gli attributi normali e spegne le boolean DOM props
- `true` abilita le boolean DOM props; sugli attributi non booleani resta serializzato come attributo
- `class: null|false|""` rimuove la classe
- `style: null|false` rimuove l'attributo `style`

Semantica `class`:
- stringa: `"a b"`
- array: `["a", cond && "b", ["c"]]`
- object-map: `{ active: true, disabled: false }`
- nei valori di array e object-map sono supportati anche `function` e `rod`

Semantica eventi:
- `onClick: fn` per handler statico
- `onClick: rod(fn|null)` per attach/detach dinamico
- `onClick: { handler, options }` per usare `addEventListener` con options
- `onClick: [fnA, { handler: fnB, options: { once: true } }]` per comporre piu listener nello stesso prop
- `on:custom-event` per eventi custom senza normalizzazione automatica del nome
- `options` supporta `once`, `capture`, `passive`
- sugli attributi `aria-*`, il valore booleano `false` viene serializzato come `"false"`; `null` invece rimuove l'attributo

Children:
- stringhe e numeri
- array annidati
- nodi DOM
- `rod` come testo reattivo
- string interpolation agganciata ai `rod`
- function child reattivo

### Correzione fatta in questo step

Renderer child function:
- prima una function child veniva sempre trattata come testo e scritta in `textContent`
- ora una function child puo restituire:
  - string
  - number
  - DOM node
  - array di valori/nodi
  - `null` o `false`
- il renderer sostituisce correttamente i nodi precedenti usando un anchor comment interno

Questo rende piu robusti i casi tipo:
- `_.div(() => condition ? _.span("A") : _.b("B"))`
- `_.div(() => items.map(...))`

Semantica di rimozione props:
- introdotta una distinzione esplicita tra:
  - boolean DOM props
  - attributi puri (`data-*`, `aria-*`, SVG, custom attr)
  - property DOM normali
- `setProp` ora rimuove o resetta in modo coerente i casi `null`, `undefined` e `false`
- le boolean DOM props vengono sincronizzate anche come presenza/assenza di attributo

Semantica `class`:
- `normalizeClass` ora appiattisce array annidati e object-map
- rimuove token vuoti o falsy
- deduplica i token finali
- `bindProp("class", ...)` osserva anche valori dinamici interni in array/object-map

Semantica eventi:
- gli eventi passano ora da `bindProp`, non da un ramo separato nel parser props
- listener statici e dinamici usano un wrapper stabile per poter aggiornare il callback senza accumulare listener
- `null` e `false` rimuovono il listener
- i listener vengono registrati anche nella cleanup registry del nodo
- `once` aggiorna anche lo stato interno del wrapper, cosi il listener non resta marcato come attivo dopo l'auto-rimozione del browser

### Limiti attuali confermati

- gli eventi non hanno ancora delegation o diff avanzato di listener multipli
- il renderer non ha ancora una suite di test automatica dedicata

### Step successivi del renderer

1. Formalizzare la semantica di rimozione props
- distinguere property DOM, attributi standard, `data-*`, `aria-*`, SVG

1.1 Stato
- prima base implementata
- da verificare con casi reali e test minimi su input, select, aria/data e SVG

2. Semantica di `class`
- prima base implementata: string, array, object-map e valori dinamici interni
- da verificare con casi reali su merge, deduplica e token condizionali

3. Semantica eventi
- prima base implementata: statici, dinamici via rod, custom event e cleanup registry
- supportate anche le options native `once`, `capture`, `passive`
- da verificare sui casi con nodi smontati

4. Coprire i casi con test/demo minimi
- `style` custom properties
- boolean attr/property
- event attach/detach/update
- props reattive function
- props reattive `rod`
- child reattivi testo/nodo/array

## Verifica browser renderer

Pagina demo:
- route: `/demo/component/cms-renderer`
- file: `cmswift-site/pages/tutorial/cms-renderer.cms.js`
- route: `/demo/component/cms-renderer-style`
- file: `cmswift-site/pages/tutorial/cms-renderer-style.cms.js`

Nota:
- i file demo qui referenziati appartengono al repo docs/tutorial esterno `cmswift-site`, non a questo repository framework

Checklist manuale:
- input: `disabled`, `required`, `readOnly`, `placeholder`, `aria-invalid`, `data-empty`
- select: `value`, `disabled`, `required`, `data-mode`
- class: string, array, object-map e toggle reattivi
- eventi: attach, detach, switch handler e custom event `on:...`
- eventi options: `once`, `capture`, `passive`
- aria/data: presenza e rimozione reale degli attributi
- svg: attributi `aria-*`, `data-*` e contenuto testuale dinamico
- dynamic children: ritorno di nodo singolo, array e `null`
- dynamic style object cleanup: quando la shape cambia, le chiavi stale devono sparire davvero dal `style` del nodo

Fase 2: Reactive
- documentare il contratto di `signal/effect`
- decidere come gestire dispose, nested effect, scheduling e loop protection

## Reactive Core: contratto iniziale

Area:
- `CMSwift.reactive.signal`
- `CMSwift.reactive.effect`
- `CMSwift.reactive.computed`
- `CMSwift.reactive.untracked`
- `CMSwift.reactive.batch`

Alias pubblici:
- `_.signal` / `CMSwift.signal`
- `_.effect` / `CMSwift.effect`
- `_.computed` / `CMSwift.computed`
- `_.untracked` / `CMSwift.untracked`
- `_.batch` / `CMSwift.batch`

### Cosa supporta ora

- `signal(initial)` restituisce `[get, set, dispose]`
- `effect(fn)` esegue subito l'effetto e restituisce una funzione di dispose
- `computed(fn)` restituisce un getter derivato con `dispose()`
- `untracked(fn)` esegue una lettura senza registrare dipendenze reattive
- `batch(fn, { flush })` raggruppa scritture sincrone e flush dei subscriber in sync o nel microtask successivo
- dependency tracking tra `signal.get()` e `effect(...)`
- cleanup delle dipendenze a ogni riesecuzione
- cleanup esplicito dell'effect quando viene dismesso
- nested effect con stack corretto invece di un solo `CURRENT_EFFECT`
- protezione base contro loop sincroni dello stesso effect

### Semantica effect

- `effect(fn)`:
  - esegue subito `fn`
  - riesegue `fn` quando cambia un signal letto durante l'ultima esecuzione
  - restituisce `dispose()`
- `fn` puo registrare cleanup in due modi:
  - ritornando una function
  - ricevendo `onCleanup` come primo argomento

Esempio:
- `CMSwift.reactive.effect((onCleanup) => { ...; onCleanup(() => ...); })`
- `CMSwift.reactive.effect(() => { ...; return () => ...; })`

### Semantica computed

- `computed(fn)`:
  - esegue `fn` in un effect interno
  - memorizza il valore derivato in un signal interno
  - restituisce un getter leggibile come function
  - espone `dispose()`

Esempio:
- `const fullName = CMSwift.reactive.computed(() => first() + " " + last());`
- `_.div(() => fullName())`
- `fullName.dispose()`

Shortcut equivalente:
- `const fullName = _.computed(() => first() + " " + last());`

### Semantica untracked

- `untracked(fn)`:
  - esegue `fn`
  - sospende temporaneamente la raccolta delle dipendenze
  - restituisce il valore ritornato da `fn`

Esempio:
- `CMSwift.reactive.effect(() => {`
- `  const tracked = count();`
- `  const snapshot = _.untracked(() => expensiveDebugState());`
- `});`

### Semantica batch

- `batch(fn)`:
  - esegue `fn` subito
  - accoda i rerun degli effect mentre il batch e aperto
  - flush dei runner una sola volta quando termina il batch piu esterno
  - supporta batch annidati
  - `options.flush` supporta:
    - `sync` default
    - `microtask` per posticipare il flush al microtask successivo

Esempio:
- `_.batch(() => {`
- `  setCount(2);`
- `  setStep(4);`
- `});`
- `_.batch(() => { setCount(2); setStep(4); }, { flush: "microtask" });`

### Correzione fatta in questo step

- prima il core reattivo usava un solo `CURRENT_EFFECT`
- questo rendeva fragili i nested effect
- non c'era cleanup delle dipendenze
- non c'era dispose nativo dell'effect

Adesso:
- gli effect hanno un record interno con deps e cleanup
- i `signal` tengono un set di runner, non solo la function grezza
- al rerun vengono pulite le vecchie dipendenze prima di raccogliere le nuove
- `signal.set(...)` notifica su snapshot del set per evitare problemi durante mutazioni del set stesso
- `computed` e ora una primitive ufficiale del core, e `store.computed` delega a questa implementazione
- `untracked` e ora disponibile come primitive ufficiale del core e come alias pubblico `_.untracked`
- se un effect si riattiva sincronicamente mentre e in esecuzione, il rerun viene accodato e non eseguito ricorsivamente nello stack corrente
- se lo stesso effect supera la soglia di rerun sincroni consecutivi, il core interrompe il ciclo e logga un warning
- `batch` e ora disponibile come primitive ufficiale del core e come alias pubblico `_.batch`
- `signal.set(...)` durante un batch non flush-a subito tutti i subscriber: i runner vengono raccolti e scaricati a fine batch esterno
- il flush del batch puo essere opzionalmente rimandato al microtask successivo con `flush: "microtask"`

### Limiti attuali del reactive core

 - manca scheduling configurabile oltre al flush `sync`/`microtask` del batch
- la protezione loop e di primo livello: copre il loop sincrono di un effect, non ancora i cicli complessi tra effect multipli
- manca ancora una semantica piu ricca per transazioni asincrone o priorita di flush

## Rod: contratto iniziale

Area:
- `_.rod`
- `CMSwift.rodBind`
- `CMSwift.rodFromSignal`
- `CMSwift.rodModel`
- `rodApplyBinding`

### Cosa supporta ora

- `_.rod(initial)` crea un contenitore reattivo con `.value`
- binding diretto su DOM node e text node tramite `CMSwift.rodBind(...)`
- bridge `signal <-> rod` tramite `CMSwift.rodFromSignal(...)`
- two-way model su input/select/radio/checkbox con `CMSwift.rodModel(...)`
- interpolazione testo quando un rod viene convertito a stringa
- notify batchato via microtask

### Correzione fatta in questo step

Cleanup:
- quando un rod usa un signal interno tramite `rodMakeReactive`, il dispose del signal viene ora agganciato al dispose del rod
- `rodFromSignal(...)` registra ora anche il dispose dell'effect interno che sincronizza `signal -> rod`

Binding DOM:
- `rodApplyBinding(...)` e stato riallineato alla semantica del renderer per:
  - `class`
  - attributi `attr:` e `@`
  - `style.*`, incluse CSS custom properties e property con trattino
  - boolean DOM props
  - rimozione di `null` e `false`

Stato:
- milestone 1 chiusa a livello funzionale
- demo browser dedicata aggiunta e verificata

### Limiti attuali del blocco rod

- il rapporto concettuale tra `rod` e `CMSwift.reactive` va ancora chiarito meglio
- `rodApplyBinding(...)` ha ancora una sua logica dedicata invece di condividere davvero il bridge del renderer
- manca una suite di test automatica dedicata

## Verifica browser blocco rod

Pagina demo:
- route: `/demo/component/cms-rod`
- file: `cmswift-site/pages/tutorial/cms-rod.cms.js`

Checklist manuale:
- `_.rod`: `.value` e `.action(...)` reagiscono agli update
- `rodBind`: testo, classi e attributi seguono il valore del rod
- `rodModel`: input e select restano sincronizzati con il rod
- `rodFromSignal`: update da signal e da rod restano coerenti nei due sensi
- `checked: rod`: il checkbox resta sincronizzato tra rod e DOM
- `checked: rod`: il gruppo radio sincronizza il `value` selezionato tra rod e DOM
- `files: rod`: `input[type="file"]` legge i file nel rod e supporta il clear programmato
- `value: rod`: `select` singolo con placeholder `value=""` mappa il rod `null`
- `value: rod`: `input[type="number"]` mantiene il rod numerico e usa `null` quando il campo viene svuotato
- `value: rod`: `input[type="range"]` mantiene il rod numerico in two-way
- `value: rod`: la textarea resta sincronizzata tra rod e DOM
- `value: rod`: `select[multiple]` resta allineato con array e selezione iniziale
- `selected: rod`: le `option` sincronizzano stato rod e stato DOM

## Verifica browser reactive core

Pagina demo:
- route: `/demo/component/cms-reactive`
- file: `cmswift-site/pages/tutorial/cms-reactive.cms.js`

Checklist manuale:
- `signal + computed`: i getter derivati seguono le dipendenze tracciate
- `effect + cleanup`: i rerun incrementano il contatore effect e il cleanup corre tra una run e la successiva
- `dispose`: dopo `dispose effect` il contatore non deve piu avanzare
- `untracked`: cambiare il signal letto in `untracked(...)` non deve aggiornare il computed finche non cambia una dipendenza tracciata

Fase 3: Rod
- separare chiaramente cosa e compat layer, cosa e API primaria, cosa e helper
- ridurre sovrapposizioni con il reactive core

Fase 4: Lifecycle
- formalizzare mount/unmount
- documentare cleanup automatico e responsabilita dei componenti

## Lifecycle / Mount / Cleanup: contratto iniziale

Area:
- `CMSwift.mount`
- `CMSwift.component`
- `CMSwift.enableAutoCleanup`
- cleanup registry

### Cosa supporta ora

- `CMSwift.mount(target, content, opts)` monta node, array, stringhe o component instance
- `CMSwift.component(renderFn)` crea istanze con `ctx.onDispose(...)`
- cleanup registry per associare disposer ai nodi DOM
- `enableAutoCleanup()` osserva rimozioni dal DOM e chiama `cleanupNodeTree(...)`

### Correzione fatta in questo step

Mount / cleanup:
- rimosso un bug reale in `CMSwift.mount(...)` dove veniva letto `disposers` fuori scope
- quando `mount(..., { clear: true })` svuota il target, passa ora da `cleanupNodeTree(...)` prima di rimuovere i nodi
- gli stessi disposer di mount vengono ora wrapped in una dispose idempotente, cosi non scattano piu piu volte se registrati su nodi diversi
- `unmount()` passa ora da `cleanupNodeTree(...)` prima di rimuovere i nodi dal parent

### Limiti attuali del blocco lifecycle

- il lifecycle dei componenti non e ancora documentato con esempi completi di mount/unmount
- manca una suite di test automatica dedicata

Stato:
- milestone 1 chiusa a livello funzionale
- demo browser dedicata aggiunta e verificata

## Verifica browser lifecycle / mount / cleanup

Pagina demo:
- route: `/demo/component/cms-lifecycle`
- file: `cmswift-site/pages/tutorial/cms-lifecycle.cms.js`

Checklist manuale:
- `_.mount(...)`: mount, replace e unmount rilasciano correttamente le istanze montate
- `_.component(...)`: `ctx.onDispose(...)` viene chiamato quando l'istanza viene smontata
- `_.enableAutoCleanup()`: la rimozione manuale di nodi dal DOM libera anche i disposer associati

## Platform: apertura blocco

Area:
- `CMSwift.overlay`
- `CMSwift.store`
- `CMSwift.plugins.auth`
- `CMSwift.http`
- `CMSwift.router`
- `CMSwift.ui.meta`

Obiettivo del blocco:
- trattare i moduli applicativi con lo stesso metodo usato per renderer, reactive, rod e lifecycle
- definire responsabilita e invarianti per modulo
- ridurre i bug nati da stato globale implicito dentro lo stesso file

Sequenza proposta:
1. `store`
2. `router`
3. `http`
4. `overlay`
5. `auth`
6. `CMSwift.ui.meta`

## Platform / Store: contratto iniziale

Area:
- `CMSwift.store.get`
- `CMSwift.store.set`
- `CMSwift.store.watch`
- `CMSwift.store.signal`
- `CMSwift.store.model`

### Cosa supporta ora

- storage persistente su `localStorage` o `sessionStorage`
- cache runtime in memoria
- watcher per chiave
- `signal` persistente che usa il core reattivo
- integrazione con `rod` tramite `store.model(...)`
- sync cross-tab sugli scope registrati

### Correzione fatta in questo step

Store scoping:
- `store.signal(key, initial, opts)` non muta piu temporaneamente la config globale per leggere o scrivere
- cache, watcher e pending writes sono ora namespaced per coppia `storage + prefix + key`
- gli update persistiti da `signal(...)` restano nello scope corretto anche quando usi `opts.storage` o `opts.prefix`
- il listener `storage` del browser riallinea ora solo gli scope davvero registrati, non un solo prefix globale implicito

Cleanup:
- `store.signal(...)` dispone ora sia il watcher sia l'effect interno `signal -> store`
- viene disposto anche il signal interno del core reattivo
- i callback di `store.watch(...)` vengono eseguiti in `untracked`, cosi non agganciano per errore le dipendenze dell'effect chiamante

### Limiti attuali del blocco platform

- esiste una demo browser aggregata del blocco platform, ma non ancora demo separate per ogni modulo
- `store` ha ora helper interni estratti, ma il secondo giro e ancora all'inizio
- gli altri moduli platform non hanno ancora ricevuto lo stesso trattamento strutturale del `store`

Stato:
- platform: milestone 2 chiusa
- store: secondo giro chiuso con helper interni condivisi per scope, chiavi e serializzazione

## Platform / Router: contratto iniziale

Area:
- `CMSwift.router.add`
- `CMSwift.router.navigate`
- `CMSwift.router.start`
- `CMSwift.router.beforeEach`
- `CMSwift.router.subscribe`

### Cosa supporta ora

- mode `history`, `hash` e `auto`
- route semplici e nested
- params dinamici via `:id`
- query string e hash nel route context
- `beforeEach(...)` per blocco o redirect
- subscription reattiva al cambio route
- devtools base con `status`, `inspect`, `trace`, `history`

### Correzione fatta in questo step

Mount / cleanup:
- il router conserva ora davvero l'`unmount` della view corrente anche nei casi normali e nested
- questo rende affidabile la pulizia della view precedente a ogni navigazione, non solo nel ramo `404`

Stato route:
- il ramo `404` aggiorna ora anche `_currentCtx`, listeners e history interna
- `trace()` non prova piu a loggare `url` prima che venga normalizzato

### Limiti attuali del blocco router

- il router e coperto dalla demo browser aggregata del blocco platform, ma non ha ancora una demo separata
- `start()` registra listener globali senza una semantica di dispose esplicita
- il supporto nested e ancora minimale e va blindato meglio nei casi complessi

Stato:
- router: secondo giro chiuso con helper interni estratti per path, query, matching e history
- platform: milestone 2 chiusa

## Platform / HTTP: contratto iniziale

Area:
- `CMSwift.http.request`
- `CMSwift.http.get/post/put/patch/del`
- `CMSwift.http.getJSON/postJSON/putJSON/patchJSON/delJSON`
- `CMSwift.http.onBefore`
- `CMSwift.http.onAfter`
- `CMSwift.http.onError`
- `CMSwift.http.state`

### Cosa supporta ora

- wrapper fetch con `baseURL`, `timeout`, `retry`, `headers`, `credentials`
- hook `beforeRequest`, `afterResponse`, `onError`
- integrazione opzionale con `auth.fetch`
- stato reattivo ultimo request/response/error e contatore `inFlight`
- helper strict per `json` e `text`

### Correzione fatta in questo step

Public API:
- `CMSwift.http.request` espone ora direttamente la funzione di request pubblica, non una function che la restituisce
- `CMSwift.http.state()` restituisce ora la superficie di stato pubblica, non l'oggetto interno con `markStart/markEnd`

Auth bridge:
- `coreFetch(...)` non usa piu un riferimento `app.auth` fuori scope
- il modulo usa ora `CMSwift.auth.fetch` quando disponibile, con `bind` corretto

### Limiti attuali del blocco http

- il modulo e coperto dalla demo browser aggregata del blocco platform, ma non ha ancora una demo separata
- mancano metodi di configurazione pubblici per aggiornare `configHTTP`
- la semantica di retry e timeout va documentata meglio

Stato:
- http: secondo giro chiuso con helper interni estratti per state, normalize request, retry/abort e response wrapper
- platform: milestone 2 chiusa

## Platform / Overlay: contratto iniziale

Area:
- `CMSwift.overlay.open`
- `CMSwift.overlay.close`
- `CMSwift.overlay.closeTop`

### Cosa supporta ora

- root overlay condivisa in `document.body`
- stack di overlay con z-index incrementale
- backdrop opzionale
- chiusura via outside click, backdrop click ed `Escape`
- focus iniziale e trap focus opzionale
- positioning base per overlay ancorati
- lock scroll opzionale

### Correzione fatta in questo step

Cleanup:
- l'entry salvata nello stack non viene piu clonata prima di completare `_cleanup` e `_positionCleanup`
- `close(...)` legge ora lo stesso oggetto mutato durante `open(...)`
- questo rende affidabile la rimozione dei listener globali `mousedown`, `keydown`, `resize`, `scroll`

### Limiti attuali del blocco overlay

- il modulo e coperto dalla demo browser aggregata del blocco platform, ma non ha ancora una demo separata
- manca restore focus verso l'elemento attivo prima dell'apertura
- il positioning ancorato e ancora minimale

Stato:
- overlay: secondo giro chiuso con helper interni estratti per root, focus e positioning ancorato
- platform: milestone 2 chiusa

## Platform / Auth: contratto iniziale

Area:
- `CMSwift.plugins.auth`
- `CMSwift.auth.user/isAuth`
- `CMSwift.auth.hasRole/can/canAny/canAll`
- `CMSwift.auth.loginAsync/logoutAsync/fetch`

### Cosa supporta ora

- stato auth persistito via `store.signal(...)`
- ruoli e permessi letti da `user.roles` e `user.permissions`
- login, logout e refresh token asincroni
- guard router per route protette
- fetch autenticata con header token
- devtools base con `status`, `inspect`, `trace`

### Correzione fatta in questo step

Auth fetch:
- `auth.fetch(...)` non ritenta piu all'infinito sui `401`
- dopo un refresh riuscito il retry autenticato viene tentato una sola volta per request

Devtools / stato:
- il plugin espone ora `_getState`, cosi `status()` e `inspect()` possono leggere davvero token, `expiresAt` e stato auth completo

### Limiti attuali del blocco auth

- il modulo e coperto dalla demo browser aggregata del blocco platform, ma non ha ancora una demo separata
- `loginAsync`, `logoutAsync` e `doRefresh()` usano ancora `fetch` diretto e non una superficie HTTP unificata del core
- la semantica dei redirect auth dipende ancora da un solo `beforeEach` nel router

Stato:
- auth: secondo giro chiuso con helper interni estratti per permessi, path protetti e devtools
- platform: milestone 2 chiusa

## Platform / UI Meta: contratto iniziale

Area:
- `CMSwift.ui.meta`
- `CMSwift.docTable`
- `CMSwift.ui.inspect`

### Cosa supporta ora

- registry centrale della documentazione macchina dei componenti UI
- viewer dev `CMSwift.docTable(name)` per props, slots, events, signature e returns
- inspect raw del meta con `CMSwift.ui.inspect(name)`

### Correzione fatta in questo step

Doc viewer:
- `CMSwift.docTable(...)` non dipende piu in modo rigido da `_.TabPanel`
- se `TabPanel` non e disponibile, il viewer usa un fallback statico leggibile
- quando un meta non ha props ma ha solo `slots/events`, il titolo non resta forzato su `Props`
- quando non c'e documentazione strutturata, il viewer rende un messaggio esplicito invece di una shell vuota

### Limiti attuali del blocco ui meta

- il registry non ha ancora una validazione formale dello shape dei meta
- il viewer e coperto dalla demo browser aggregata del blocco platform, ma non ha ancora una demo separata
- `docTable` resta accoppiato a componenti UI come `Card`, `Chip`, `TabPanel`

Stato:
- ui meta: secondo giro chiuso con helper interni estratti per fallback component, rows e tab group
- platform: milestone 2 chiusa

## Verifica browser blocco platform

Pagina demo:
- route: `/demo/component/cms-platform`
- file: `cmswift-site/pages/tutorial/cms-platform.cms.js`

Checklist manuale:
- `store`: count persistente, watcher e raw `sessionStorage` restano coerenti sullo scope `CMSPlatform:`
- `router`: `path/query/hash` seguono `_.useRoute(ctx)` quando navighi con query e hash
- `http`: hooks `onBefore/onAfter/onError` e `_.http.state()` reagiscono a request ok ed errore forzato
- `overlay`: `open`, `closeTop` e stack size restano coerenti durante apertura/chiusura modal e anchored
- `auth`: simulazione login/logout aggiorna `_.auth.isAuth()`, ruoli, permessi e `status()`
- `ui.meta`: `_.docTable(...)` rende la documentazione per `Layout`, `Btn` e `Drawer`

Fase 5: Meta e modularita
- mantenere `CMSwift.meta` corto e strutturato
- usare questo file come documento esteso
- valutare in seguito una separazione del core in moduli interni

## Sorgenti Core

Da adesso il core non va piu mantenuto solo dentro `pages/_cmswift-fe/js/cms.js`.

Sorgente interno:
- `packages/core/src/00-bootstrap.js`
- `packages/core/src/10-overlay.js`
- `packages/core/src/15-dom-props.js`
- `packages/core/src/16-renderer-shared.js`
- `packages/core/src/17-renderer-children.js`
- `packages/core/src/18-renderer-args.js`
- `packages/core/src/20-renderer.js`
- `packages/core/src/30-rod-core.js`
- `packages/core/src/31-rod-model.js`
- `packages/core/src/32-lifecycle-helpers.js`
- `packages/core/src/32-lifecycle.js`
- `packages/core/src/33-debug-perf.js`
- `packages/core/src/34-rod-devtools.js`
- `packages/core/src/40-store-core.js`
- `packages/core/src/41-store-extensions.js`
- `packages/core/src/42-plugins.js`
- `packages/core/src/43-auth.js`
- `packages/core/src/44-http.js`
- `packages/core/src/45-route-hooks.js`
- `packages/core/src/50-ui-meta.js`
- `packages/core/src/51-can.js`
- `packages/core/src/52-router.js`
- `packages/core/src/53-footer.js`
- `packages/core/src/modules.json`

Build:
- `npm run build:cms`

Regola operativa:
- modificare i file in `packages/core/src/`
- rigenerare `cms.js`
- verificare con `npm test`

## Convenzione Meta

`CMSwift.meta` dentro `cms.js` deve restare:
- compatto
- leggibile da AI e devtools
- allineato a questo README

Campi consigliati per ogni modulo:
- `description`
- `entrypoints`
- `status`
- `knownLimits`

## Log

### 2026-04-03
- creato il documento core reference
- aggiunto `CMSwift.meta` iniziale in `cms.js`
- fissate le 5 aree prioritarie del core
- registrato come issue strutturale il bug sulle CSS custom properties nel renderer
- aggiunta pagina demo browser `cms-renderer` per verificare bridge `props -> DOM`
- implementata la prima semantica eventi del renderer con handler dinamici e custom event
- aperto il blocco `platform` con focus iniziale su `store`
- corretto `store.signal(...)` per scope `storage/prefix`, cleanup completo e cache/watcher namespaced
- corretto il blocco `router` per unmount affidabile, tracing e stato `404`
- corretto il blocco `http` per bridge auth e API pubblica `request/state`
- corretto il blocco `overlay` per cleanup reale dei listener e dell'entry stack
- corretto il blocco `auth` per retry `401` non infinito e stato devtools completo
- corretto il blocco `ui.meta` per robustezza del doc viewer e fallback senza `TabPanel`
- aggiunta demo browser aggregata `cms-platform` per store, router, http, overlay, auth e ui.meta
- aggiunta prima suite automatica `node:test` per `reactive` e `store`
- estesa la suite automatica del core con copertura dedicata per `overlay` e `auth`
- estesa la suite automatica del core con copertura dedicata per `ui.meta`
- separato il core in moduli interni sotto `packages/core/src/*` con build dedicata `npm run build:cms`
- rifinita la separazione dei moduli del core con granularita piu stretta e manifest `modules.json`
- iniziato il secondo giro di pulizia interna con un bridge DOM condiviso tra `renderer` e `rod`
- esteso il bridge DOM condiviso anche ai key speciali del `rod`: `auto`, `attr:`, `style.*` e nested path
- chiuso formalmente il secondo giro del `rod` con bridge DOM condiviso e blocco devtools separato
- alleggerito il `renderer` estraendo helper condivise per classi, eventi e interpolazioni
- separata anche la gestione dei dynamic children dal body di `createElement(...)`
- separato anche il loop finale di parsing `args/props/children` dal body di `createElement(...)`
- iniziato il secondo giro del lifecycle con helper interni estratti per mount, cleanup e component dispose
- chiuso formalmente il secondo giro del lifecycle con helper interni estratti e modulo pubblico alleggerito
- aperto il secondo giro del reactive core con `batch(...)`, alias pubblico `_.batch` e test automatico dedicato
- esteso il reactive core con flush opzionale `microtask` sul `batch(...)` e chiuso formalmente il secondo giro
- aperto il secondo giro del blocco `platform` partendo da `store`, con helper interni estratti per scope, chiavi e serializzazione
- continuato il secondo giro del blocco `platform` su `router`, con helper interni estratti per path, query, matching e history
- continuato il secondo giro del blocco `platform` su `http`, con helper interni estratti per state, request normalize, retry/abort e response wrapper
- continuato il secondo giro del blocco `platform` su `overlay`, con helper interni estratti per root, focus e positioning ancorato
- continuato il secondo giro del blocco `platform` su `auth`, con helper interni estratti per permessi, path protetti e devtools
- continuato il secondo giro del blocco `platform` su `ui.meta`, con helper interni estratti per fallback component, rows e tab group
- chiuso formalmente il secondo giro del blocco `platform`
- aperto il terzo giro del `renderer` con cleanup corretto delle chiavi stale negli oggetti `style` dinamici
- aggiunta pagina demo dedicata `cms-renderer-style` per verificare visivamente il cleanup delle chiavi stale negli oggetti `style` dinamici
- corretto anche il cleanup degli `effect` per i listener dinamici del renderer durante l'unmount dei nodi
- corretto anche il cleanup dei `children` dinamici: il subtree precedente viene pulito davvero durante replace e unmount
- chiuso formalmente il mini-terzo-giro del `renderer`
- corretto un edge case ulteriore del renderer: anche `class/style/props` dinamici e `rod` binding vengono ora dismessi davvero all'unmount
- corretto un altro edge case del renderer: `value: rod` e ora coerente in two-way anche su `textarea` e `select`
- corretto un altro edge case del renderer: `checked: rod` e ora coerente in two-way sui checkbox `input`
- corretto un altro edge case del renderer: `select[multiple]` con `value: rod` e `option` con `selected: rod` sono ora coerenti

## Test automatici del core

Comando:
- `npm test`

File iniziali:
- `tests/helpers/load-cms.mjs`
- `tests/cms-core.test.mjs`

Copertura iniziale:
- `reactive.effect`: cleanup e dispose
- `reactive.computed` + `untracked`
- `reactive.batch`: flush unico dei subscriber a fine batch, anche con batch annidati
- `store.signal`: isolamento per `prefix/storage`
- `store.watch`: callback eseguiti in `untracked`, senza loop reattivi
- `http.request`: hook `before/after/error` e state surface pubblica
- `router`: `navigate`, `subscribe`, `isActive`, unmount view precedente e stato `404`
- `renderer`: `class`, CSS custom properties, boolean props, event options, children dinamici, nodo SVG `text`
- `renderer`: cleanup corretto delle chiavi stale quando un oggetto `style` dinamico cambia shape
- `renderer`: cleanup corretto degli `effect` per listener dinamici quando il nodo viene smontato
- `renderer`: cleanup corretto dei subtree precedenti quando i `children` dinamici fanno replace
- `renderer`: i `rod` dentro array/nested return dei `children` dinamici restano reattivi e si puliscono correttamente all'unmount
- `renderer`: i key speciali `attr:`, `@`, `style.*` e i path annidati sono ora allineati anche nei props normali, non solo in `rodBind`
- `renderer`: cleanup corretto anche per `class/style/props` dinamici e `rod` binding quando il nodo viene smontato
- `renderer`: `value: rod` e ora davvero two-way anche su `textarea` e `select`, non solo su `input`
- `renderer`: `checked: rod` e ora coerente in two-way anche sui checkbox `input`
- `renderer`: `value: rod` supporta ora anche `select[multiple]` con array e `selected: rod` su `option`
- `lifecycle`: `mount`, `component`, `ctx.onDispose`, cleanup su `clear/unmount`
- `overlay`: stack, scroll lock, z-index/root, cleanup listener documento/window
- `auth`: login/logout, ruoli/permessi, `status()/inspect()`, retry `401` una sola volta dopo refresh
- `ui.meta`: `docTable(...)` su meta assente, fallback senza `TabPanel`, path con `TabPanel` disponibile
- `rod`: semantica base condivisa con il renderer per `class`, CSS custom properties e boolean props
- `rod`: semantica condivisa anche per `auto`, `attr:`, `style.*` e assegnazione su path annidati
- `renderer`: helper di classi, eventi e interpolazioni separati dal body di `createElement(...)`
- `renderer`: semantica eventi estesa con composizione base di listener multipli nello stesso prop
- `renderer`: helper dei dynamic children separati dal body di `createElement(...)`
- `renderer`: parsing finale `args/props/children` separato dal body di `createElement(...)`
- `lifecycle`: helper di mount/cleanup/component dispose estratti dal modulo pubblico

Bug reali intercettati dai test:
- `CMSwift.http.getJSON/delJSON/postJSON/putJSON/patchJSON` chiamavano `.jsonStrict()` sul `Promise` invece che sul response wrapper risolto
- `CMSwift.router.compilePattern(...)` escapava anche `:param`, quindi i route params dinamici non venivano estratti
- `normalizeClass(...)` non valutava `function` e `rod` dentro gli object-map delle classi
- `CMSwift.docTable(...)` dipendeva ancora rigidamente da `_.Card` e `_.Chip`, quindi il fallback senza UI completa non era davvero robusto

Limiti attuali:
- il test harness usa un DOM fake minimale, non un browser reale
- restano fuori soprattutto i casi avanzati/integrati, non piu i blocchi core del primo giro
