# Foundry — agent notes (interim, hand-written)

This file is hand-maintained for now. A later milestone replaces it with a
compiled projection from a canonical, tool-agnostic rules source. Expect this
file's structure to change wholesale then; that's not drift.

## What this repository is, right now

Three packages, plus a template tree with a real component library inside
it. Milestone 3 (the artifact generator) is complete, and all three packages
are published and installable from npm. See the root README's "Publishing
status" section for current versions and the release process.

- `packages/generator-core`: a framework-agnostic engine. Runs interactive
  prompts, renders a template directory into a target directory with
  `{{variable}}` substitution in both file contents and file/directory names,
  calls `beforeRender`/`afterRender` lifecycle hooks. It has no concept of
  "projects" or "components" — those are just different `GeneratorDefinition`s
  built on top of it. Also exports small CLI-only helpers (`parseFlag`, error
  reporting) shared by both CLIs below, so neither reimplements them.
- `packages/create-react-foundry`: the actual `create-react-foundry` npm
  package. The published name is load-bearing — `npm create react-foundry`
  only works if the package is literally named `create-react-foundry`.
  Scaffolds a new project once. Its template lives at
  `packages/create-react-foundry/templates/base`, a working component library
  (tokens, Button, Input, Storybook, CI), not a stub.
- `packages/cli`: the `@foundryui/cli` package, bin name `foundry`. The
  ongoing, in-project CLI a scaffolded project depends on afterward.
  `foundry generate component <Name>` is the only registered artifact type;
  `packages/cli/src/generators/index.ts` is where a second type gets added.

## Conventions the generated component library follows

Documented as ADRs in `docs/adr/`: component API shape, styling, folder
structure, testing strategy. These govern what `packages/cli`'s generator
produces. Read them before changing the generator or hand-editing Button or
Input in the template.

## Hard rules

- `packages/generator-core` must never import from any of its own consumers
  (`packages/create-react-foundry`, `packages/cli`, or any future CLI).
  Enforced by `.dependency-cruiser.cjs` and `pnpm lint:deps`. A violation is
  a build failure, not a lint warning to ignore.
- Files under any `templates/` directory aren't TypeScript/JSON/CSS to lint,
  format, or type-check as-is. They contain literal `{{variable}}`
  placeholders and are excluded from ESLint, Biome, and TypeScript project
  references on purpose (see the `templates/**` ignores in the root
  `eslint.config.js` and `biome.json`).
- Biome formats. ESLint lints. Don't reach for Prettier, and don't enable
  Biome's linter.
- Module resolution isn't uniform across this repo, on purpose. Node-executed
  packages (`generator-core`, `create-react-foundry`, `cli`) use `NodeNext`,
  inherited from the root `tsconfig.base.json`. Bundler-consumed packages,
  `packages/react` inside the template and its `apps/storybook`, override to
  `Bundler` resolution. Getting this backwards produces real, confusing type
  errors (it happened once, against `@testing-library/user-event`'s dual
  CJS/ESM exports), so check which category a new package falls into before
  copying a neighboring `tsconfig.json`.
- `packages/react` inside the template builds with Vite in library mode, not
  tsup. tsup can't be made to actually scope CSS Modules class names,
  confirmed empirically, not assumed — see the comment in
  `packages/create-react-foundry/templates/base/packages/react/vite.config.ts`.
  `packages/tokens` and Foundry's own packages have no CSS and stay on tsup.

## Commands

`pnpm build` / `pnpm test` / `pnpm lint` / `pnpm typecheck` / `pnpm format:check`
run via Turborepo across every package. `pnpm lint:deps` runs the
architectural boundary check separately; it's repo-wide, not per-package. See
[CONTRIBUTING.md](./CONTRIBUTING.md) for the full development workflow,
changeset/release process, and PR expectations. This file stays focused on
architecture and hard rules.

Testing a template change end to end requires a real scaffold.
`renderTemplate` unit tests catch substitution bugs, but CSS Modules scoping,
Storybook builds, and the axe a11y gate only get exercised by actually
generating a project and running its pipeline. Do that before considering a
template change done, the same way every milestone so far has.
