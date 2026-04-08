# CMSwift v1.0.0 Release Notes

Stato:
- draft iniziale
- da pubblicare solo dopo chiusura checklist pre-release

## Summary

`v1.0.0` segna la prima release disciplinata di CMSwift come runtime + UI framework con:
- core modulare
- build runtime standard e minificata
- documentazione tecnica interna allineata
- demo/tutorial dedicate
- test automatici del core

## Included In v1.0.0

Core:
- renderer DOM consolidato
- reactive core con `signal`, `effect`, `computed`, `untracked`, `batch`
- `rod` con bridge e binding piu coerenti
- lifecycle / mount / cleanup piu robusti
- platform modules allineati

UI:
- modularizzazione di `ui.js` completata
- runtime `ui.js` e `min-ui.js`
- componenti principali organizzati per famiglie

Build:
- `cms.js`
- `min-cms.js`
- `ui.js`
- `min-ui.js`

Quality:
- test automatici core
- demo browser per core e UI
- checklist pre-release dedicata

## Stable

Da considerare parte principale della superficie `stable`:
- renderer core
- reactive core
- lifecycle base
- `rod` base
- componenti UI principali consolidati
- runtime outputs ufficiali

## Unstable / Experimental

Per questa release, da considerare ancora non completamente stabilizzati:
- overlay avanzati
- `Date`
- `Time`
- `UI.meta` e dev helpers come API pubblica stabile

Decisione esplicita per `v1.0.0`:
- overlay avanzati restano `unstable`
- `Date` e `Time` restano `unstable`
- `UI.meta` resta `dev-only`
- `reactive` e il set di primitive core; `rod` e il layer di binding/model

## Distribution

Debug:
- `pages/_cmswift-fe/js/cms.js`
- `pages/_cmswift-fe/js/ui.js`

Production:
- `pages/_cmswift-fe/js/min-cms.js`
- `pages/_cmswift-fe/js/min-ui.js`

## Notes

Questa release e pensata come base reale di lavoro e pubblicazione controllata.
Il passo finale prima della pubblicazione e chiudere:
- smoke test browser
- versione ufficiale
- changelog/release gate finale
