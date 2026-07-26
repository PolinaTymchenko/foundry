# 0003 — Folder Structure

**Status:** Accepted

## Context

The directory-per-component convention was designed in the original
architecture work and demonstrated exactly once, by Button. Input is the
second proof that the shape generalizes rather than being an accident of
Button's specific needs. This ADR also gives shared, non-public code
(ADR-0001's utilities) an explicit, agreed home instead of an ad hoc one.

## Decision

- **`packages/react/src/ComponentName/`** contains `ComponentName.tsx`,
  `ComponentName.module.css`, `ComponentName.stories.tsx`,
  `ComponentName.test.tsx`, and `index.ts`.
- **`index.ts` re-exports only the component's public surface**: the
  component itself and its public prop/variant types. Nothing internal.
- **`packages/react/src/index.ts` is the package barrel**, re-exporting
  every component's public surface. This is the only file that changes to
  make a new component importable from `{{packageScope}}/react`.
- **Shared, internal-only code lives in `packages/react/src/internal/`**
  and is never re-exported from the package root. Utilities used by more
  than one component (or generically reusable even before a second caller
  exists) go here, not duplicated inline per component.
- **A component "exists"**, meaning discoverable by future tooling (the
  registry, the generator's own validation), **if and only if its directory
  exports a default component from `index.ts`.** This is the same discovery
  convention the documentation-system design already committed to; this ADR
  confirms it holds at the folder-structure level too.

## Consequences

`internal/` is a real API boundary, not just a naming convention. Code there
isn't meant to be imported by consumers, even though nothing currently
enforces that beyond it not being re-exported from the barrel.
Worth an explicit lint rule (no importing from `*/internal/*` outside the
package) once there's more than one internal module at stake; not urgent
at two.
