# Local Demo Pages

Questa cartella contiene la demo locale minimale del framework: poche pagine HTML, asset runtime compatibili e smoke visuale rapido.

## Stato

- `pages/index.html`
  landing locale con accesso a UI, CMSwift e developer view
- `pages/ui.html`
  demo UI con piccoli esempi reali
- `pages/cmswift.html`
  demo core con signal, computed, batch e component
- `pages/developers.html`
  pagina narrativa pensata per presentare il framework a developer
- `pages/tutorial/`
  placeholder vuoto, senza tutorial attivi

## Regola

Nuove modifiche al framework non devono partire da qui se riguardano core o UI: la source of truth resta in `packages/core/src` e `packages/ui/src`.

Questa cartella resta utile per:

- demo locali veloci
- runtime mirror compatibile
- smoke test manuali HTML
