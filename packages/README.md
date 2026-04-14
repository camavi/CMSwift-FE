# CMSwift Packages

Questa cartella contiene la nuova struttura package-oriented del framework.

## Package

- `packages/core`
  renderer, reactive core, rod, lifecycle e moduli platform
- `packages/ui`
  componenti UI e asset CSS/font/img costruiti sopra `@cmswift/core`
- `packages/cmswift`
  package umbrella per chi vuole caricare tutto insieme

## Regola

Da qui in avanti:

- la source of truth del framework deve convergere in `packages/*/src`
- gli output pubblicabili devono uscire in `packages/*/dist`
- `pages/_cmswift-fe/` resta solo compatibilita legacy durante la migrazione

## Documentazione

- `../README.md`
- `../docs/reference/core.md`
- `../docs/reference/ui.md`
- `../docs/policy/stability.md`
