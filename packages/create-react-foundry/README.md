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

`foundry generate` (the `@foundryui/cli` package) keeps the component library
growing after that. See the
[root README](https://github.com/PolinaTymchenko/foundry#readme) for the full
quick start, flags, and architecture.
