# CMSwift v1 Browser Smoke Checklist

Checklist manuale minima da eseguire prima di una release `v1`.

Regola:
- se una voce fallisce, la release si ferma
- il check va fatto almeno su build runtime corrente
- preferibile verificare sia bundle standard sia minificato

Stato preflight attuale:
- preflight HTTP locale eseguito il `2026-04-08`
- verificati `200 OK` su:
  - `pages/index.html`
  - `pages/_cmswift-fe/js/cms.js`
  - `pages/_cmswift-fe/js/ui.js`
  - `pages/_cmswift-fe/js/min-cms.js`
  - `pages/_cmswift-fe/js/min-ui.js`
- il check interattivo browser resta comunque obbligatorio

Stato manual smoke:
- smoke browser manuale eseguita
- demo core e UI principali verificate piu volte
- esito: `PASS`

## 1. Runtime Files

- [x] `pages/_cmswift-fe/js/cms.js` carica senza errori
- [x] `pages/_cmswift-fe/js/ui.js` carica senza errori
- [x] `pages/_cmswift-fe/js/min-cms.js` carica senza errori
- [x] `pages/_cmswift-fe/js/min-ui.js` carica senza errori

## 2. Demo Shell

- [x] [index.html](/Users/cmalleux/Sites/CMSwift-FE/pages/index.html) risponde `200 OK` nel preflight HTTP
- [x] [index.html](/Users/cmalleux/Sites/CMSwift-FE/pages/index.html) carica senza errori console
- [x] routing demo funzionante
- [x] drawer shell principale funzionante
- [x] main layout responsive almeno in check rapido desktop/mobile

## 3. Core Demo

- [x] `/demo/component/cms-renderer`
- [x] `/demo/component/cms-reactive`
- [x] `/demo/component/cms-rod`
- [x] `/demo/component/cms-lifecycle`
- [x] `/demo/component/cms-platform`
- [x] `/demo/component/cms-renderer-style`

## 4. UI Demo Prioritarie

- [x] layout
- [x] form
- [x] input
- [x] select
- [x] table
- [x] tabs
- [x] dialog
- [x] menu
- [x] popover
- [x] tooltip
- [x] app-shell

## 5. What To Verify

Su ogni demo chiave:
- [x] nessun errore console
- [x] nessun warning nuovo inatteso
- [x] interazioni principali funzionanti
- [x] stato reattivo coerente
- [x] overlay aprono/chiudono correttamente
- [x] keyboard base non rotta

## 6. Release Gate

La release puo proseguire solo se:
- [x] tutti i check sopra sono passati
- [x] eventuali failure sono documentati e chiusi
- [x] non restano blocker aperti in `release_CMSwift_v1.md`
