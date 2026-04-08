# CMSwift

CMSwift e un framework UI + runtime reattivo leggero per applicazioni web, con:
- core DOM/reactivity custom
- componenti UI pronti all'uso
- build runtime leggibile e minificata
- demo/tutorial locali per verificare il comportamento reale

Stato attuale:
- progetto interno ben strutturato
- pre-release `v1` in preparazione
- package allineato a `1.0.0`
- non ancora dichiarato come prodotto pubblico stabile su tutta la superficie API

## Cosa Include

Core:
- renderer DOM
- reactive core
- `rod` bindings/model
- lifecycle, mount, cleanup
- router, http, auth, overlay, store

UI:
- layout e shell app
- form controls
- navigation
- feedback
- data display
- overlay components

## Entry Point Runtime

Sviluppo / debug:
- [cms.js](/Users/cmalleux/Sites/CMSwift-FE/pages/_cmswift-fe/js/cms.js)
- [ui.js](/Users/cmalleux/Sites/CMSwift-FE/pages/_cmswift-fe/js/ui.js)

Produzione:
- [min-cms.js](/Users/cmalleux/Sites/CMSwift-FE/pages/_cmswift-fe/js/min-cms.js)
- [min-ui.js](/Users/cmalleux/Sites/CMSwift-FE/pages/_cmswift-fe/js/min-ui.js)

Build:
```bash
npm run build:runtime
```

## Quick Start

Con i file runtime standard:

```html
<link rel="stylesheet" href="/pages/_cmswift-fe/css/base.css" />
<link rel="stylesheet" href="/pages/_cmswift-fe/css/ui.css" />

<script src="/pages/_cmswift-fe/js/cms.js"></script>
<script src="/pages/_cmswift-fe/js/ui.js"></script>
```

Con i file minificati:

```html
<link rel="stylesheet" href="/pages/_cmswift-fe/css/base.css" />
<link rel="stylesheet" href="/pages/_cmswift-fe/css/ui.css" />

<script src="/pages/_cmswift-fe/js/min-cms.js"></script>
<script src="/pages/_cmswift-fe/js/min-ui.js"></script>
```

Esempio minimo:

```html
<div id="app"></div>
<script>
  const root = document.getElementById("app");

  _.mount(root, _.Layout({
    header: _.Header({ title: "CMSwift" }),
    page: _.Page(
      _.Card(
        _.cardBody(
          _.Input({ label: "Name" }),
          _.Btn({ color: "primary" }, "Save")
        )
      )
    )
  }));
</script>
```

## Stable vs Unstable

Piu stabili oggi:
- renderer core
- reactive core
- `rod` base
- lifecycle / mount / cleanup
- layout base
- componenti UI principali

Da considerare ancora `unstable` o `experimental` finche non chiudiamo la pre-release `v1`:
- overlay avanzati: `Tooltip`, `Dialog`, `Menu`, `Popover`, `ContextMenu`
- picker `Date` e `Time`
- `UI.meta` e dev helpers come API pubblica stabile
- messaging pubblico finale su `rod` vs `reactive`

## Stable API Surface

Per la `v1`, la superficie da considerare piu stabile e questa:

Core:
- renderer DOM
- `CMSwift.reactive`
- lifecycle base (`mount`, `component`, cleanup)
- runtime outputs ufficiali

State / binding:
- `rod` per model e binding UI
- form controls principali gia consolidati

UI:
- layout base
- input/select base
- checkbox/radio/toggle consolidati
- navigation base
- feedback base
- table base

Contratto pratico:
- questa superficie non dovrebbe rompere in `PATCH` o `MINOR`
- eventuali breaking change qui devono seguire la policy in [policy_CMSwift_stability.md](/Users/cmalleux/Sites/CMSwift-FE/policy_CMSwift_stability.md)

## Known Limits

Limiti da tenere presenti oggi:
- overlay avanzati ancora piu sensibili a edge case reali di focus, anchor e close rules
- `Date` e `Time` non ancora da considerare superficie completamente stabilizzata
- `UI.meta` e dev helpers non sono ancora da trattare come API pubblica stabile
- il posizionamento pubblico finale di `rod` vs `reactive` e definito a livello policy, ma la narrativa di prodotto puo ancora essere rifinita
- la copertura automatica del core e buona, ma la release `v1` richiede comunque smoke test browser espliciti

## Documentazione Interna

Riferimenti attuali:
- [readme_CMS.md](/Users/cmalleux/Sites/CMSwift-FE/readme_CMS.md)
- [readme_UI.md](/Users/cmalleux/Sites/CMSwift-FE/readme_UI.md)
- [policy_CMSwift_stability.md](/Users/cmalleux/Sites/CMSwift-FE/policy_CMSwift_stability.md)
- [release_CMSwift_v1.md](/Users/cmalleux/Sites/CMSwift-FE/release_CMSwift_v1.md)

Demo/tutorial:
- [index.html](/Users/cmalleux/Sites/CMSwift-FE/pages/index.html)

## Roadmap Immediata

Prima di dichiarare `v1`:
- chiudere la checklist pre-release
- scrivere release notes iniziali
- eseguire smoke test browser di release

## Nota

Questo repository oggi e pronto per lavoro serio e verifica tecnica.
Per una `v1` pubblica manca soprattutto il contratto di prodotto, non una rifondazione del framework.
