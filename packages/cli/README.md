# @foundryui/cli

[![npm version](https://img.shields.io/npm/v/@foundryui/cli)](https://www.npmjs.com/package/@foundryui/cli)
[![npm downloads](https://img.shields.io/npm/dw/@foundryui/cli)](https://www.npmjs.com/package/@foundryui/cli)
[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://github.com/PolinaTymchenko/foundry/blob/main/LICENSE)

The ongoing, in-project [Foundry](https://github.com/PolinaTymchenko/foundry)
CLI (bin `foundry`). A project scaffolded with `create-react-foundry` depends
on this afterward to keep generating artifacts that follow the same
conventions.

```bash
foundry generate component Card
```

Generates `Card.tsx`, `Card.module.css`, `Card.stories.tsx`, and
`Card.test.tsx` under the right category folder, and updates the package's
barrel export — nothing to register by hand. See the
[root README](https://github.com/PolinaTymchenko/foundry#readme) for the full
usage and architecture.
