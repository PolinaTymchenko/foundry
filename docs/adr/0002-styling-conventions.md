# 0002 — Styling Conventions

**Status:** Accepted

## Context

Zero-runtime CSS was already decided before Milestone 1 — no CSS-in-JS,
ever. Within that constraint, Button shipped in Milestone 2 with plain,
hand-scoped global CSS (`.fd-button`, `.fd-button--primary`, ...) and
naming discipline as the only collision protection. That's fine for one
component. It stops being fine somewhere between component 5 and component
50, and retrofitting scoping onto a few dozen already-generated components
is a real migration, not a find-and-replace. Deciding now, before Input and
the generator both depend on the old convention, is close to free.

## Decision

- **Component styles are CSS Modules** (`ComponentName.module.css`),
  co-located with the component they style. Class names are scoped by the
  build tool, not by a naming convention — no more `fd-` prefixing or BEM
  modifiers needed for collision avoidance.
- **Design tokens stay global, plain CSS** (`packages/tokens/src/tokens.css`),
  never a module. Custom properties have to cascade from a single global
  scope to be overridable by a consuming app; scoping them would defeat the
  purpose.
- **Runtime-variable styling (variant, size, state) is expressed via
  `data-*` attribute selectors inside the module** (`.button[data-variant="primary"]`),
  not via conditional class composition. A component exports one base
  module class, and the attribute it already sets for other reasons
  (ADR-0001) does the styling work. This avoids a classnames/clsx-style
  dependency for what's a small, closed set of states.
- **Combining the module class with a consumer-supplied `className`** is a
  plain `[styles.button, className].filter(Boolean).join(" ")` — no
  dependency for this either.
- **No CSS-in-JS, runtime or otherwise.** Restated here, not just at the
  project level, because "how do I style this new component" is exactly
  the moment someone reaches for what they already know.

## Consequences

Adding a component means adding a new `.module.css` file, never appending
to a shared stylesheet. tsup currently bundles each package's CSS Modules
into one output file per package — fine at today's scale (2 components),
worth revisiting once the library is large enough that most consumers only
use a handful of components and pay for all of them anyway.
