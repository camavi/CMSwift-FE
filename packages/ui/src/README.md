## UI Source Modules

This folder contains the modular source structure of the CMSwift UI layer.

Current status:

- a dedicated build exists: `npm run build:ui`
- the old `ui.js` monolith has been split into modules under `packages/ui/src/*`
- `99-legacy-ui.js` is no longer used in the build
- public runtime output is generated into `packages/ui/dist/`
- a compatibility mirror remains in `pages/_cmswift-fe/js/`

Manifest:

- `modules.json`

Build command:

```bash
npm run build:ui
```

Generated output:

- `packages/ui/dist/ui.js`
- `packages/ui/dist/min-ui.js`
- CSS, font, and image assets in `packages/ui/dist/`

Recommended module order:

- `00-bootstrap.js`
- `01-foundation-helpers.js`
- `10-primitives-layout.js`
- `20-display-content.js`
- `21-list-content.js`
- `22-banner-content.js`
- `23-tooltip.js`
- `31-form-advanced.js`
- `40-navigation.js`
- `41-tab-panel.js`
- `50-feedback.js`
- `51-feedback-service.js`
- `60-shell-app.js`
- `61-form-service.js`
- `70-dialog.js`
- `71-menu-overlays.js`
- `80-data.js`

Planned families:

- bootstrap/helpers:
  rod path proxy, argument normalization, shared helpers, meta/dev wrapping
- primitives/layout:
  `Row`, `Col`, `Spacer`, `Container`, `Card`, `Footer`, `Toolbar`, `Grid`, `GridCol`, `FormField`, `InputRaw`, `Input`, `Select`
- display/content:
  `Icon`, `Badge`, `Avatar`, `Chip`
- list/content:
  `List`, `Item`, `Separator`
- banner/content:
  `Banner`
- tooltip:
  `Tooltip`
- advanced form:
  `Checkbox`, `Radio`, `Toggle`, `Slider`, `Rating`, `Date`, `Time`
- navigation:
  `Tabs`, `RouteTab`, `Breadcrumbs`, `Pagination`
- tab panel:
  `TabPanel`
- docs:
  `ComponentDocs`
- feedback:
  `Spinner`, `Progress`, `LoadingBar`, `Notify`
- feedback service:
  toast root, timers, update/remove/clear, notify shortcuts
- shell/app:
  `Header`, `Drawer`, `Page`, `AppShell`, `Parallax`
- form/service:
  `CMSwift.form`, `CMSwift.useForm`, `Form`, `cardHeader`, `cardBody`, `cardFooter`, dialog bootstrap
- dialog:
  `Dialog`
- menu/overlays:
  `Menu`, `Popover`, `ContextMenu`
- data:
  `Table`

Rules:

- migrate one family at a time
- rebuild the UI package
- verify against the relevant demos
- update `docs/reference/ui.md`

Notes:

- `packages/ui/src/` is the source of truth
- `99-legacy-ui.js` has been removed; the bundle is built only from the manifest modules
- when a family was not contiguous in the legacy file, the migration followed the real source order
