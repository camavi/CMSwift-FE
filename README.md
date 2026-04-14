# CMSwift

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
  href="https://cdn.jsdelivr.net/npm/cmswift@1.0.1/dist/css/ui.css"
/>
<script src="https://cdn.jsdelivr.net/npm/cmswift@1.0.1/dist/cmswift.js"></script>
```

Split core + UI via jsDelivr:

```html
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/@cmswift/ui@1.0.1/dist/css/ui.css"
/>
<script src="https://cdn.jsdelivr.net/npm/@cmswift/core@1.0.1/dist/cms.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@cmswift/ui@1.0.1/dist/ui.js"></script>
```

For production:

- pin explicit versions, for example `@1.0.1`
- prefer minified bundles when you do not need readable builds
- use `dist/min-cmswift.js` for `cmswift`
- use `dist/min-cms.js` and `dist/min-ui.js` for split core and UI

## Quick Start

Example with the single package:

```js
import "cmswift";
import "cmswift/css/ui.css";

const _ = window._;
const root = document.getElementById("app");

const [count, setCount] = _.signal(0);

_.mount(
  root,
  _.Card(
    _.cardBody(
      _.h1("CMSwift"),
      _.Btn(
        {
          color: "primary",
          onClick: () => setCount(count() + 1),
        },
        "Count +1",
      ),
      _.p(() => `Current count: ${count()}`),
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

const _ = window._;
```

## Available CSS Exports

With `@cmswift/ui`:

- `@cmswift/ui/css/ui.css`
- `@cmswift/ui/css/min-ui.css`
- `@cmswift/ui/css/base.css`
- `@cmswift/ui/css/responsive.css`
- `@cmswift/ui/css/animation.css`
- `@cmswift/ui/css/ui-components.css`
- `@cmswift/ui/css/tabler-icons-out.css`
- `@cmswift/ui/css/docs.css`

With `cmswift`:

- `cmswift/css/ui.css`
- `cmswift/css/min-ui.css`
- `cmswift/css/base.css`
- `cmswift/css/responsive.css`
- `cmswift/css/animation.css`
- `cmswift/css/ui-components.css`
- `cmswift/css/tabler-icons-out.css`
- `cmswift/css/docs.css`

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
- `packages/ui/dist/ui.js`
- `packages/ui/dist/min-ui.js`
- `packages/ui/dist/css/ui.css`
- `packages/ui/dist/css/min-ui.css`
- `packages/cmswift/dist/cmswift.js`
- `packages/cmswift/dist/min-cmswift.js`

## Documentation

- [Docs Index](docs/README.md)
- [Core Reference](docs/reference/core.md)
- [UI Reference](docs/reference/ui.md)
- [Stability Policy](docs/policy/stability.md)
- [Release Notes v1.0.1](docs/release/release-notes-v1.0.1.md)
- [Release Plan v1](docs/release/release-plan-v1.md)
- [Release Notes v1.0.0 Archive](docs/release/release-notes-v1.0.0.md)
- [Smoke Checklist v1](docs/release/smoke-v1.md)
- [Changelog](CHANGELOG.md)

## Notes

- `packages/*/src` is the source of truth for framework code
- the packages are browser-first and are meant for browser or Vite-style environments, not pure Node without a DOM
- `pages/` is not editorial documentation; it exists only for local demos and compatibility smoke coverage
