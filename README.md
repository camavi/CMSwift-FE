# CMSwift

<p align="center">
  <img src="pages/_cmswift-fe/img/logo.svg" alt="CMSwift logo" width="112" />
</p>

CMSwift is a lightweight, browser-first web framework with:

- a custom DOM and reactivity core
- a composable UI layer
- readable and minified bundles
- separate packages for progressive adoption

Published packages:

- `@cmswift/core`
- `@cmswift/ui`
- `cmswift`

## Which Package To Use

- `@cmswift/core`
  if you want the renderer, `signal`, `computed`, `effect`, `rod`, lifecycle helpers, and platform modules without the UI layer
- `@cmswift/ui`
  if you want the UI components on top of `@cmswift/core`
- `cmswift`
  if you want a single package with everything included

## Installation

Core only:

```bash
npm install @cmswift/core
```

Core + UI:

```bash
npm install @cmswift/core @cmswift/ui
```

Single package:

```bash
npm install cmswift
```

## CDN

Single package via jsDelivr:

```html
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/cmswift@1.0.5/dist/css/ui.css"
/>
<script src="https://cdn.jsdelivr.net/npm/cmswift@1.0.5/dist/cmswift.js"></script>
```

Minified single package:

```html
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/cmswift@1.0.5/dist/css/ui.min.css"
/>
<script src="https://cdn.jsdelivr.net/npm/cmswift@1.0.5/dist/cmswift.min.js"></script>
```

Split core + UI via jsDelivr:

```html
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/@cmswift/ui@1.0.5/dist/css/ui.css"
/>
<script src="https://cdn.jsdelivr.net/npm/@cmswift/core@1.0.5/dist/cms.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@cmswift/ui@1.0.5/dist/ui.js"></script>
```

Minified split core + UI:

```html
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/@cmswift/ui@1.0.5/dist/css/ui.min.css"
/>
<script src="https://cdn.jsdelivr.net/npm/@cmswift/core@1.0.5/dist/cms.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@cmswift/ui@1.0.5/dist/ui.min.js"></script>
```

For production:

- pin explicit versions, for example `@1.0.5`
- prefer minified bundles when you do not need readable builds
- use `dist/cmswift.min.js` or `dist/min-cmswift.js` for `cmswift`
- use `dist/cms.min.js` and `dist/ui.min.js` for split core and UI

## Quick Start

Example with the single package:

```js
import "cmswift";
import "cmswift/css/ui.css";

const _ = window._;
const root = document.getElementById("app");

const count = _.rod(0);

_.mount(
  root,
  _.Card(
    _.cardBody(
      _.h1("CMSwift"),
      _.Btn(
        {
          color: "primary",
          onClick: () => (count.value += 1),
        },
        "Count +1",
      ),
      _.p(() => `Current count: ${count}`),
    ),
  ),
);
```

Minimal HTML:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>CMSwift app</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="./main.js"></script>
  </body>
