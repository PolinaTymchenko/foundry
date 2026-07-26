# Contributing to Foundry

This covers development setup, the conventions the codebase follows, and how
a change gets from your machine to a release.

## Development setup

```bash
git clone https://github.com/PolinaTymchenko/foundry.git
cd foundry
pnpm install
pnpm build
pnpm test
```

If that passes, you're set up. Everything below assumes Node >= 20 and pnpm
(the version pinned in `package.json`'s `packageManager` field; run through
Corepack if you don't have it: `corepack enable`).

Commands you'll use while developing:

```bash
pnpm build         # every package, via Turborepo
pnpm test          # every package's test suite
pnpm lint          # ESLint
pnpm lint:deps     # dependency-cruiser, architectural boundaries
pnpm typecheck     # tsc --noEmit, every package
pnpm format:check  # Biome
pnpm format        # Biome, writing fixes
```

These run per-package via Turborepo and are cached on content hashes, not
timestamps. `touch` alone won't invalidate the cache; an actual content
change will.

## Repository structure

- **`packages/generator-core`**: the framework-agnostic engine every
  generator is built on. Interactive prompts, `{{variable}}` template
  rendering (file contents and file/directory names), `beforeRender`/
  `afterRender` lifecycle hooks. It has no concept of "projects" or
  "components" — those are just generator definitions built on top of it.
- **`packages/create-react-foundry`**: the `create-react-foundry` npm
  package. Its template lives at `templates/base` and is a full component
  library (tokens, Button, Input, Storybook, CI), not a stub. Changes to what
  a freshly scaffolded project looks like happen here.
- **`packages/cli`**: the `@foundryui/cli` package (bin `foundry`). Its
  component template lives at `templates/component`. New artifact types
  register in `src/generators/index.ts`.
- **`docs/adr/`**: the Architecture Decision Records that govern what the
  generator produces — component API shape, styling, folder structure,
  testing strategy. Read these before changing the generator or hand-editing
  a component in a template. They're the source of truth for generated-code
  conventions.

## Hard rules

These are enforced, not just documented:

- **`packages/generator-core` never imports from its own consumers**
  (`create-react-foundry`, `cli`, or any future CLI). `pnpm lint:deps` fails
  the build on a violation. It's not a lint warning to work around.
- **Files under any `templates/` directory aren't linted, formatted, or
  type-checked as their extension suggests.** They contain `{{variable}}`
  placeholders and are excluded from ESLint, Biome, and TypeScript project
  references on purpose.
- **Biome formats, ESLint lints.** Don't reach for Prettier; don't enable
  Biome's linter.
- **Module resolution isn't uniform, on purpose.** Node-executed packages
  (`generator-core`, `create-react-foundry`, `cli`) use `NodeNext`, inherited
  from the root `tsconfig.base.json`. Bundler-consumed code, `packages/react`
  inside the template and its `apps/storybook`, overrides to `Bundler`
  resolution. Getting this backwards produces real type errors (it happened
  once, against `@testing-library/user-event`'s dual CJS/ESM exports), so
  check which category a new package falls into before copying a neighboring
  `tsconfig.json`.
- **`packages/react` inside the template builds with Vite in library mode,
  not tsup.** tsup can't be made to scope CSS Modules class names correctly.
  Confirmed by trying two different approaches before switching.
  `packages/tokens` and Foundry's own packages have no CSS and stay on tsup.

## Testing methodology

Static review isn't enough for anything touching a template. A unit test on
`renderTemplate` catches substitution bugs, but CSS Modules scoping, a real
Storybook build, and the axe accessibility gate only get exercised by
actually generating a project and running its pipeline. This has caught bugs
that code review alone missed, more than once. Before considering a template
change done:

```bash
# from the repo root, after pnpm build
mkdir -p /tmp/foundry-test && cd /tmp/foundry-test
node /path/to/foundry/packages/create-react-foundry/dist/index.js test-app \
  --package-scope=@test --license=mit
cd test-app
```

Since `@foundryui/cli` and `@foundryui/generator-core` aren't on the public
registry yet, point the scaffolded project at your local builds before
installing. Add to its `package.json`:

```json
"pnpm": {
  "overrides": {
    "@foundryui/cli": "link:/path/to/foundry/packages/cli",
    "@foundryui/generator-core": "link:/path/to/foundry/packages/generator-core"
  }
}
```

This is a verification workaround, not something to commit to a real
project's `package.json`. The generator itself never writes it.

Then run the full pipeline: `pnpm install && pnpm build && pnpm test && pnpm lint && pnpm typecheck && pnpm format:check`,
plus `pnpm generate component <Name>` to confirm barrel updates still work,
plus a live accessibility check (`pnpm dev`, then in another terminal
`pnpm --filter <scope>/storybook test:a11y`) if you touched component
markup, styling, or the accessibility utilities.

## Making a change

1. Fork and branch from `main`.
2. Make your change. If it touches generated-project conventions, check it
   against `docs/adr/` first. If your change conflicts with a ratified ADR,
   raise it as a discussion before writing code.
3. Add or update tests. Run the full local pipeline
   (`pnpm build && pnpm test && pnpm lint && pnpm lint:deps && pnpm typecheck && pnpm format:check`).
   This is what CI runs.
4. If your change affects a published package (`generator-core`,
   `create-react-foundry`, or `cli`), add a changeset:
   ```bash
   pnpm changeset
   ```
   Pick the affected package(s), a semver bump (patch for fixes, minor for
   backwards-compatible additions, major for breaking changes), and write a
   one-line summary. This becomes the package's CHANGELOG entry. A PR that
   changes a publishable package without a changeset fails the
   `changeset-check` CI job.
5. Open a pull request. The PR template asks what changed and how you
   verified it. For anything touching a template, "ran the pipeline against
   a fresh scaffold" is what we're looking for, not "should work."

## Releasing (maintainers)

Releases go through [Changesets](https://github.com/changesets/changesets):

1. Merging PRs with changesets into `main` triggers the `Release` workflow,
   which runs `changesets/action`. If there are unreleased changesets, it
   opens (or updates) a "Version Packages" pull request that bumps versions
   and updates CHANGELOGs. It doesn't publish yet.
2. Merging that PR triggers the release workflow again. With no unreleased
   changesets left, it runs `pnpm release`
   (`turbo run build && changeset publish`) and publishes every package with
   a version bump to npm.
3. Publishing requires an `NPM_TOKEN` secret on the repository, with publish
   access to the `@foundryui` org and to `create-react-foundry`. That's
   infrastructure setup, not something a release PR can do on its own. Until
   the secret exists, the release workflow's publish step checks for it and
   skips with a message instead of failing, so pushes to `main` before then
   don't fail CI or send failure emails.

The first release (`0.1.0` for all three packages) was hand-written rather
than produced by this flow, since there was no prior published version for
Changesets to diff against. Every release after it goes through the process
above.

## Code of conduct

Be respectful and assume good faith. Disagreements about technical direction
are welcome — Foundry has opinions, and PRs that push back on them with a
clear rationale get taken seriously.
