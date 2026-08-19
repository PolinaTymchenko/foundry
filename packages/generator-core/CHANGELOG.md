# @foundryui/generator-core

## 0.1.2

### Patch Changes

- Adds `--no-git`, `--yes`, and `--help`/`-h` flags to `create-react-foundry`, and `--help`/`-h` to `foundry generate`. Previously, the only way to skip the "Initialize a git repository?" prompt was an interactive terminal — running either CLI outside a TTY without these flags now prints a clear, actionable error instead of crashing with a raw `TTY initialization failed: uv_tty_init returned EINVAL`. Exposes a new `hasFlag` helper from `@foundryui/generator-core` for detecting boolean CLI flags, shared by both CLIs. Both package READMEs now document all supported flags, including a non-interactive/CI usage example.

## 0.1.1

### Patch Changes

- 6d08dff: Adds a README to each published package, shown on its npm page.

## 0.1.0

### Minor Changes

- Initial release. The framework-agnostic prompt and template-rendering engine shared by `create-react-foundry` and `@foundryui/cli`: interactive prompts, `{{variable}}` substitution across file contents and paths, and `beforeRender`/`afterRender` lifecycle hooks.
