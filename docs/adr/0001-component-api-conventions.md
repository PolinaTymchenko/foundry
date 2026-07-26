# 0001 — Component API Conventions

**Status:** Accepted

## Context

Button was the only reference component through Milestone 2. Every naming
choice it made — `loading`, `iconStart`/`iconEnd`, `data-variant` — existed
as an implicit pattern in one file, not a decision. Milestone 3's generator
will replicate whatever it finds. With one example, it has nothing to
generalize from; it can only copy. This ADR makes the patterns explicit
before a second component (Input) and the generator both start depending on
them, and settles the controlled/uncontrolled shape Button never needed.

## Decision

- **Boolean props that shadow or extend a native HTML concept use the native
  name**: `disabled`, `loading`, `required` — not `isDisabled`, `isLoading`,
  `isRequired`. Introduce an `is`/`has` prefix only for state with no native
  HTML equivalent.
- **Style-axis props are named `variant` and `size`** across every
  component that has them. `size` is always the scale `"sm" | "md" | "lg"`
  unless a component has a documented reason to differ.
- **Icon slot props are `iconStart` / `iconEnd`** for components that
  support leading/trailing icons.
- **Every interactive or focusable primitive forwards its ref** via
  `forwardRef`. Not a per-component choice — an invariant, the same
  reasoning as the generator design that removed it as a question.
- **Style-relevant prop values are mirrored as `data-*` attributes** on the
  component's root element (`data-variant`, `data-size`, `data-loading`,
  `data-invalid`) — the styling layer's hook (see ADR-0002), and available
  for E2E selectors incidentally.
- **Controlled/uncontrolled state uses the shared `useControlledState`
  hook** (`packages/react/src/internal/useControlledState.ts`) — never
  hand-rolled per component. The dual-mode prop triad is `value` /
  `defaultValue`, and the change handler is `onChange: (value: T) => void`
  — the resolved value, not a raw DOM event. Consumers who need the event
  itself are the exception, not the default case being designed for.
- **Components with a possible "no accessible name" state** call the shared
  `warnIfMissingAccessibleName` utility (`packages/react/src/internal/a11y.ts`)
  in development — never a bespoke inline check.

## Consequences

New components must use these names even when a different name feels more
locally natural — cross-library consistency matters more than one
component's local optimum. Any of these conventions is, in effect, load-bearing
API surface the moment the generator (Milestone 3) starts encoding it into
every new component: changing a name after that means a mass, breaking
rename across the whole library, not a one-file edit.
