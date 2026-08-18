# @foundryui/cli

## 0.2.1

### Patch Changes

- 6d08dff: Adds a README to each published package, shown on its npm page.
- Updated dependencies [6d08dff]
  - @foundryui/generator-core@0.1.1

## 0.2.0

### Minor Changes

- 924df3e: `create-react-foundry` no longer asks for a package scope during scaffolding — most projects never publish anywhere, so it's derived from the project name automatically. Override it with `--package-scope` if you do plan to publish.

  `foundry generate component` now creates components under a category subfolder (`packages/react/src/Atoms/ComponentName/`, `Molecules/`, etc.) instead of directly under `src/`, creating the category folder if it doesn't exist yet. `Button` and `Input` moved to `Atoms/` for consistency. See ADR-0005.

## 0.1.0

### Minor Changes

- Initial release. `foundry generate component <Name>` scaffolds a new component into an existing Foundry project (`.tsx`, `.module.css`, `.stories.tsx`, `.test.tsx`, `index.ts`) and wires it into the barrel export automatically, following the project's `docs/adr/` conventions.
