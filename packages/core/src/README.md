## CMS Source Modules

Questa cartella contiene i sorgenti interni del core CMSwift.

Manifest:
- `modules.json`

Ordine di build attuale:
- `00-bootstrap.js`
- `09-overlay-shared.js`
- `10-overlay.js`
- `15-dom-props.js`
- `16-renderer-shared.js`
- `17-renderer-children.js`
- `18-renderer-args.js`
- `20-renderer.js`
- `30-rod-core.js`
- `31-rod-model.js`
- `32-lifecycle-helpers.js`
- `32-lifecycle.js`
- `33-debug-perf.js`
- `34-rod-devtools.js`
- `39-store-shared.js`
- `40-store-core.js`
- `41-store-extensions.js`
- `42-plugins.js`
- `42a-auth-shared.js`
- `43-auth.js`
- `43a-http-shared.js`
- `44-http.js`
- `45-route-hooks.js`
- `49-router-shared.js`
- `49a-ui-meta-shared.js`
- `50-ui-meta.js`
- `51-can.js`
- `52-router.js`
- `53-footer.js`

Comando di build:
```bash
npm run build:cms
```

Output generati:
- `packages/core/dist/cms.js`
- `packages/core/dist/min-cms.js`
- mirror legacy in `pages/_cmswift-fe/js/`

Regola:
- modificare i file in `packages/core/src/`
- rigenerare il package core
- poi eseguire `npm test`
- aggiornare `docs/reference/core.md` se cambia il contratto tecnico
