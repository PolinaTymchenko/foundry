# Foundry

Foundry scaffolds enterprise React design systems — components, tokens, docs,
and CI, wired together from the first commit.

**Status: pre-v0.1.** The core loop works end to end and is verified on
every milestone: scaffold a project, get a real styled component library
with a working Storybook and a passing accessibility gate, generate new
components with one command. `@foundryui/generator-core` and
`@foundryui/cli` are not published to npm yet — see
[Publishing status](#publishing-status) below before trying this against a
real project.

## What works today

```
npx create-react-foundry my-project
```

Scaffolds a real component library, not an empty shell: design tokens as
CSS custom properties, `Button` and `Input` (variants, sizes, loading and
disabled states, controlled/uncontrolled form state, full keyboard and
screen-reader behavior), a working Storybook, and a non-optional
accessibility gate (`eslint-plugin-jsx-a11y` + axe via Storybook's test
runner) — verified against zero violations on every milestone, not just
configured.

```
cd my-project
pnpm generate component Card
```

Generates a new, convention-following component — `.tsx`, `.module.css`,
`.stories.tsx`, `.test.tsx`, `index.ts` — and wires it into the barrel
export automatically. See `docs/adr/` for the conventions it follows.

## Publishing status

`create-react-foundry` is the only package published so far. Projects it
scaffolds depend on `@foundryui/cli` and `@foundryui/generator-core`,
neither of which is on npm yet — a freshly scaffolded project's automatic
`pnpm install` will fail on `@foundryui/cli` until that changes. This is
the primary blocker to an actual v0.1 release, not a bug in what's built.

## Repository layout

- `packages/generator-core` — the framework-agnostic engine every
  generator (the project scaffolder, the artifact generator) is built on:
  prompts, template rendering, lifecycle hooks. Knows nothing about
  "projects" or "components."
- `packages/create-react-foundry` — `npm create react-foundry`. Scaffolds
  a new project once. Its template lives at
  `packages/create-react-foundry/templates/base`.
- `packages/cli` — `foundry generate ...`. The ongoing, in-project CLI a
  scaffolded project depends on afterward. Component generation is the
  only registered artifact type today; the registry
  (`packages/cli/src/generators/index.ts`) is where a second type would
  be added.
- `docs/adr/` — the component API, styling, folder-structure, and testing
  conventions the generator encodes. Read these before changing what gets
  generated.

## Developing Foundry itself

```
pnpm install
pnpm build
pnpm test
pnpm lint
pnpm lint:deps
pnpm typecheck
pnpm format:check
```

Every package builds, tests, and lints independently via Turborepo.
`pnpm lint:deps` enforces that `packages/generator-core` — the reusable
engine — never depends on any of its own consumers.

## License

Apache-2.0. See [LICENSE](./LICENSE).
