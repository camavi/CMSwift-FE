# CMSwift Tutorial

## Obiettivo

Costruire un tutorial completo, progressivo e molto accurato che faccia vedere la potenza reale di CMSwift senza modificare il core del framework.

Il tutorial deve mostrare:

- come si scrive markup con helper `_.tag`
- come funziona la reattivita del core
- come `_.rod` semplifica il binding UI
- come i componenti UI possono convivere con HTML nativo
- come usare router, store, http, overlay e auth dal layer pubblico
- come comporre pagine grandi senza perdere leggibilita
- come mantenere cleanup, lifecycle e struttura modulare

## Principi Editoriali

- Ogni pagina deve insegnare una cosa principale.
- Ogni pagina deve avere spiegazione, esempio e risultato visibile.
- Gli esempi devono usare solo API pubbliche `_.…` o `CMSwift.…` gia esposte.
- Nessun tutorial deve richiedere modifiche a `cms.js`, `ui.js`, CSS core o al renderer.
- Il tutorial deve essere leggibile anche da chi inizia, ma abbastanza profondo da mostrare il framework in contesti reali.

## Cosa Deve Emergere Sul Framework

### 1. Renderer dichiarativo

- Helper HTML e SVG con sintassi coerente
- Props, style, children, eventi e funzioni reattive
- Stessa API per elementi nativi e componenti custom

### 2. Core reattivo

- `_.signal`
- `_.computed`
- `_.effect`
- `_.untracked`
- `_.batch`

### 3. Binding ad alto livello

- `_.rod`
- model binding nei componenti UI
- lettura e scrittura semplice di stato annidato

### 4. Component model

- `_.component`
- `ctx.onDispose`
- composizione modulare
- separazione tra stato, view e side effect

### 5. UI layer

- componenti gia pronti
- layout complessi senza boilerplate
- coerenza tra HTML nativo e componenti CMSwift

### 6. Platform layer

- router
- store
- http
- overlay
- auth
- ui meta e documentazione

### 7. Architettura

- piccolo per il caso semplice
- scalabile per casi applicativi reali
- estendibile senza patchare il core

## Roadmap Tutorial

### Fase 1. Overview

- [x] Pagina introduttiva del framework
- [x] Mappa concettuale dei layer
- [x] Demo live minima che unisce HTML, stato e UI

### Fase 2. Renderer

- [x] Helper HTML
- [x] Props e attributi
- [x] Eventi
- [x] Children dinamici
- [x] SVG helpers

### Fase 3. Reactive Core

- [x] Signal
- [x] Computed
- [x] Effect
- [x] Cleanup
- [x] Batch
- [x] Untracked

### Fase 4. Rod

- [x] Stato semplice
- [x] Stato annidato
- [x] Binding con Input
- [x] Binding con Checkbox, Radio, Select
- [x] Uso in componenti reali

### Fase 5. Componenti e Lifecycle

- [x] `_.component`
- [x] `ctx`
- [x] `ctx.onDispose`
- [x] componenti piccoli e componenti composti

### Fase 6. UI Composition

- [x] Layout
- [x] Page
- [x] Header / Footer / Drawer
- [x] Card / List / Form
- [x] Pattern di composizione reali

### Fase 7. Platform

- [x] Router
- [x] Store
- [x] HTTP
- [x] Overlay
- [x] Auth

### Fase 8. Real App Patterns

- [x] Dashboard
- [x] Pagina form avanzata
- [x] Workspace con filtri
- [x] Pagina docs / admin / operations

## Struttura File Consigliata

- `pages/tutorial/cmswift/TUTORIAL.md`
- `pages/tutorial/cmswift/cmswift-intro.cms.js`
- `pages/tutorial/cmswift/cmswift-shared.js`
- `pages/tutorial/cmswift/cmswift-architecture.cms.js`
- `pages/tutorial/cmswift/cmswift-renderer.cms.js`
- `pages/tutorial/cmswift/cmswift-reactive-core.cms.js`
- `pages/tutorial/cmswift/cmswift-rod.cms.js`
- `pages/tutorial/cmswift/cmswift-components.cms.js`
- `pages/tutorial/cmswift/cmswift-ui.cms.js`
- `pages/tutorial/cmswift/cmswift-platform-overview.cms.js`
- `pages/tutorial/cmswift/cmswift-patterns.cms.js`

## Sezioni Implementate

- Introduction
- Architecture
- Renderer
- Reactive Core
- Rod Binding
- Components & Lifecycle
- UI Composition
- Platform
- App Patterns

## Nota Operativa

Il tutorial CMSwift resta indipendente:

- non modifica il framework
- non altera gli helper core
- non cambia CSS o JS globali
- aggiunge solo pagine e contenuti tutoriali
