# {{projectName}}

Scaffolded with [Foundry](https://github.com/foundry-ui/foundry).

## What's here

- `packages/tokens` — design tokens as CSS custom properties (`--{{tokenPrefix}}-*`), plus typed TS exports.
- `packages/react` — the component library: `Button` and `Input`, covering two different shapes (a stateless action vs. controlled/uncontrolled form state) that every future generated component builds on.
- `apps/storybook` — the development environment for `packages/react`.

## Working on this

```
pnpm dev
```

Opens Storybook at http://localhost:6006 with Button and Input already
there — change `packages/react/src/Button/Button.tsx` (or `Input/Input.tsx`)
and Storybook updates live.

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

## Using the component library elsewhere

```
import "{{packageScope}}/tokens/tokens.css";
import "{{packageScope}}/react/styles.css";
import { Button, Input } from "{{packageScope}}/react";
```

Both stylesheets need to load once, near your app's root — components are
styled entirely through the CSS custom properties tokens.css defines.
