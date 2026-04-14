# CMSwift

CMSwift e un framework web leggero con:

- core DOM/reactivity custom
- layer UI componibile
- output runtime leggibili e minificati
- struttura package-oriented pronta per publish pubblico

## Stato

- repository framework pronto per GitHub
- package structure pronta per `npm` e `CDN`
- release `v1.0.0` ancora in preparazione
- tutorial e landing page mantenuti fuori da questo repo

## Struttura

- `packages/core`
  renderer, reactive core, `rod`, lifecycle e moduli platform
- `packages/ui`
  componenti UI e asset CSS/font/img
- `packages/cmswift`
  bundle umbrella per caricare tutto insieme
- `pages`
  demo HTML locali, smoke manuale e mirror runtime compatibile
- `docs`
  reference tecnica, policy e materiali di release

## Output Runtime

Package dist:

- `packages/core/dist/cms.js`
- `packages/core/dist/min-cms.js`
- `packages/ui/dist/ui.js`
- `packages/ui/dist/min-ui.js`
- `packages/cmswift/dist/cmswift.js`
- `packages/cmswift/dist/min-cmswift.js`

Mirror locale compatibile:

- `pages/_cmswift-fe/js/cms.js`
- `pages/_cmswift-fe/js/min-cms.js`
- `pages/_cmswift-fe/js/ui.js`
- `pages/_cmswift-fe/js/min-ui.js`

## Comandi

Build runtime:

```bash
npm run build:runtime
```

Dev locale:

```bash
npm run dev
```

Test automatici:

```bash
npm test
```

Autocomplete UI:

```bash
npm run gen:ui-dts
```

## Distribuzione

Direzione prevista:

- `@cmswift/core`
- `@cmswift/ui`
- `cmswift`

Fino alla pubblicazione effettiva, il riferimento pratico sono i file in `packages/*/dist`.

## Documentazione

- [Docs Index](docs/README.md)
- [Core Reference](docs/reference/core.md)
- [UI Reference](docs/reference/ui.md)
- [Stability Policy](docs/policy/stability.md)
- [Release Plan v1](docs/release/release-plan-v1.md)
- [Release Notes v1.0.0](docs/release/release-notes-v1.0.0.md)
- [Smoke Checklist v1](docs/release/smoke-v1.md)
- [Changelog](CHANGELOG.md)

## Note

- `packages/*/src` e la source of truth del framework
- `pages/` non e documentazione editoriale: serve solo per demo e compatibilita locale
- `pages/tutorial/` resta volutamente vuota
