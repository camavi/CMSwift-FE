# Changelog

Tutte le modifiche rilevanti di CMSwift verranno documentate qui.

Il formato segue in modo pragmatico:
- Added
- Changed
- Fixed
- Docs

## [1.0.0] - draft

### Added
- modularizzazione completa del core in `packages/core/src`
- modularizzazione completa del layer UI in `packages/ui/src`
- build runtime standard e minificata:
  - `cms.js`
  - `min-cms.js`
  - `ui.js`
  - `min-ui.js`
- bundle umbrella `cmswift.js` e `min-cmswift.js`
- documentazione interna per core e UI
- checklist pre-release `v1`
- policy di stabilita e compatibilita
- smoke checklist browser di release
- prima bozza di release notes `v1.0.0`

### Changed
- consolidata la struttura del renderer
- consolidato il reactive core
- riallineato `rod` al bridge DOM e ai form controls
- separati i moduli platform e i moduli UI in file sorgente dedicati

### Fixed
- CSS custom properties nel renderer
- semantica di remove/update props
- children dinamici, classi, eventi e cleanup
- casi rari dei form controls
- bug reali emersi da demo e test del core

### Docs
- aggiunto `README.md` pubblico
- aggiunti `docs/reference/core.md` e `docs/reference/ui.md` come riferimenti tecnici
- aggiunto `LICENSE`

## [1.0.1] - 2026-04-14

### Fixed
- bootstrap del core ora parte anche senza `window.CMSwift_setting`
- configurazione HTTP del core ora usa fallback sicuri quando la config globale non esiste
- consumo npm browser-first piu robusto nei progetti che importano `@cmswift/core` senza setup legacy

## Note

La release `1.0.0` resta draft finche non sono chiusi:
- smoke test browser
- versione ufficiale del package
- release gate finale
