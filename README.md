# Foundry

[![CI](https://github.com/PolinaTymchenko/foundry/actions/workflows/ci.yml/badge.svg)](https://github.com/PolinaTymchenko/foundry/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/create-react-foundry)](https://www.npmjs.com/package/create-react-foundry)
[![npm downloads](https://img.shields.io/npm/dw/create-react-foundry)](https://www.npmjs.com/package/create-react-foundry)
[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](./LICENSE)
[![Node.js >= 20](https://img.shields.io/badge/node-%3E%3D20-339933?logo=node.js&logoColor=white)](package.json)

Foundry scaffolds a React design system: components, tokens, Storybook, and
CI, wired together from the first commit. `foundry generate` keeps it growing
after that.

It's not a copy-paste starter and not a themeable UI kit. It's meant for
platform teams standing up the component library their own product teams will
build on.

**Status: published.** All three packages are live on the public npm
registry. `npm create react-foundry` and `foundry generate` both work from
anywhere — no local build or override workaround required; see
[Verifying this yourself](#verifying-this-yourself). Versions and the
release process are in [Publishing status](#publishing-status).

## Table of contents

- [Philosophy](#philosophy)
- [Quick start](#quick-start)
- [What you get](#what-you-get)
- [Generating components](#generating-components)
- [Storybook](#storybook)
- [Testing](#testing)
- [Publishing your component library](#publishing-your-component-library)
- [Architecture](#architecture)
- [Project status](#project-status)
- [Publishing status](#publishing-status)
- [Contributing](#contributing)
- [License](#license)

## Philosophy

**Platform teams, not side projects.** The target user is someone on an
internal platform or design-systems team asked to build "the" component
library their org will depend on. That needs to hold up over hundreds of
components and years of changes, not just look good in a demo.

**A dependency, not a template.** `create-react-foundry` doesn't hand you a
snapshot to maintain alone. `@foundryui/cli` stays installed, so
`foundry generate component` works the same on day 900 as on day one.
Conventions live in one place (`docs/adr/` in this repo) and the generator
enforces them, instead of each new component drifting from the last.

**Zero-runtime styling.** Components use CSS Modules against plain CSS custom
properties for tokens. No CSS-in-JS runtime computing styles on every render.
At the scale Foundry targets, that's a performance and bundle-size decision,
not a preference.

**Accessibility is enforced, not suggested.** Every generated component ships
with `eslint-plugin-jsx-a11y` at write time and an automated axe scan (via
Storybook's test runner) at test time. Checked in Foundry's own CI at every
milestone, not configured once and assumed to keep working.

**AI-native is a long-term bet.** Foundry's conventions are explicit and
machine-checkable: ADRs, one registered template shape per artifact type, a
consistent barrel-export contract. The point is that a coding agent can extend
a Foundry project as reliably as a person can. Today that means a CLI; the
mechanism doesn't assume a human is the one typing.

## Quick start

```bash
npm create react-foundry@latest my-design-system
cd my-design-system
pnpm dev
```

This scaffolds a monorepo with design tokens, a `Button` and an `Input`, an
`apps/web` app wired to them, a Storybook instance, and CI, then starts both:
the app at `:5173` and Storybook at `:6006`, covering variants, sizes,
loading and disabled states, controlled and uncontrolled form behavior, and a
passing accessibility check.

You'll be asked two questions (or skip them with flags, below):

| Prompt | What it controls | Default |
| --- | --- | --- |
| Project name | Directory name and root package name | `my-design-system` |
| Initialize a git repository? | Runs `git init` after scaffolding | Yes |

Package scope (`{scope}/react`, `{scope}/tokens`) isn't asked, since most
projects never publish anywhere. It defaults to `@` + the first word of the
project name; override it with `--package-scope` if you do plan to publish.

Non-interactive, for scripts or CI (required outside a real terminal — see
`--yes`/`--no-git` below):

```bash
npm create react-foundry@latest my-design-system -- \
  --yes \
  --package-scope=@acme \
  --token-prefix=acme \
  --license=mit
```

- `--package-scope=<@scope>`: npm scope the generated packages publish under.
  Defaults to `@` + the first hyphen-separated word of the project name.
- `--token-prefix=<prefix>`: CSS custom property prefix for design tokens
  (`--{prefix}-color-...`). Defaults to `fd`. Lowercase letters, numbers, and
  hyphens, starting with a letter.
- `--license=<apache-2.0|mit>`: license for the generated project. Defaults to
  `apache-2.0`.
- `--no-git`: skip `git init`.
- `--yes`: accept the default answer for the "Initialize a git repository?"
  prompt instead of asking. Outside an interactive terminal, a project name
  and one of `--yes`/`--no-git` are both required — without them, the CLI
  can't prompt and exits with an error instead of hanging.
- `--help` (or `-h`): print usage and exit.

## What you get

- **Design tokens** as plain CSS custom properties (`packages/tokens`): color,
  spacing, and typography scales, prefixed and ready to extend.
- **`Button` and `Input`** (`packages/react`): forwardRef, keyboard and
  screen-reader behavior, controlled/uncontrolled form state via a shared
  `useControlledState` hook, variants and sizes as style axes.
- **`apps/web`**: a Vite + React app wired to `packages/react`, with an
  optional [![TanStack](https://img.shields.io/badge/-TanStack-FF4154?logo=tanstack&logoColor=white)](https://tanstack.com)
  Query/Form/Table demo backed by a mock API — safe to delete if you don't
  want it.
- **Storybook** (`apps/storybook`), loading every `*.stories.tsx` in
  `packages/react` automatically. Nothing to register by hand.
- **An accessibility gate**: `eslint-plugin-jsx-a11y` at write time, a live
  axe scan via Storybook's test runner at test time.
- **Vitest + React Testing Library**, passing from the first commit.
- **CI** (GitHub Actions) running lint, typecheck, build, test, and format
  checks on every push and pull request, via Turborepo.
- **`foundry generate`**: the command for every component after the first
  two.

## Generating components

From inside a scaffolded project:

```bash
pnpm generate component Card
```

You'll be asked for a category (Atom, Molecule, Organism, or Template). This
groups the component in Storybook's sidebar and picks which folder it's
generated under; every category produces the same generated component
shape. Skip the prompt with a flag:

```bash
pnpm generate component Card --category=molecule
```

Either way, this creates `packages/react/src/Molecules/Card/` (the category
folder is created too, if it doesn't already exist):

```
Molecules/
└── Card/
    ├── Card.tsx          # forwardRef, follows docs/adr conventions
    ├── Card.module.css   # scoped styles against your project's tokens
    ├── Card.stories.tsx  # auto-discovered by Storybook
    ├── Card.test.tsx     # Vitest + Testing Library, ready to extend
    └── index.ts
```

...and updates `packages/react/src/index.ts` so the new component is exported
right away, with nothing to register by hand.

If Storybook is already running (`pnpm dev` in another terminal) when you
generate a component, restart it (`Ctrl+C`, then `pnpm dev` again). Storybook's
dev server picks up new story files reliably on a fresh start, but hot reload
alone can leave a just-added story showing an `importers[path] is not a
function` error until you do. This is a Storybook/Vite dev-server limitation
with newly created files, not specific to Foundry — confirmed by reproducing
it and checking that a restart clears it.

## Storybook

```bash
pnpm dev     # starts Storybook at http://localhost:6006
pnpm build   # static build to apps/storybook/dist
```

The accessibility gate runs against a live Storybook instance:

```bash
pnpm dev                                      # in one terminal
pnpm --filter @acme/storybook test:a11y       # in another, once it's up
```

(Substitute your project's actual package scope for `@acme`.) This runs
`@storybook/test-runner` with `axe-playwright` against every story: a
browser-driven accessibility scan, not a static lint rule.

## Testing

```bash
pnpm test           # Vitest + React Testing Library, every package
pnpm lint           # ESLint, including eslint-plugin-jsx-a11y
pnpm typecheck      # tsc --noEmit, every package
pnpm format:check   # Biome
```

All four run per-package via Turborepo, cached on content hashes, so repeat
runs against unchanged code are close to instant. `pnpm test` covers
component behavior and the shared `useControlledState`/accessibility
utilities. The Storybook a11y gate above is a separate, browser-driven check;
neither replaces the other.

## Publishing your component library

`packages/react` and `packages/tokens` are publishable npm packages from the
moment they're scaffolded. Nothing else to configure:

```bash
pnpm build
cd packages/react   # or packages/tokens
npm publish --access public   # omit --access public for a private registry/scope
```

Before your first publish:

- The package scope (auto-derived from the project name, or set with
  `--package-scope`, e.g. `@acme`) needs to be an npm user or organization you
  own. Foundry names the packages `{scope}/react` and `{scope}/tokens`; it
  doesn't create the scope on npm's side.
- You'll need to be logged in (`npm login`) or have `NODE_AUTH_TOKEN` set in
  CI, same as publishing any npm package.
- v0.1 doesn't set up an automated release pipeline (changesets, versioning,
  a release workflow) inside generated projects. That's a deliberate scope
  decision, not an oversight — see [Project status](#project-status). Until
  you build one, the manual flow above is what you have.
- For a private or internal registry, set `publishConfig.registry` in the
  package's `package.json`, or point `.npmrc` at it. Standard npm behavior,
  nothing Foundry-specific.

## Architecture

Two layers: a framework-agnostic generator engine, and two CLIs built on it.

| Package | npm name | Version | Purpose |
| --- | --- | --- | --- |
| `packages/generator-core` | `@foundryui/generator-core` | [![npm](https://img.shields.io/npm/v/@foundryui/generator-core)](https://www.npmjs.com/package/@foundryui/generator-core) | Framework-agnostic engine: prompts, `{{variable}}` template rendering, lifecycle hooks. Knows nothing about "projects" or "components." |
| `packages/create-react-foundry` | `create-react-foundry` | [![npm](https://img.shields.io/npm/v/create-react-foundry)](https://www.npmjs.com/package/create-react-foundry) | `npm create react-foundry`. Scaffolds a new project, once. |
| `packages/cli` | `@foundryui/cli` (bin `foundry`) | [![npm](https://img.shields.io/npm/v/@foundryui/cli)](https://www.npmjs.com/package/@foundryui/cli) | `foundry generate ...`. The CLI a scaffolded project depends on afterward. |

Neither CLI reimplements prompt handling or template rendering; both are
built on `generator-core`. A dependency-cruiser rule (`pnpm lint:deps`)
enforces that `generator-core` never imports from either of its consumers.
That boundary fails the build if violated, rather than relying on convention.

A scaffolded project follows the same split: `packages/react` and
`packages/tokens` are the component library, `apps/storybook` documents it,
and `docs/adr/` (in this repo, not copied into scaffolded projects) is where
the conventions the generator encodes are written down.

## Project status

**Implemented and verified in v0.1:**

- Project scaffolding (`create-react-foundry`) and in-project component
  generation (`foundry generate component`)
- A starting component library: tokens, `Button`, `Input`, Storybook, a
  passing accessibility gate
- Full CI (lint, typecheck, build, test, format) on every generated project

**Not in v0.1**, each descoped deliberately:

- **A generated documentation site** (auto-discovered component pages with
  props tables, live playgrounds, copyable code). You get Storybook today,
  not this. Planned for a later milestone.
- **A token compiler or Style Dictionary-style pipeline.** Tokens are
  hand-authored CSS custom properties for now, kept minimal rather than
  building token infrastructure ahead of a proven need.
- **Codemods and a formal deprecation-window process** for breaking changes
  to generated code. The intended direction, not yet built.
- **Multi-tool AI assistant configuration** (Cursor rules, Copilot
  instructions, etc.) scaffolded into generated projects. Designed, not yet
  a shipped generator feature.
- **More artifact types** beyond `component` (hooks, providers, routes,
  tokens). The registry (`packages/cli/src/generators/index.ts`) is built to
  add these without new architecture; none are registered yet.

## Publishing status

All three packages this repo produces (`@foundryui/generator-core`,
`create-react-foundry`, `@foundryui/cli`) are published and live on the
public npm registry, checked directly against it while writing this section.
See the Version column in [Architecture](#architecture) for current versions
and links, or the badges at the top of this file.

Releases are automated via [Changesets](https://github.com/changesets/changesets):
merging a PR with a changeset opens a "Version Packages" PR, and merging that
PR publishes every changed package to npm. See
[Releasing](./CONTRIBUTING.md#releasing-maintainers) in CONTRIBUTING.md for
the full flow.

### Verifying this yourself

Checked directly against the registry: all three packages resolve, and
`create-react-foundry`'s and `@foundryui/cli`'s published dependency on
`@foundryui/generator-core` is pinned to a real version (not left as the
workspace-protocol reference used inside this monorepo). That's what makes
the command below a normal `npm install`, no workaround required:

```bash
npm create react-foundry@latest my-app -- --package-scope=@test --license=mit
cd my-app
pnpm install && pnpm build && pnpm test
```

Contributors testing *unreleased* local changes instead of a published
version still want the `pnpm.overrides`/`link:` workflow; see
[Testing methodology](./CONTRIBUTING.md#testing-methodology) in
CONTRIBUTING.md.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for development setup, the
repository structure, and how releases work.

## License

Apache-2.0. See [LICENSE](./LICENSE).
