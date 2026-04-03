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

2. Reactive core
- area: `CMSwift.reactive.signal` e `CMSwift.reactive.effect`
- motivo: oggi il core e minimale e manca una semantica forte su dispose, scheduling e loop safety
- obiettivo: definire invarianti chiare del modello reattivo

3. Rod
- area: `_.rod`, `CMSwift.rodBind`, `CMSwift.rodModel`, interpolation buffer
- motivo: e potente ma ha una superficie API ampia e in parte sovrapposta al reactive core
- obiettivo: chiarire il ruolo di `rod` e allinearlo meglio al resto del sistema

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

Fase 2: Reactive
- documentare il contratto di `signal/effect`
- decidere come gestire dispose, nested effect, scheduling e loop protection

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
