# Changelog

All significant CMSwift changes are documented here.

The format is kept intentionally simple:

- Added
- Changed
- Fixed
- Docs

## [1.0.7] - 2026-04-22

### Added

- official CMSwift SVG logo added as a local runtime asset
- package exports for `@cmswift/ui/img/logo.svg` and `cmswift/img/logo.svg`
- demo header branding and SVG favicon coverage across the local pages

### Changed

- demo/runtime settings now point to the local SVG logo instead of remote PNG/ICO assets
- package versions bumped to `1.0.7`

### Docs

- README now shows the official logo and documents the brand asset entry points
- added `v1.0.7` release notes

## [1.0.5] - 2026-04-17

### Added

- baseline styling for native `input` elements in the generated UI CSS
- demo coverage for both `_.input()` and `_.Input()` helpers

### Changed

- `.cms-field > .cms-control` now uses a theme surface background token for better visual separation
- the home page primary CTA was visually aligned with the other entry buttons

### Docs

- added `v1.0.5` release notes

## [1.0.4] - 2026-04-16

### Added

- `CMSwift.getTheme()` to read the active theme from `html[data-theme]` with storage fallback
- `CMSwift.toggleTheme()` to cycle through any number of themes instead of assuming only `light/dark`
- automatic theme restore from `localStorage` during core bootstrap
- core tests for theme persistence and multi-theme toggling

### Changed

- `CMSwift.setTheme()` now persists the selected theme in `localStorage`
- theme helpers are now documented in the public README and core technical reference
- demo theme switching was aligned with the updated runtime helper behavior

### Fixed

- UI toggle styling was adjusted for better consistency in dark theme usage

### Docs

- added `v1.0.4` release notes

## [1.0.3] - 2026-04-15

### Removed

- removed the obsolete icon sprite CSS artifact from generated UI CSS outputs and package exports
- removed Tabler icon sprite CSS from `ui.css`, `min-ui.css`, and `ui.min.css`
- removed the same CSS from the umbrella `cmswift` package output

### Changed

- CSS build now keeps only the active generated CSS files and removes stale CSS outputs
- package versions bumped to `1.0.3`

### Docs

- README CSS export list no longer references the removed icon sprite CSS artifact
- added `v1.0.3` release notes

## [1.0.2] - 2026-04-15

### Added

- conventional minified CDN aliases:
  - `packages/core/dist/cms.min.js`
  - `packages/ui/dist/ui.min.js`
  - `packages/ui/dist/css/ui.min.css`
  - `packages/cmswift/dist/cmswift.min.js`
  - `packages/cmswift/dist/css/ui.min.css`
- package exports for the new minified aliases
- README CDN examples for readable and minified builds

### Changed

- bumped package versions to `1.0.2`
- kept `const _ = window._;` explicit in the README quick start for tooling clarity

### Docs

- added `v1.0.2` release notes

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
