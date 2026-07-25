# Foundry — agent notes (interim, hand-written)

This file is hand-maintained for now. A later milestone replaces it with a
compiled projection from a canonical, tool-agnostic rules source — don't be
surprised if this file's structure changes wholesale then; that's expected,
not drift.

## What this repository is, right now

Two packages exist. Nothing else — no React, no tokens, no component
generator yet. Do not assume any of those exist when reading or writing code
here.

- `packages/generator-core` — a framework-agnostic engine: runs interactive
  prompts, renders a template directory into a target directory with
  `{{variable}}` substitution in both file contents and file/directory names,
  and calls `beforeRender`/`afterRender` lifecycle hooks. It knows nothing
  about "projects" or "components" — those are just different
  `GeneratorDefinition`s built on top of it.
- `packages/create-react-foundry` — the actual `create-react-foundry` npm
  package (published name is load-bearing: `npm create react-foundry` only
  works if the package is literally named `create-react-foundry`). It's the
  first, and currently only, consumer of `generator-core`. Its template lives
  at `packages/create-react-foundry/templates/base`.

## Hard rules

- `packages/generator-core` must never import from `packages/create-react-foundry`
  (or any future CLI/generator package). Enforced by `.dependency-cruiser.cjs`
  and `pnpm lint:deps` — a violation is a build failure, not a lint warning
  to ignore.
- Files under any `templates/` directory are not TypeScript/JSON to be linted
  or type-checked as-is — they contain literal `{{variable}}` placeholders.
  They're excluded from ESLint and TypeScript project references on purpose.
- Biome formats. ESLint lints. Don't reach for Prettier, and don't enable
  Biome's linter.
- NodeNext module resolution is in effect — relative imports need explicit
  `.js` extensions in source even though the files are `.ts`.

## Commands

`pnpm build` / `pnpm test` / `pnpm lint` / `pnpm typecheck` — all run via
Turborepo across every package. `pnpm lint:deps` runs the architectural
boundary check separately (it's repo-wide, not per-package).
