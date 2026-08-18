# create-react-foundry

## 0.3.0

### Minor Changes

- 6d08dff: Scaffolds an `apps/web` app alongside Storybook: a Vite + React shell wired to `packages/react`, with an optional TanStack Query/Form/Table demo backed by a mock API (`apps/web/src/api/tasks.ts`) that's safe to delete if you don't want it. `pnpm dev` now opens both the app (`:5173`) and Storybook (`:6006`).

### Patch Changes

- 6d08dff: Adds a README to each published package, shown on its npm page.
- 6d08dff: Fixes the scaffolded project's `@foundryui/cli` dependency, pinned to `^0.1.0` since Milestone 3 and never bumped. Since `^0.1.0` excludes `0.2.x` under semver, every fresh scaffold was silently installing the pre-0.2.0 `foundry generate` behavior (flat `src/ComponentName/` output, no category subfolders) instead of what's documented in the README. Now pinned to `^0.2.0`.
- Updated dependencies [6d08dff]
  - @foundryui/generator-core@0.1.1

## 0.2.0

### Minor Changes

- 924df3e: `create-react-foundry` no longer asks for a package scope during scaffolding — most projects never publish anywhere, so it's derived from the project name automatically. Override it with `--package-scope` if you do plan to publish.

  `foundry generate component` now creates components under a category subfolder (`packages/react/src/Atoms/ComponentName/`, `Molecules/`, etc.) instead of directly under `src/`, creating the category folder if it doesn't exist yet. `Button` and `Input` moved to `Atoms/` for consistency. See ADR-0005.

## 0.1.0

### Minor Changes

- Initial release. `npm create react-foundry` scaffolds a React component library monorepo: design tokens as CSS custom properties, `Button` and `Input` with keyboard and screen-reader behavior, a working Storybook, an accessibility gate (`eslint-plugin-jsx-a11y` plus axe via Storybook's test runner), Vitest and React Testing Library, and CI via Turborepo and GitHub Actions.
