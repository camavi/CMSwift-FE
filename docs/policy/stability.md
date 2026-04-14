# CMSwift Stability And Compatibility Policy

Questa policy definisce come CMSwift gestisce:
- stabilita delle API
- compatibilita tra versioni
- breaking changes
- deprecations

Obiettivo:
- dare un contratto chiaro prima della `v1`
- evitare ambiguita tra API stabili, sperimentali e dev-only

## 1. Versioning

CMSwift adotta `SemVer`:
- `MAJOR.MINOR.PATCH`

Regola:
- `PATCH`: bug fix, cleanup interni, miglioramenti senza cambi di contratto pubblico
- `MINOR`: nuove feature compatibili, nuove props opzionali, nuovi componenti o nuove API additive
- `MAJOR`: breaking changes sulla superficie pubblica stabile

Esempi:
- fix renderer senza cambiare API pubblica: `PATCH`
- aggiunta di un nuovo componente UI: `MINOR`
- rinomina o rimozione di una prop stabile: `MAJOR`

## 2. Classificazione Delle API

CMSwift divide la superficie in 4 classi.

### 2.1 Stable

Queste API possono essere usate in produzione con aspettativa di compatibilita semver.

Regola:
- non si rompe il comportamento o la firma in `PATCH` o `MINOR`
- ogni breaking change richiede un `MAJOR`

Oggi rientrano qui, salvo nota contraria:
- core renderer
- reactive core
- lifecycle base
- `rod` base
- componenti UI principali gia consolidati
- build outputs ufficiali

### 2.2 Unstable

Queste API esistono e possono essere usate, ma non promettono ancora piena stabilita di contratto.

Regola:
- possono cambiare anche in `MINOR`
- il cambiamento deve comunque essere documentato
- vanno evitate come fondazione contrattuale di prodotti terzi se non accettano churn

Oggi rientrano qui:
- overlay avanzati
- `Date`
- `Time`
- aree dove il contratto pubblico non e ancora fissato completamente

Decisione per `v1`:
- `Tooltip`, `Dialog`, `Menu`, `Popover`, `ContextMenu` restano `unstable`
- `Date` e `Time` restano `unstable`
- non vengono promossi a `stable` nella `1.0.0`

### 2.3 Experimental

Queste API sono da considerare prova tecnica o superficie in osservazione.

Regola:
- possono cambiare o sparire senza garanzia semver forte
- devono essere marcate chiaramente come sperimentali

Uso consigliato:
- demo
- validazione interna
- feedback loop rapido

### 2.4 Dev-only / Internal

Queste API non fanno parte del contratto pubblico stabile.

Regola:
- possono cambiare liberamente se necessario
- non vanno promesse come interfaccia pubblica

Esempi:
- `UI.meta`
- helper inspect/devtools
- helper interni di build
- wiring tecnico non documentato come pubblico

## 3. Compatibilita Garantita

CMSwift garantisce compatibilita semver solo per:
- API marcate `stable`
- entrypoint runtime ufficiali documentati

Compatibilita garantita significa:
- stessa firma o firma compatibile
- stesso significato delle props gia documentate
- stesso ruolo dei file runtime ufficiali

Non significa:
- CSS identico al pixel
- assenza totale di bug fix comportamentali
- stabilita di API non documentate

## 4. Breaking Change Policy

Una breaking change e qualunque modifica che rompe codice esistente che usa API `stable`.

Esempi di breaking:
- rimozione di componente o metodo pubblico
- rinomina di prop stabile
- cambio di default con impatto comportamentale forte
- cambio di shape dei valori ritornati
- rimozione o rinomina di output runtime ufficiali

Regola:
- una breaking change su API `stable` richiede `MAJOR`
- va documentata in release notes
- se possibile va preceduta da deprecazione

## 5. Deprecation Policy

Quando un'API `stable` deve essere sostituita:
- prima si marca `deprecated`
- poi si mantiene per almeno un ciclo `MINOR` prima della rimozione, salvo impossibilita tecnica seria

Ogni deprecazione deve avere:
- cosa e deprecato
- alternativa corretta
- da quale versione e deprecato
- da quale `MAJOR` puo essere rimosso

Formato consigliato:
- README / release notes
- warning opzionale in dev mode dove ha senso

## 6. Public Runtime Contract

I file runtime pubblici ufficiali sono:

Readable:
- `packages/core/dist/cms.js`
- `packages/ui/dist/ui.js`
- `packages/cmswift/dist/cmswift.js`

Minified:
- `packages/core/dist/min-cms.js`
- `packages/ui/dist/min-ui.js`
- `packages/cmswift/dist/min-cmswift.js`

Mirror locale compatibile:
- `pages/_cmswift-fe/js/cms.js`
- `pages/_cmswift-fe/js/min-cms.js`
- `pages/_cmswift-fe/js/ui.js`
- `pages/_cmswift-fe/js/min-ui.js`

Regola:
- questi file non cambiano nome o ruolo in `PATCH` o `MINOR`
- un cambio di naming o di strategia di distribuzione richiede almeno documentazione forte e, se rompe integrazioni, `MAJOR`

## 7. Current Policy For `rod` And `reactive`

Per la `v1`, la policy consigliata e:
- `reactive` e parte del core stabile
- `rod` e supportato e stabile per il binding applicativo
- la narrativa pubblica deve dire che sono due strumenti distinti, non due alias dello stesso modello

Posizionamento consigliato:
- `reactive`: primitive base del framework
- `rod`: binding e model layer ergonomico sopra i casi UI/applicativi

## 8. Current Policy For UI Components

Per la `v1`, classificazione consigliata:

Stable:
- layout base
- input base
- select base
- checkbox/radio/toggle consolidati
- navigation base
- feedback base
- table base

Unstable:
- overlay avanzati
- date/time
- superfici con comportamento molto ricco e piu sensibile a edge case

Decisione chiusa per `v1.0.0`:
- overlay avanzati: `unstable`
- `Date`: `unstable`
- `Time`: `unstable`
- `UI.meta` e dev helpers: `dev-only`
- narrativa pubblica: `reactive` come core primitives, `rod` come model/binding layer

Dev-only:
- `UI.meta`
- inspect helpers
- tooling helpers per AI/dev

## 9. Release Discipline

Prima di ogni release pubblica:
- build runtime normale e minificata
- test automatici core
- smoke test browser sulle demo chiave
- aggiornamento README
- aggiornamento release notes
- verifica di eventuali deprecations attive

## 10. Decision Rule

Se un cambiamento tocca una API `stable`, bisogna chiedersi:

1. rompe codice esistente?
2. cambia comportamento atteso?
3. cambia file/runtime ufficiali?

Se la risposta e `si`, non e un semplice refactor interno:
- o si trasforma in modifica compatibile
- oppure si tratta come breaking change vera
