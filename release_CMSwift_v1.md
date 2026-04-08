# CMSwift v1 Pre-release Checklist

Documento operativo per decidere quando CMSwift puo essere pubblicato come `v1`.

Obiettivo:
- separare chiaramente cio che blocca la release
- dichiarare cosa e `unstable`
- congelare le aree che non vanno toccate senza motivo serio
- definire cosa manca prima di pubblicare

Regola pratica:
- se una voce e `BLOCKER`, la release `v1` non parte
- se una voce e `UNSTABLE`, puo uscire solo se marcata esplicitamente come sperimentale
- se una voce e `FROZEN`, si tocca solo per bug fix o regressioni

## Stato Attuale

Valutazione rapida oggi:
- core framework: buono
- modularizzazione: buona
- documentazione tecnica interna: buona
- demo/tutorial: buoni
- test automatici core: buoni
- readiness prodotto pubblico: non ancora chiusa

Conclusione:
- CMSwift oggi e un progetto serio e strutturato
- non e ancora automaticamente una `v1` pubblicabile senza una release discipline esplicita

Snapshot gate oggi:
- README pubblico: presente
- policy stabilita/compatibilita: presente
- LICENSE: presente
- versione package: `1.0.0`
- changelog/release notes: presenti come draft
- build runtime: verde
- test automatici core: verdi
- smoke browser release: passata
- decisione finale `stable` vs `unstable` su aree UI avanzate: chiusa

## 1. Blocker

Queste voci bloccano una release `v1` pubblica.

### 1.1 Posizionamento e contratto pubblico

Stato: `PARTIAL`

Manca ancora un contratto pubblico corto e definitivo:
- cosa e CMSwift
- chi lo deve usare
- cosa fa il core
- cosa fa il layer UI
- cosa e supportato ufficialmente
- cosa non e supportato

Serve prima di pubblicare:
- una pagina `README` pubblico da repo/prodotto
- una sezione `Quick start`
- una sezione `Stable API surface`
- una sezione `Known limits`

Aggiornamento:
- `README.md` pubblico iniziale creato
- aggiunte anche le sezioni `Stable API surface` e `Known limits`

### 1.2 Versioning e policy di compatibilita

Stato: `PARTIAL`

Manca una policy esplicita:
- quando una modifica e breaking
- cosa promette `v1`
- se il meta/UI API sono stabili o no
- se `rod` e `reactive` sono entrambi first-class oppure uno dei due e legacy/advanced

Serve prima di pubblicare:
- policy semver
- policy breaking changes
- policy deprecations

Aggiornamento:
- policy iniziale definita in `policy_CMSwift_stability.md`
- package allineato a `1.0.0`
- confine `stable` vs `unstable` chiuso per `v1.0.0`

### 1.3 Smoke test browser di release

Stato: `READY`

Ci sono buoni test automatici sul core, ma manca una checklist release browser esplicita da eseguire sempre.

Serve prima di pubblicare:
- smoke test manuale minimo su demo chiave
- verifica `cms.js`, `min-cms.js`, `ui.js`, `min-ui.js`
- verifica route demo principali
- verifica overlay, router, form, table, layout

Aggiornamento:
- checklist browser iniziale preparata in `smoke_CMSwift_v1.md`
- preflight automatico via server locale non eseguibile in questo ambiente: `vite` richiede Node `20.19+` e il bind locale nel sandbox e bloccato
- preflight HTTP locale eseguito fuori sandbox con `200 OK` su `pages/index.html`, `cms.js`, `min-cms.js`, `min-ui.js`
- smoke browser manuale confermata come passata

### 1.4 Entry point di produzione

Stato: `READY`

Va deciso in modo netto quali file sono gli entrypoint ufficiali:
- `pages/_cmswift-fe/js/cms.js`
- `pages/_cmswift-fe/js/min-cms.js`
- `pages/_cmswift-fe/js/ui.js`
- `pages/_cmswift-fe/js/min-ui.js`

Serve prima di pubblicare:
- documentare quale file usare in dev
- documentare quale file usare in production
- documentare se il bundle minificato e quello raccomandato

Aggiornamento:
- entrypoint runtime documentati in `README.md`
- build standard e minificata gia allineate

### 1.5 Licenza e metadati di pubblicazione

Stato: `PARTIAL`

Il repo ha bisogno di base legale e metadata minimi per essere pubblicabile come prodotto reale.

Serve prima di pubblicare:
- file `LICENSE`
- autore/ownership chiari
- versione iniziale ufficiale
- changelog iniziale o release notes `v1.0.0`

Aggiornamento:
- `LICENSE` aggiunta con licenza `MIT`
- ownership iniziale esplicitata come `Carlos Malleux`
- `package.json` allineato a `1.0.0`
- draft iniziale release notes creato in `release_notes_CMSwift_v1.0.0.md`
- `CHANGELOG.md` iniziale creato
- build runtime e test automatici passati su `1.0.0`

## 2. Unstable

Queste aree possono uscire solo se marcate in modo esplicito come sperimentali.

### 2.1 Overlay avanzati

Stato: `UNSTABLE`

Componenti:
- `Tooltip`
- `Dialog`
- `Menu`
- `Popover`
- `ContextMenu`