</html>
```

## Using `@cmswift/core` + `@cmswift/ui`

```js
import "@cmswift/core";
import "@cmswift/ui";
import "@cmswift/ui/css/ui.css";
```

## Theme Helper

Use the theme helpers to control `data-theme` on the root `html` element:

```js
CMSwift.setTheme("dark");
CMSwift.getTheme();
CMSwift.toggleTheme(["light", "dark", "sepia"]);
```

This sets `data-theme` on `<html>`:

```html
<html data-theme="dark">
```

Behavior:

- `CMSwift.setTheme(theme)` applies the theme and persists it to `localStorage`
- `CMSwift.getTheme()` reads the current theme from `html[data-theme]`, with fallback to the saved value
- `CMSwift.toggleTheme(themes)` cycles through any number of themes, not only `light/dark`
- on startup, CMSwift restores the saved theme automatically if one exists

If you want multi-theme toggling without passing the list every time, set:

```js
CMSwift.theme.themes = ["light", "dark", "sepia", "midnight"];
CMSwift.toggleTheme();
```

## Available CSS Exports

With `@cmswift/ui`:

- `@cmswift/ui/css/ui.css`
- `@cmswift/ui/css/min-ui.css`
- `@cmswift/ui/css/ui.min.css`
- `@cmswift/ui/css/base.css`
- `@cmswift/ui/css/responsive.css`
- `@cmswift/ui/css/animation.css`
- `@cmswift/ui/css/ui-components.css`
- `@cmswift/ui/css/docs.css`

With `cmswift`:

- `cmswift/css/ui.css`
- `cmswift/css/min-ui.css`
- `cmswift/css/ui.min.css`
- `cmswift/css/base.css`
- `cmswift/css/responsive.css`
- `cmswift/css/animation.css`
- `cmswift/css/ui-components.css`
- `cmswift/css/docs.css`

## Brand Asset

The official CMSwift logo is available as a lightweight SVG:

- local demo/runtime asset: `/_cmswift-fe/img/logo.svg`
- published UI package asset: `@cmswift/ui/img/logo.svg`
- published umbrella package asset: `cmswift/img/logo.svg`

## Repository Structure

- `packages/core`
  renderer, reactive core, `rod`, lifecycle, and platform modules
- `packages/ui`
  UI components plus CSS, font, and image assets
- `packages/cmswift`
  umbrella bundle with JS, CSS, and assets included
- `pages`
  local HTML demos and manual smoke coverage
- `docs`
  technical reference, policy, and release material

## Repository Commands

Runtime build:

```bash
npm run build:runtime
```

Local dev:

```bash
npm run dev
```

Automated tests:

```bash
npm test
```

UI autocomplete generation:

```bash
npm run gen:ui-dts
```

## Runtime Outputs

- `packages/core/dist/cms.js`
- `packages/core/dist/min-cms.js`
- `packages/core/dist/cms.min.js`
- `packages/ui/dist/ui.js`
- `packages/ui/dist/min-ui.js`
- `packages/ui/dist/ui.min.js`
- `packages/ui/dist/css/ui.css`
- `packages/ui/dist/css/min-ui.css`
- `packages/ui/dist/css/ui.min.css`
- `packages/cmswift/dist/cmswift.js`
- `packages/cmswift/dist/min-cmswift.js`
- `packages/cmswift/dist/cmswift.min.js`

## Documentation

- [Docs Index](docs/README.md)
- [Core Reference](docs/reference/core.md)
- [UI Reference](docs/reference/ui.md)
- [Stability Policy](docs/policy/stability.md)
- [Release Notes v1.0.20](docs/release/release-notes-v1.0.20.md)
- [Release Notes v1.0.19](docs/release/release-notes-v1.0.19.md)
- [Release Notes v1.0.18](docs/release/release-notes-v1.0.18.md)
- [Release Notes v1.0.17](docs/release/release-notes-v1.0.17.md)
- [Release Notes v1.0.16](docs/release/release-notes-v1.0.16.md)
- [Release Notes v1.0.15](docs/release/release-notes-v1.0.15.md)
- [Release Notes v1.0.14](docs/release/release-notes-v1.0.14.md)
- [Release Notes v1.0.13](docs/release/release-notes-v1.0.13.md)
- [Release Notes v1.0.12](docs/release/release-notes-v1.0.12.md)
- [Release Notes v1.0.11](docs/release/release-notes-v1.0.11.md)
- [Release Notes v1.0.10](docs/release/release-notes-v1.0.10.md)
- [Release Notes v1.0.9](docs/release/release-notes-v1.0.9.md)
- [Release Notes v1.0.8](docs/release/release-notes-v1.0.8.md)
- [Release Notes v1.0.7](docs/release/release-notes-v1.0.7.md)
- [Release Notes v1.0.5](docs/release/release-notes-v1.0.5.md)
- [Release Notes v1.0.4](docs/release/release-notes-v1.0.4.md)
- [Release Notes v1.0.3](docs/release/release-notes-v1.0.3.md)
- [Release Notes v1.0.2](docs/release/release-notes-v1.0.2.md)
- [Release Notes v1.0.1](docs/release/release-notes-v1.0.1.md)
- [Release Plan v1](docs/release/release-plan-v1.md)
- [Release Notes v1.0.0 Archive](docs/release/release-notes-v1.0.0.md)
- [Smoke Checklist v1](docs/release/smoke-v1.md)
- [Changelog](CHANGELOG.md)

## Notes

- `packages/*/src` is the source of truth for framework code
- the packages are browser-first and are meant for browser or Vite-style environments, not pure Node without a DOM
- `pages/` is not editorial documentation; it exists only for local demos and compatibility smoke coverage
