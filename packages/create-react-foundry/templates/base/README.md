# {{projectName}}

Scaffolded with [Foundry](https://github.com/foundry-ui/foundry).

## What's here

- `packages/tokens` — design tokens as CSS custom properties (`--{{tokenPrefix}}-*`), plus typed TS exports.
- `packages/react` — the component library. Ships one component, `Button`, with variants, sizes, loading and disabled states, icon slots, and full accessibility behavior — the reference every future generated component follows.
- `apps/storybook` — the development environment for `packages/react`.

## Working on this

```
pnpm dev
```

Opens Storybook at http://localhost:6006 with Button already there — change
`packages/react/src/Button/Button.tsx` and Storybook updates live.

```
pnpm build        # builds every package
pnpm test         # unit tests (Vitest + React Testing Library)
pnpm lint          # ESLint, including jsx-a11y
pnpm typecheck
```

Accessibility is checked two ways: `eslint-plugin-jsx-a11y` at write time, and
`pnpm --filter {{packageScope}}/storybook test:a11y` (Storybook's test runner
+ axe) against every story — the same check CI runs on every PR. There's no
flag to skip it.

Remember to add a `LICENSE` that fits your project — Foundry doesn't choose
one for you.
