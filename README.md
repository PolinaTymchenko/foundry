# Foundry

[![CI](https://github.com/PolinaTymchenko/foundry/actions/workflows/ci.yml/badge.svg)](https://github.com/PolinaTymchenko/foundry/actions/workflows/ci.yml)
[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](./LICENSE)
[![Node.js >= 20](https://img.shields.io/badge/node-%3E%3D20-339933?logo=node.js&logoColor=white)](package.json)

Foundry scaffolds an enterprise React design system — components, tokens,
Storybook, and CI — wired together from the first commit, then keeps helping
you grow it with `foundry generate`.

It isn't a copy-paste starter kit and it isn't a UI kit you theme. It's the
tool platform teams use to stand up their *own* component library, the one
their product teams will depend on for years.

**Status: v0.1, pre-publish.** Everything below is real and verified against
a fresh scaffold — see [Verifying this yourself](#verifying-this-yourself).
The one step not yet done is the actual `npm publish` of the three packages
this repo produces, so the commands below describe the real, working
interface, not something you can `npm install` from the public registry
today. See [Publishing status](#publishing-status).

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

**Built for platform teams, not side projects.** Foundry's target user is an
engineer on an internal platform or design-systems team who's been asked to
stand up "the" component library their org's product teams will build on.
That user needs something that scales to hundreds of components and years of
maintenance, not a quick way to bootstrap a demo.

**Foundry is a dependency, not a template.** Running `create-react-foundry`
doesn't hand you a snapshot you're on your own to maintain — `@foundryui/cli`
stays installed in the project it scaffolds, so `foundry generate component`
works the same way on day 900 as it does on day one. Conventions live in one
place (this repo's `docs/adr/`) and the generator enforces them, instead of
every new component silently drifting from the last one.

**Zero-runtime styling.** Components are styled with CSS Modules against
plain CSS custom properties for tokens — no CSS-in-JS runtime computing
styles on every render. At the scale Foundry targets — hundreds of
components, high-traffic product surfaces — that's not a style preference,
it's a real performance and bundle-size decision.

**Accessibility is a gate, not a checklist.** Every generated component ships
with `eslint-plugin-jsx-a11y` at write time and a real automated axe scan (via
Storybook's test runner) at test time. This is enforced in Foundry's own CI
on every one of its milestones — not configured and assumed to work.

**AI-native is a long-term bet, not a v0.1 feature.** Foundry's conventions
are deliberately explicit and machine-checkable (ADRs, a single registered
template shape per artifact type, a real barrel-export contract) so that both
humans and AI coding agents can extend a Foundry-based design system
predictably. The generator is the mechanism; today it's driven by a CLI, and
it's built so that mechanism can serve an agent just as well as a human typing
into a terminal.

## Quick start

```bash
npm create react-foundry@latest my-design-system
cd my-design-system
pnpm dev
```

That scaffolds a full monorepo — design tokens, a `Button` and an `Input`
component, a Storybook instance, and CI — and starts Storybook with both
components: variants, sizes, loading and disabled states, controlled and
uncontrolled form behavior, and a passing accessibility check.

You'll be asked three questions (skip any of them with flags, shown below):

| Prompt | What it controls | Default |
| --- | --- | --- |
| Project name | Directory name and root package name | `my-design-system` |
| Package scope | Publishes as `{scope}/react`, `{scope}/tokens` | `@` + first word of the project name |
| Initialize a git repository? | Runs `git init` after scaffolding | Yes |

Non-interactive flags, for scripts or CI:

```bash
npm create react-foundry@latest my-design-system -- \
  --package-scope=@acme \
  --token-prefix=acme \
  --license=mit
```

- `--package-scope=<@scope>` — the npm scope generated packages publish
  under. Defaults to `@` + the first hyphen-separated word of the project
  name.
- `--token-prefix=<prefix>` — the CSS custom property prefix for design
  tokens (`--{prefix}-color-...`). Defaults to `fd`. Lowercase letters,
  numbers, and hyphens, starting with a letter.
- `--license=<apache-2.0|mit>` — the license for the generated project.
  Defaults to `apache-2.0`.

## What you get

A real component library, not an empty shell:

- **Design tokens** as plain CSS custom properties (`packages/tokens`) —
  color, spacing, and typography scales, prefixed and ready to extend.
- **`Button` and `Input`** (`packages/react`) — forwardRef, full keyboard and
  screen-reader behavior, controlled/uncontrolled form state via a shared
  `useControlledState` hook, variants and sizes as real style axes.
- **Storybook** (`apps/storybook`), auto-loading every `*.stories.tsx` in
  `packages/react` — no manual registration.
- **A non-optional accessibility gate** — `eslint-plugin-jsx-a11y` at write
  time, a live axe scan via Storybook's test runner at test time.
- **Vitest + React Testing Library**, wired up and passing from the first
  commit.
- **CI** (GitHub Actions) running lint, typecheck, build, test, and format
  checks on every push and pull request via Turborepo.
- **`foundry generate`** — the command you'll use for every component after
  the first two.

## Generating components

From inside a scaffolded project:

```bash
pnpm generate component Card
```

You'll be asked for a category (Atom, Molecule, Organism, or Template — this
groups the component in Storybook's sidebar; it isn't a different code
shape). Skip the prompt with a flag:

```bash
pnpm generate component Card --category=molecule
```

Either way, this creates `packages/react/src/Card/`:

```
Card/
├── Card.tsx            # forwardRef, follows docs/adr conventions
├── Card.module.css      # scoped styles against your project's tokens
├── Card.stories.tsx     # auto-discovered by Storybook
├── Card.test.tsx        # Vitest + Testing Library, ready to extend
└── index.ts
```

...and updates `packages/react/src/index.ts` automatically — the new
component is exported and usable immediately, with nothing to register by
hand.

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
`@storybook/test-runner` with `axe-playwright` against every story — a real
browser-driven accessibility scan, not a static lint rule.

## Testing

```bash
pnpm test          # Vitest + React Testing Library, every package
pnpm lint           # ESLint, including eslint-plugin-jsx-a11y
pnpm typecheck      # tsc --noEmit, every package
pnpm format:check   # Biome
```

All four run per-package via Turborepo and are cached on content hashes, so
repeat runs against unchanged code are close to instant. `pnpm test` covers
component behavior and the shared `useControlledState`/accessibility
utilities; the Storybook a11y gate above is a separate, browser-driven layer
on top — unit tests don't replace it, and it doesn't replace them.

## Publishing your component library

Generated packages (`packages/react`, `packages/tokens`) are real, publishable
npm packages from the moment they're scaffolded — nothing else to configure:

```bash
pnpm build
cd packages/react   # or packages/tokens
npm publish --access public   # omit --access public for a private registry/scope
```

A few things worth knowing before your first publish:

- The package scope you chose during scaffolding (`--package-scope`, e.g.
  `@acme`) must correspond to an npm user or organization you actually own —
  Foundry names the packages `{scope}/react` and `{scope}/tokens`, it doesn't
  create the scope on npm's side.
- You'll need to be logged in (`npm login`) or have `NODE_AUTH_TOKEN` set for
  CI, same as publishing any npm package.
- v0.1 doesn't wire up an automated release pipeline (changesets, versioning,
  a release workflow) inside generated projects — that's a deliberate scope
  decision for this release, not an oversight. Until you build one, publishing
  is the manual flow above. See [Project status](#project-status).
- For a private/internal registry, set `publishConfig.registry` in the
  package's `package.json` or point `.npmrc` at it — standard npm behavior,
  nothing Foundry-specific.

## Architecture

Two layers: a framework-agnostic generator engine, and two CLIs built on it.

| Package | npm name | Purpose |
| --- | --- | --- |
| `packages/generator-core` | `@foundryui/generator-core` | Framework-agnostic engine: interactive prompts, `{{variable}}` template rendering, lifecycle hooks. Knows nothing about "projects" or "components." |
| `packages/create-react-foundry` | `create-react-foundry` | `npm create react-foundry`. Scaffolds a new project, once. |
| `packages/cli` | `@foundryui/cli` (bin `foundry`) | `foundry generate ...`. The ongoing, in-project CLI a scaffolded project depends on afterward. |

Neither CLI reimplements prompt handling or template rendering — both are
built entirely on `generator-core`, and a dependency-cruiser rule
(`pnpm lint:deps`) enforces that `generator-core` never imports from either
of its own consumers. That boundary is a build failure if violated, not a
convention someone can quietly break.

A scaffolded project itself follows the same two-layer split: `packages/react`
and `packages/tokens` are the actual component library; `apps/storybook`
documents it; `docs/adr/` (in this repo, not copied into scaffolded projects)
is where the conventions the generator encodes are written down.

## Project status

**Implemented and verified in v0.1:**

- Project scaffolding (`create-react-foundry`) and in-project component
  generation (`foundry generate component`)
- A real starting component library: tokens, `Button`, `Input`, Storybook,
  a passing accessibility gate
- Full CI (lint, typecheck, build, test, format) on every generated project

**Deliberately not in v0.1** — real gaps, not oversights, each descoped for a
specific reason during design:

- **A generated documentation site** (auto-discovered component pages with
  props tables, live playgrounds, copyable code) — today you get Storybook,
  which is real and functional but not this. Planned as a later milestone.
- **A token compiler / Style Dictionary-style pipeline** — tokens today are
  hand-authored CSS custom properties. Deliberately kept minimal rather than
  building custom token infrastructure before there's a proven need for it.
- **Codemods and a formal deprecation-window process** for breaking changes
  to generated code — the long-term intended direction, not yet built.
- **Multi-tool AI assistant configuration** (Cursor rules, Copilot
  instructions, etc.) scaffolded into generated projects — designed, not yet
  implemented as a shipped generator feature.
- **More artifact types** beyond `component` (hooks, providers, routes,
  tokens) — the registry (`packages/cli/src/generators/index.ts`) is built to
  add these without new architecture; none are registered yet.

## Publishing status

None of the three packages this repo produces (`@foundryui/generator-core`,
`create-react-foundry`, `@foundryui/cli`) are on the public npm registry yet
— verified directly against the registry while preparing this release, not
assumed. Every command in this README has been run against a real scaffold
using local builds (see below); what's missing is the first `npm publish`.

### Verifying this yourself

Every command block in this README was run against a real, freshly scaffolded
project before being written down. Since the packages aren't published yet,
verification links against local builds instead of the registry:

```bash
pnpm install && pnpm build   # from this repo's root

# then, in a scratch directory:
node path/to/foundry/packages/create-react-foundry/dist/index.js my-app
```

A freshly scaffolded project's `pnpm install` will fail on `@foundryui/cli`
until it's published — for local verification, add a `pnpm.overrides` entry
pointing at your local build (`"@foundryui/cli": "link:/path/to/foundry/packages/cli"`,
same for `@foundryui/generator-core`) before installing. This is a
verification workaround, not something to commit to a real project.

## Contributing

Contributions are welcome — see [CONTRIBUTING.md](./CONTRIBUTING.md) for
development setup, the repository structure, and how releases work.

## License

Apache-2.0. See [LICENSE](./LICENSE).
