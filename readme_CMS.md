# CMSwift Core

Documento operativo del core `CMSwift`.

Scopo:
- tenere una roadmap tecnica chiara del framework
- documentare i moduli core e i loro limiti attuali
- aggiornare passo passo ogni intervento strutturale su `pages/_cmswift-fe/js/cms.js`

Regola di aggiornamento:
- quando cambia un modulo core, aggiornare questo file
- quando cambia la superficie macchina utile ad AI/devtools, aggiornare anche `CMSwift.meta` dentro `pages/_cmswift-fe/js/cms.js`

## Priorita attuali

1. Renderer DOM e bridge props
- file: `pages/_cmswift-fe/js/cms.js`
- area: `createElement`, `setProp`, `bindProp`, gestione `style`, attributi, eventi, children
- motivo: ogni bug qui impatta tutto il framework
- obiettivo: rendere prevedibile la traduzione `props -> DOM` e coprire gli edge case con test
- stato: milestone 1 chiusa, da consolidare con test automatici

2. Reactive core
- area: `CMSwift.reactive.signal` e `CMSwift.reactive.effect`
- motivo: oggi il core e minimale e manca una semantica forte su dispose, scheduling e loop safety
- obiettivo: definire invarianti chiare del modello reattivo
- stato: in lavorazione

3. Rod
- area: `_.rod`, `CMSwift.rodBind`, `CMSwift.rodModel`, interpolation buffer
- motivo: e potente ma ha una superficie API ampia e in parte sovrapposta al reactive core
- obiettivo: chiarire il ruolo di `rod` e allinearlo meglio al resto del sistema
- stato: milestone 1 chiusa, da consolidare con test e ulteriore allineamento al renderer

4. Lifecycle, mount e cleanup
- area: `CMSwift.mount`, `CMSwift.component`, cleanup registry, auto cleanup
- motivo: e la zona dove possono nascere leak, listener duplicati e componenti non smontati bene
- obiettivo: definire il lifecycle e rendere affidabile unmount/cleanup

5. Moduli platform nel core
- area: overlay, store, auth, http, router, `CMSwift.ui.meta`
- motivo: sono utili, ma oggi vivono tutti nello stesso file con responsabilita molto ampie
- obiettivo: modularita interna migliore, documentazione per modulo e confini piu chiari

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
- resta da aggiungere copertura test automatica

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
- `on:custom-event` per eventi custom senza normalizzazione automatica del nome
- `options` supporta `once`, `capture`, `passive`

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

- gli eventi non hanno ancora delegation o composizione/diff avanzato di listener multipli
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
- file: `pages/tutorial/cms-renderer.cms.js`

Checklist manuale:
- input: `disabled`, `required`, `readOnly`, `placeholder`, `aria-invalid`, `data-empty`
- select: `value`, `disabled`, `required`, `data-mode`
- class: string, array, object-map e toggle reattivi
- eventi: attach, detach, switch handler e custom event `on:...`
- eventi options: `once`, `capture`, `passive`
- aria/data: presenza e rimozione reale degli attributi
- svg: attributi `aria-*`, `data-*` e contenuto testuale dinamico
- dynamic children: ritorno di nodo singolo, array e `null`

Fase 2: Reactive
- documentare il contratto di `signal/effect`
- decidere come gestire dispose, nested effect, scheduling e loop protection

## Reactive Core: contratto iniziale

Area:
- `CMSwift.reactive.signal`
- `CMSwift.reactive.effect`
- `CMSwift.reactive.computed`
- `CMSwift.reactive.untracked`

Alias pubblici:
- `_.signal` / `CMSwift.signal`
- `_.effect` / `CMSwift.effect`
- `_.computed` / `CMSwift.computed`
- `_.untracked` / `CMSwift.untracked`

### Cosa supporta ora

- `signal(initial)` restituisce `[get, set, dispose]`
- `effect(fn)` esegue subito l'effetto e restituisce una funzione di dispose
- `computed(fn)` restituisce un getter derivato con `dispose()`
- `untracked(fn)` esegue una lettura senza registrare dipendenze reattive
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

### Limiti attuali del reactive core

- manca scheduling configurabile
- la protezione loop e di primo livello: copre il loop sincrono di un effect, non ancora i cicli complessi tra effect multipli
- manca una suite di test automatica dedicata

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
- file: `pages/tutorial/cms-rod.cms.js`

Checklist manuale:
- `_.rod`: `.value` e `.action(...)` reagiscono agli update
- `rodBind`: testo, classi e attributi seguono il valore del rod
- `rodModel`: input e select restano sincronizzati con il rod
- `rodFromSignal`: update da signal e da rod restano coerenti nei due sensi

## Verifica browser reactive core

Pagina demo:
- route: `/demo/component/cms-reactive`
- file: `pages/tutorial/cms-reactive.cms.js`

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

Fase 5: Meta e modularita
- mantenere `CMSwift.meta` corto e strutturato
- usare questo file come documento esteso
- valutare in seguito una separazione del core in moduli interni

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
- creato `readme_CMS.md`
- aggiunto `CMSwift.meta` iniziale in `cms.js`
- fissate le 5 aree prioritarie del core
- registrato come issue strutturale il bug sulle CSS custom properties nel renderer
- aggiunta pagina demo browser `cms-renderer` per verificare bridge `props -> DOM`
- implementata la prima semantica eventi del renderer con handler dinamici e custom event
