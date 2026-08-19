# create-react-foundry

[![npm version](https://img.shields.io/npm/v/create-react-foundry)](https://www.npmjs.com/package/create-react-foundry)
[![npm downloads](https://img.shields.io/npm/dw/create-react-foundry)](https://www.npmjs.com/package/create-react-foundry)
[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://github.com/PolinaTymchenko/foundry/blob/main/LICENSE)

Scaffolds a new [Foundry](https://github.com/PolinaTymchenko/foundry) project:
design tokens, a `Button` and an `Input`, an `apps/web` app (with an optional
[![TanStack](https://img.shields.io/badge/-TanStack-FF4154?logo=tanstack&logoColor=white)](https://tanstack.com)
Query/Form/Table demo), Storybook, and CI, wired together from the first
commit.

```bash
npm create react-foundry@latest my-design-system
cd my-design-system
pnpm dev
```

That starts Storybook and the `apps/web` app, covering variants, sizes,
loading and disabled states, controlled and uncontrolled form behavior, and a
passing accessibility check. Requires Node >=20.

## Flags

| Flag | Default | |
| --- | --- | --- |
| `--package-scope=<@scope>` | derived from the project name | npm scope for generated packages |
| `--token-prefix=<prefix>` | `fd` | CSS custom property prefix for design tokens |
| `--license=<apache-2.0\|mit>` | `apache-2.0` | license for the generated project |
| `--no-git` | off | skip `git init` |
| `--yes` | off | accept the default answer for the remaining prompt, non-interactively |
| `--help`, `-h` | — | print usage and exit |

Non-interactive, e.g. in CI (`--yes` or `--no-git` is required outside a real
terminal, along with a project name):

```bash
npm create react-foundry@latest my-design-system -- --yes --package-scope=@acme
```

`foundry generate` (the `@foundryui/cli` package) keeps the component library
growing after that. See the
[root README](https://github.com/PolinaTymchenko/foundry#readme) for the full
quick start, flags, and architecture.