Motivo:
- tanta superficie interattiva
- anchor logic, focus, close rules e runtime overrides sono sempre zone sensibili

Decisione consigliata:
- pubblicarli come `stable` solo se fai smoke test dedicato
- altrimenti marcarli `experimental`

### 2.2 Date / Time

Stato: `UNSTABLE`

Motivo:
- molti edge case naturali
- parsing, UX, keyboard, close rules, conferma selezione

Decisione consigliata:
- non promettere stabilita completa `v1`

### 2.3 `rod` vs `reactive`

Stato: `UNSTABLE` a livello di messaging pubblico

Motivo:
- tecnicamente sono entrambi funzionanti
- come narrativa di prodotto non e ancora chiarissimo se sono due modelli equivalenti o due livelli diversi

Decisione consigliata:
- nel messaggio pubblico scegli un primary model
- l’altro va descritto come compat layer oppure advanced API

### 2.4 UI meta / dev helpers

Stato: `UNSTABLE`

Motivo:
- utilissimi internamente e per AI/devtools
- non ancora chiarito se fanno parte del contratto pubblico stabile

Decisione consigliata:
- marcare `UI.meta`, inspect helpers e doc helpers come `dev-only` o `subject to change`

## 3. Do Not Touch

Queste aree vanno congelate fino alla release `v1`, salvo bug fix reali o regressioni.

### 3.1 Renderer core

Stato: `FROZEN`

Non toccare senza motivo serio:
- bridge `props -> DOM`
- semantica `class`
- semantica `style`
- children dinamici
- event binding

Motivo:
- e la base del framework
- ogni refactor qui rischia regressioni trasversali

### 3.2 Reactive core

Stato: `FROZEN`

Non toccare senza motivo serio:
- `signal`
- `effect`
- `computed`
- `untracked`
- `batch`

Motivo:
- il contratto e finalmente piu chiaro
- una modifica affrettata qui rompe renderer, rod e store

### 3.3 Rod bridge

Stato: `FROZEN`

Non toccare senza motivo serio:
- `rodBind`
- `rodModel`
- `rodFromSignal`
- binding form controls

Motivo:
- hai appena chiuso molti edge case veri
- questa zona va stabilizzata, non reinventata prima della release

### 3.4 Build outputs

Stato: `FROZEN`

Non cambiare ora:
- nomi degli output runtime
- `build:cms`
- `build:ui`
- `min-cms.js`
- `min-ui.js`

Motivo:
- la pipeline va resa affidabile, non creativa

## 4. Before Publish

Questa e la checklist minima prima di dire “pubblichiamo v1”.

### 4.1 Repo e packaging

Stato: `TODO`

- aggiungere `LICENSE`
- definire versione iniziale ufficiale
- definire nome release
- aggiungere changelog iniziale
- aggiungere README pubblico sintetico

### 4.2 Docs minime pubbliche

Stato: `TODO`

- quick start core
- quick start UI
- esempio minimo con `cms.js + ui.js`
- esempio minimo con `min-cms.js + min-ui.js`
- tabella `stable vs unstable`
- guida “quale stato usare: rod o reactive”

### 4.3 Release smoke tests

Stato: `TODO`

Smoke test minimo consigliato:
- `/demo/component/cms-renderer`
- `/demo/component/cms-reactive`
- `/demo/component/cms-rod`
- `/demo/component/cms-lifecycle`
- `/demo/component/cms-platform`
- layout demo
- form demo
- dialog/menu/popover demo
- table demo

### 4.4 Build artifacts

Stato: `TODO`

Verificare a ogni release:
- `npm run build:cms`
- `npm run build:ui`
- `npm test`
- `node --check pages/_cmswift-fe/js/cms.js`
- `node --check pages/_cmswift-fe/js/min-cms.js`
- `node --check pages/_cmswift-fe/js/ui.js`
- `node --check pages/_cmswift-fe/js/min-ui.js`

### 4.5 Public release note

Stato: `TODO`

Scrivere:
- cosa include `v1`
- cosa e stabile
- cosa e sperimentale
- cosa arriva dopo

## 5. Suggested Release Scope

Scope consigliato per `v1`:
- core `CMSwift` stabile
- UI kit base stabile
- build runtime standard e minificata
- demo/tutorial ufficiali
- test automatici del core

Fuori scope o da marcare experimental:
- overlay avanzati
- date/time complessi
- meta/devtools come API pubblica stabile

## 6. Release Decision Gate

`v1` puo partire solo se tutte queste sono vere:

- nessun `BLOCKER` aperto
- tutte le aree `UNSTABLE` sono marcate chiaramente
- le aree `FROZEN` non sono piu in refactor
- README pubblico esiste
- smoke test release eseguito
- build normale e minificata verificate
- changelog/release note scritti

## 7. Suggested Next Actions

Ordine pragmatico:
1. creare `README` pubblico corto del progetto
2. decidere `stable vs unstable`
3. aggiungere `LICENSE`
4. scrivere una `release note v1.0.0`
5. eseguire smoke test release
6. tagliare la release

## 8. Decision Today

Valutazione onesta oggi:
- `v1` non e ancora da pubblicare oggi
- ma il progetto e vicino a una pre-release seria

Tradotto in una frase:
- non serve piu rifondare il framework
- serve chiudere il contratto di prodotto
