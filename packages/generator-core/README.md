# @foundryui/generator-core

[![npm version](https://img.shields.io/npm/v/@foundryui/generator-core)](https://www.npmjs.com/package/@foundryui/generator-core)
[![npm downloads](https://img.shields.io/npm/dw/@foundryui/generator-core)](https://www.npmjs.com/package/@foundryui/generator-core)
[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://github.com/PolinaTymchenko/foundry/blob/main/LICENSE)

The framework-agnostic engine behind
[Foundry](https://github.com/PolinaTymchenko/foundry)'s two CLIs
(`create-react-foundry` and `@foundryui/cli`): interactive prompts, template
directory rendering with `{{variable}}` substitution in file contents and
names, and `beforeRender`/`afterRender` lifecycle hooks. It has no concept of
"projects" or "components" — those are `GeneratorDefinition`s built on top of
it.

Not intended to be installed directly; both Foundry CLIs depend on it. See
the [root README](https://github.com/PolinaTymchenko/foundry#readme) for
architecture details.
