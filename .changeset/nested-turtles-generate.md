---
"create-react-foundry": minor
"@foundryui/cli": minor
---

`create-react-foundry` no longer asks for a package scope during scaffolding — most projects never publish anywhere, so it's derived from the project name automatically. Override it with `--package-scope` if you do plan to publish.

`foundry generate component` now creates components under a category subfolder (`packages/react/src/Atoms/ComponentName/`, `Molecules/`, etc.) instead of directly under `src/`, creating the category folder if it doesn't exist yet. `Button` and `Input` moved to `Atoms/` for consistency. See ADR-0005.
