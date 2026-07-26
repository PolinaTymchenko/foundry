# 0004 — Testing Strategy

**Status:** Accepted

## Context

The project's a11y-first claim only means something if it's clear what
actually gets tested where. Without an explicit split, the same concern
(does this button announce correctly to a screen reader?) risks being
tested twice in incompatible, redundant ways, or — worse — assumed to be
covered by the other layer and tested by neither.

## Decision

- **Vitest + React Testing Library**, co-located as `ComponentName.test.tsx`,
  covers: rendering, ref forwarding, keyboard and interaction behavior,
  controlled *and* uncontrolled behavior for any component using
  `useControlledState`, and the presence of correct ARIA attributes
  (`aria-busy`, `aria-invalid`, `aria-describedby`, ...). This layer tests
  behavior and correctness — not visual accessibility scanning.
- **`afterEach(cleanup)` is required in every package's `vitest.setup.ts`.**
  Vitest without `globals: true` does not auto-register React Testing
  Library's cleanup; skipping this was a real bug in Milestone 2 — DOM
  state leaked across tests in the same file and made role queries
  non-deterministic depending on run order.
- **Automated accessibility scanning (axe) happens exclusively at the
  Storybook-story level**, via `@storybook/test-runner` against every
  story a component exports. It is not duplicated as a jsdom-based axe
  check inside Vitest — one concern, one layer, one gate.
- **Every component ships a `Default` story and one story per
  meaningfully distinct state** (not a full combinatorial matrix of every
  prop combination) — curated over combinatorially complete, matching the
  same restraint principle applied to codegen output generally.

## Consequences

A component with no stories has no automated accessibility coverage —
story authorship isn't optional polish, it's the mechanism the a11y gate
actually runs through. A component that behaves correctly in Vitest but
was never given a story demonstrating a particular state (e.g. an error
state) ships that state unchecked.
