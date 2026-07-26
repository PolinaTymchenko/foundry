# {{projectName}}

Scaffolded with Foundry.

## What's here

- `packages/tokens`: design tokens as CSS custom properties (`--{{tokenPrefix}}-*`), plus typed TS exports.
- `packages/react`: the component library. `Button` and `Input` cover two shapes (a stateless action vs. controlled/uncontrolled form state) that future generated components build on.
- `apps/storybook`: the development environment for `packages/react`.

## Working on this

```
pnpm dev
```

Opens Storybook at http://localhost:6006 with Button and Input already
there. Edit `packages/react/src/Atoms/Button/Button.tsx` (or
`Atoms/Input/Input.tsx`) and Storybook updates live.

```
pnpm build       # builds every package
pnpm test        # unit tests (Vitest + React Testing Library)
pnpm lint        # ESLint, including jsx-a11y
pnpm typecheck
```

Accessibility is checked two ways: `eslint-plugin-jsx-a11y` at write time, and
`pnpm --filter {{packageScope}}/storybook test:a11y` (Storybook's test runner
plus axe) against every story. Same check CI runs on every PR. No flag to
skip it.

## Adding a new component

```
pnpm generate component Card
```

Asks for a category (Atom, Molecule, Organism, Template), creating the
category folder if it doesn't exist yet, then generates
`packages/react/src/Atoms/Card/{Card.tsx, Card.module.css, Card.stories.tsx, Card.test.tsx, index.ts}`
(substituting whichever category you picked) and adds `Card` to
`packages/react/src/index.ts` automatically. The generated component is a
minimal starting point that follows the project's conventions; pick the
right root element and props for what it does. Look at `Button.tsx` and
`Input.tsx` for the two shapes (stateless vs. controlled) most components
will follow.

## Using the component library elsewhere

```
import "{{packageScope}}/tokens/tokens.css";
import "{{packageScope}}/react/styles.css";
import { Button, Input } from "{{packageScope}}/react";
```

Both stylesheets need to load once, near your app's root. Components are
styled entirely through the CSS custom properties tokens.css defines.
