# Contributing to Foundry

Thanks for considering a contribution. This document covers development
setup, the conventions the codebase follows, and how a change gets from your
machine to a release.

## Development setup

```bash
git clone https://github.com/PolinaTymchenko/foundry.git
cd foundry
pnpm install
pnpm build
pnpm test
```

If all of that passes, you're set up correctly. Everything below assumes
Node >= 20 and pnpm (the version pinned in `package.json`'s `packageManager`
field — run through Corepack if you don't have it: `corepack enable`).

Useful commands while developing:

```bash
pnpm build          # every package, via Turborepo
pnpm test            # every package's test suite
pnpm lint             # ESLint
pnpm lint:deps        # dependency-cruiser — architectural boundaries
pnpm typecheck        # tsc --noEmit, every package
pnpm format:check     # Biome
pnpm format           # Biome, writing fixes
```

All of these run per-package via Turborepo and are cached on content hashes,
not timestamps — a real content change invalidates the cache, `touch` alone
does not.

## Repository structure

- **`packages/generator-core`** — the framework-agnostic engine every
  generator is built on: interactive prompts, `{{variable}}` template
  rendering (in both file contents and file/directory names), and
  `beforeRender`/`afterRender` lifecycle hooks. It knows nothing about
  "projects" or "components" — those are just different generator
  definitions built on top of it.
- **`packages/create-react-foundry`** — the `create-react-foundry` npm
  package. Its template lives at `templates/base` and is a complete, real
  component library (tokens, Button, Input, Storybook, CI) — not a stub.
  Changes to what a freshly scaffolded project looks like happen here.
- **`packages/cli`** — the `@foundryui/cli` package (bin `foundry`). Its
  component template lives at `templates/component`. New artifact types
  register in `src/generators/index.ts`.
- **`docs/adr/`** — the Architecture Decision Records that govern what the
  generator produces: component API shape, styling conventions, folder
  structure, testing strategy. **Read these before changing the generator or
  hand-editing a component in a template** — they're the canonical source of
  truth for generated-code conventions, not a suggestion.

## Hard rules

These are enforced, not just documented:

- **`packages/generator-core` never imports from its own consumers**
  (`create-react-foundry`, `cli`, or any future CLI). `pnpm lint:deps` fails
  the build on a violation — it's not a lint warning to work around.
- **Files under any `templates/` directory are not linted, formatted, or
  type-checked as their literal extension suggests.** They contain
  `{{variable}}` placeholders and are excluded from ESLint, Biome, and
  TypeScript project references on purpose.
- **Biome formats, ESLint lints.** Don't reach for Prettier; don't enable
  Biome's linter. Each tool does one job here.
- **Module resolution is deliberately not uniform.** Node-executed packages
  (`generator-core`, `create-react-foundry`, `cli`) use `NodeNext`, inherited
  from the root `tsconfig.base.json`. Bundler-consumed code — `packages/react`
  inside the template, and its `apps/storybook` — overrides to `Bundler`
  resolution. Getting this backwards produces real type errors (it happened
  once, against `@testing-library/user-event`'s dual CJS/ESM exports) — check
  which category a new package falls into before copying a neighboring
  `tsconfig.json`.
- **`packages/react` inside the template builds with Vite in library mode,
  not tsup.** tsup cannot be made to correctly scope CSS Modules class names
  — confirmed empirically (two different approaches tried and failed) before
  switching. `packages/tokens` and Foundry's own packages have no CSS and
  stay on tsup.

## Testing methodology

**Static review is not sufficient for anything touching a template.** A unit
test on `renderTemplate` catches substitution bugs, but CSS Modules scoping,
a real Storybook build, and the axe accessibility gate only get exercised by
actually generating a project and running its pipeline. This has caught real
bugs that code review alone did not, repeatedly. Before considering a
template change done:

```bash
# from the repo root, after pnpm build
mkdir -p /tmp/foundry-test && cd /tmp/foundry-test
node /path/to/foundry/packages/create-react-foundry/dist/index.js test-app \
  --package-scope=@test --license=mit
cd test-app
```

Since `@foundryui/cli` and `@foundryui/generator-core` aren't on the public
registry yet, point the scaffolded project at your local builds before
installing — add to its `package.json`:

```json
"pnpm": {
  "overrides": {
    "@foundryui/cli": "link:/path/to/foundry/packages/cli",
    "@foundryui/generator-core": "link:/path/to/foundry/packages/generator-core"
  }
}
```

This is a verification workaround, not something to commit to a real
project's `package.json` — the generator itself never writes it.

Then run the real pipeline: `pnpm install && pnpm build && pnpm test && pnpm lint && pnpm typecheck && pnpm format:check`,
plus `pnpm generate component <Name>` to confirm barrel updates still work,
plus a live accessibility check (`pnpm dev`, then in another terminal
`pnpm --filter <scope>/storybook test:a11y`) if you touched component
markup, styling, or the accessibility utilities.

## Making a change

1. Fork and branch from `main`.
2. Make your change. If it touches generated-project conventions, check it
   against `docs/adr/` first — if your change conflicts with a ratified ADR,
   that's worth raising as a discussion before writing code, not something to
   quietly work around.
3. Add or update tests. Run the full local pipeline (`pnpm build && pnpm test && pnpm lint && pnpm lint:deps && pnpm typecheck && pnpm format:check`) —
   this is exactly what CI runs.
4. If your change affects a published package (`generator-core`,
   `create-react-foundry`, or `cli`), add a changeset:
   ```bash
   pnpm changeset
   ```
   Pick the affected package(s), a semver bump (patch for fixes, minor for
   backwards-compatible additions, major for breaking changes), and write a
   one-line summary — this becomes the package's CHANGELOG entry. A PR that
   changes a publishable package without a changeset fails the
   `changeset-check` CI job.
5. Open a pull request. The PR template will ask what changed and how you
   verified it — for anything touching a template, "I ran the real pipeline
   against a fresh scaffold" is what we're looking for, not "it should work."

## Releasing (maintainers)

Releases are automated via [Changesets](https://github.com/changesets/changesets):

1. Merging PRs with changesets into `main` triggers the `Release` workflow,
   which runs `changesets/action`. If there are unreleased changesets, it
   opens (or updates) a "Version Packages" pull request that bumps versions
   and updates CHANGELOGs — it does not publish yet.
2. Merging that PR into `main` triggers the release workflow again; this
   time, with no unreleased changesets left, it runs `pnpm release`
   (`turbo run build && changeset publish`) and publishes every package with
   a version bump to npm.
3. Publishing requires an `NPM_TOKEN` secret on the repository with publish
   access to the `@foundryui` org and to `create-react-foundry` — this is
   infrastructure setup, not something a release PR can do on its own.

The very first release (`0.1.0` for all three packages) was hand-written
rather than produced by this flow, since there was no prior published version
for Changesets to diff against. Every release after it goes through the
process above.

## Code of conduct

Be respectful and assume good faith. Disagreements about technical direction
are welcome and expected — Foundry has opinions, and PRs that push back on
them with a clear rationale are taken seriously, not dismissed.
