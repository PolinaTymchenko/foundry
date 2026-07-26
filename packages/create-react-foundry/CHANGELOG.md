# create-react-foundry

## 0.2.0

### Minor Changes

- 924df3e: `create-react-foundry` no longer asks for a package scope during scaffolding — most projects never publish anywhere, so it's derived from the project name automatically. Override it with `--package-scope` if you do plan to publish.

  `foundry generate component` now creates components under a category subfolder (`packages/react/src/Atoms/ComponentName/`, `Molecules/`, etc.) instead of directly under `src/`, creating the category folder if it doesn't exist yet. `Button` and `Input` moved to `Atoms/` for consistency. See ADR-0005.

## 0.1.0

### Minor Changes

- Initial release. `npm create react-foundry` scaffolds a React component library monorepo: design tokens as CSS custom properties, `Button` and `Input` with keyboard and screen-reader behavior, a working Storybook, an accessibility gate (`eslint-plugin-jsx-a11y` plus axe via Storybook's test runner), Vitest and React Testing Library, and CI via Turborepo and GitHub Actions.
