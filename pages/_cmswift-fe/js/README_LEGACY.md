# Legacy JS Mirror

Questa cartella contiene solo gli output runtime legacy compatibili con il vecchio shell sotto `pages/`.

## Source Of Truth

- core sorgente: [packages/core/src](/Users/cmalleux/Sites/CMSwift-FE/packages/core/src)
- ui sorgente: [packages/ui/src](/Users/cmalleux/Sites/CMSwift-FE/packages/ui/src)
- runtime buildati: [packages/core/dist](/Users/cmalleux/Sites/CMSwift-FE/packages/core/dist), [packages/ui/dist](/Users/cmalleux/Sites/CMSwift-FE/packages/ui/dist), [packages/cmswift/dist](/Users/cmalleux/Sites/CMSwift-FE/packages/cmswift/dist)

## Regola

- non ricreare sorgenti legacy in questa cartella
- questo albero resta un mirror compatibile dei file buildati
- i package `packages/*/dist` restano la source of truth dei bundle pubblicabili
