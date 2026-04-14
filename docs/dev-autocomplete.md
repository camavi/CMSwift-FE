# VS Code Autocomplete for CMSwift UI

This project generates a global `UI` namespace definition so VS Code can provide IntelliSense for the CMSwift UI library.

## How to generate

Run once:

```sh
npm run gen:ui-dts
```

Run in watch mode:

```sh
npm run gen:ui-dts:watch
```

## How it works

- `cms-dev/generate-ui-dts.mjs` generates `types/cmswift-ui.d.ts`.
- By default it scans JS sources under `src/`, `_cmswift/`, and `pages/_cmswift-fe/js` when those directories exist.
- In this repository the practical runtime source for autocomplete is the generated mirror under `pages/_cmswift-fe/js`.
- It looks for `UI.X = ...`, `export function X`, and `export const X = ...` patterns.
- It extracts JSDoc, destructured prop keys, and basic defaults to build prop types.
- Output goes to `types/cmswift-ui.d.ts` and is included by `jsconfig.json`.
