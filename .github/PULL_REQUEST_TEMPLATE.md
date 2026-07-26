## Summary

<!-- What does this change, and why? Link any related issue. -->

## Type of change

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change (to `generator-core`'s API, a CLI's flags, or generated-project conventions)
- [ ] Documentation only
- [ ] Internal / tooling (no effect on published packages)

## Testing

- [ ] `pnpm build && pnpm test && pnpm lint && pnpm lint:deps && pnpm typecheck && pnpm format:check` pass locally
- [ ] If this touches a template (`templates/base` or `templates/component`): verified against a **real, freshly scaffolded project** — not just the template's own unit tests. See [CONTRIBUTING.md's testing methodology](../CONTRIBUTING.md#testing-methodology).
- [ ] If this touches component markup, styling, or the accessibility utilities: verified the live Storybook accessibility gate (`pnpm dev` + `test:a11y`) still passes with zero violations.

Describe what you actually ran, not just that it "should work":

<!-- e.g. "Scaffolded a project with --license=mit, ran foundry generate component Card, confirmed the barrel updated and the full pipeline passed." -->

## Changeset

- [ ] This PR changes a publishable package (`generator-core`, `create-react-foundry`, or `cli`) and includes a changeset (`pnpm changeset`)
- [ ] N/A — this PR doesn't change a publishable package

## Conventions

- [ ] If this changes what a generated component or project looks like, it's consistent with the relevant ADR in `docs/adr/` — or this PR proposes a new/superseding ADR alongside the code change.
