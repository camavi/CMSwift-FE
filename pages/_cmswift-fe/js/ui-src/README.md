## UI Source Modules

Questa cartella guida e ospita la modularizzazione progressiva del layer UI di CMSwift.

Stato attuale:

- la build dedicata esiste: `npm run build:ui`
- il monolite `ui.js` e stato spezzato in moduli `ui-src/*`
- `99-legacy-ui.js` non e piu usato nella build
- l'output runtime resta `pages/_cmswift-fe/js/ui.js`

Manifest:

- `modules.json`

Comando di build:

```bash
npm run build:ui
```

Output generato:

- `pages/_cmswift-fe/js/ui.js`

Ordine di migrazione consigliato:

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

Famiglie previste:

- bootstrap/helpers:
  rod path proxy, normalize args, helper condivise, wrapping meta/dev
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
- form advanced:
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

Regola di lavoro:

- prima si sposta una famiglia alla volta
- poi si rigenera `ui.js`
- poi si verifica con demo/tutorial rilevanti
- infine si aggiorna `readme_UI.md`

Nota:

- da questo punto la source of truth e `ui-src/`
- `99-legacy-ui.js` e stato rimosso: il bundle viene composto solo dai moduli elencati nel manifest
- quando una famiglia non era contigua nel legacy, la migrazione e stata chiusa seguendo l'ordine reale del file

