# Changelog

All significant CMSwift changes are documented here.

The format is kept intentionally simple:

- Added
- Changed
- Fixed
- Docs

## [1.0.1] - 2026-04-14

### Added

- npm publish of `@cmswift/core`
- npm publish of `@cmswift/ui`
- npm publish of the umbrella package `cmswift`
- public README coverage for npm and CDN usage
- a self-contained `cmswift` package tarball with `dist/cmswift.js`, CSS, and bundled assets

### Fixed

- core bootstrap now works even when `window.CMSwift_setting` is not defined
- core HTTP configuration now uses safe fallbacks when the global config is missing
- browser-first npm consumption is more robust in projects that import `@cmswift/core` without legacy setup
- CSS exports in `cmswift` now point only to files inside the package
- umbrella package build now includes aligned JS, CSS, fonts, and images

### Docs

- updated the public quick start for `@cmswift/core`, `@cmswift/ui`, and `cmswift`
- added dedicated release notes for `v1.0.1`
- reclassified `v1.0.0` release material as historical pre-release archive

## [1.0.0] - historical pre-release baseline

### Added

- full core modularization under `packages/core/src`
- full UI layer modularization under `packages/ui/src`
- standard and minified runtime builds:
  - `cms.js`
  - `min-cms.js`
  - `ui.js`
  - `min-ui.js`
- umbrella bundles `cmswift.js` and `min-cmswift.js`
- internal technical documentation for core and UI
- `v1` pre-release checklist
- stability and compatibility policy
- browser smoke checklist for release
- first `v1.0.0` release notes baseline

### Changed

- consolidated renderer structure
- consolidated reactive core
- realigned `rod` with the DOM bridge and form controls
- split platform modules and UI modules into dedicated source files

### Fixed

- CSS custom property handling in the renderer
- prop removal and update semantics
- dynamic children, class handling, event cleanup, and general cleanup paths
- rare form-control edge cases
- real bugs surfaced by demos and core tests

### Docs

- added the public `README.md`
- added `docs/reference/core.md` and `docs/reference/ui.md` as technical references
- added `LICENSE`

## Notes

The `1.0.0` release remains the historical pre-release baseline.
The first release published and consumed through npm in this repository is `1.0.1`.
