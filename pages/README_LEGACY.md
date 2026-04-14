# Local Pages

Questa cartella contiene entrypoint HTML locali, asset compatibili e sample rapidi per lo sviluppo del framework.

## Stato

- `pages/index.html`
  entrypoint locale minimale
- `pages/tutorial/`
  placeholder vuoto, senza tutorial attivi

## Regola

Nuove modifiche al framework non devono partire da qui se riguardano core o UI: la source of truth resta in `packages/core/src` e `packages/ui/src`.

Questa cartella resta utile per:

- demo locali veloci
- runtime mirror compatibile
- smoke test manuali HTML
