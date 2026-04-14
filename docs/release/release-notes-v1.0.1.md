# CMSwift v1.0.1 Release Notes

Status:

- published on npm
- patch release focused on consolidation after the first package-oriented release layout

## Summary

`v1.0.1` is the first CMSwift release published and verified in a real npm and browser project.

Included packages:

- `@cmswift/core@1.0.1`
- `@cmswift/ui@1.0.1`
- `cmswift@1.0.1`

## Included In v1.0.1

Core:

- safe bootstrap even when `window.CMSwift_setting` is not defined
- safe fallback behavior for HTTP configuration

UI:

- package aligned to `@cmswift/core@^1.0.1`
- CSS exports verified in a real npm installation

Umbrella:

- `cmswift` published as a single-package distribution
- self-contained `dist/` with:
  - `cmswift.js`
  - `min-cmswift.js`
  - CSS
  - fonts
  - images

## Distribution

npm:

- `@cmswift/core`
- `@cmswift/ui`
- `cmswift`

Readable:

- `packages/core/dist/cms.js`
- `packages/ui/dist/ui.js`
- `packages/cmswift/dist/cmswift.js`

Minified:

- `packages/core/dist/min-cms.js`
- `packages/ui/dist/min-ui.js`
- `packages/cmswift/dist/min-cmswift.js`

## Validation

Executed checks:

- repository runtime build
- real npm test with `@cmswift/core + @cmswift/ui`
- real npm test with the single package `cmswift`
- browser/Vite build in the external test project

## Notes

`v1.0.1` is the first truly consumable public package baseline for the framework.

Still recommended:

- pin versions on npm and CDN
- use Vite or an equivalent browser-oriented environment
- upgrade Node to `20.19+` to match modern Vite requirements
