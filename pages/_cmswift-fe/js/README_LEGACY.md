# Runtime JS Mirror

This folder only contains a compatible mirror of the runtime outputs used by the local demo under `pages/`.

## Source Of Truth

- core source: [packages/core/src](/Users/cmalleux/Sites/CMSwift-FE/packages/core/src)
- UI source: [packages/ui/src](/Users/cmalleux/Sites/CMSwift-FE/packages/ui/src)
- built runtimes: [packages/core/dist](/Users/cmalleux/Sites/CMSwift-FE/packages/core/dist), [packages/ui/dist](/Users/cmalleux/Sites/CMSwift-FE/packages/ui/dist), [packages/cmswift/dist](/Users/cmalleux/Sites/CMSwift-FE/packages/cmswift/dist)

## Rules

- do not recreate legacy source files in this folder
- this tree remains only as a compatibility mirror of built files
- `packages/*/dist` remains the source of truth for publishable bundles
