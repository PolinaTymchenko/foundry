# 0005 — Category Folders

**Status:** Accepted

## Context

ADR-0003 put every component directly under `packages/react/src/ComponentName/`,
with category (Atom, Molecule, Organism, Template) used only for Storybook's
sidebar grouping. In practice, a library organized this way loses the
category information the moment you look at the filesystem instead of
Storybook — `src/Card/` doesn't say whether Card is an atom or an organism,
and a library with even a few dozen components becomes a flat, unsorted list
in the one place (the file tree) developers look at most.

## Decision

- **A component's directory lives under its category**:
  `packages/react/src/{Category}/ComponentName/`, where `{Category}` is one
  of `Atoms`, `Molecules`, `Organisms`, `Templates` — the same values
  already used for Storybook's grouping (ADR-0003, ADR-0001). Category is
  still not an archetype: every category renders the same generic component
  shape from the same template. It now determines a folder in addition to a
  Storybook section, nothing more.
- **`foundry generate component` creates the category folder if it doesn't
  exist yet.** This isn't a separate step — `packages/react/src/{Category}/`
  and `packages/react/src/{Category}/ComponentName/` are created together by
  the same recursive directory creation the generator already does for any
  new target directory.
- **The barrel (`packages/react/src/index.ts`) re-exports through the
  category path**: `export { Card } from "./Molecules/Card/index.js";`. The
  generator writes this automatically, same as before ADR-0005 — only the
  path changed.
- **Button and Input moved to `Atoms/`** for consistency with every
  component generated from here on, since both were already titled
  "Atoms/Button" and "Atoms/Input" in Storybook.

## Consequences

Every component's relative imports into `packages/react/src/internal/` go
one directory deeper (`../../internal/...` instead of `../internal/...`),
since a component's own folder now sits under a category folder rather than
directly under `src/`. The generic component template and the hand-written
Button/Input were updated together so nothing keeps the old depth.

A project with only one component per category has an extra directory level
for no real organizational benefit yet — that's an acceptable, self-correcting
cost: the categorization pays off exactly when a library grows past a
handful of components, which is also when a flat `src/` would have become
hard to scan anyway.
