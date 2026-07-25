# Foundry

Foundry scaffolds enterprise React design systems — components, tokens, docs,
and CI, wired together from the first commit.

**Status: early development.** This repository currently contains only the
project-scaffolding engine (`packages/generator-core`) and the `create-react-foundry`
CLI it powers. There is no React support, token pipeline, or component
generator yet — those land in later milestones.

## What works today

```
npx create-react-foundry my-project
```

Scaffolds a minimal, correctly configured TypeScript monorepo (pnpm +
Turborepo, Changesets, CI) into `my-project`. Nothing else yet.

## Developing Foundry itself

```
pnpm install
pnpm build
pnpm test
pnpm lint
pnpm typecheck
```

Every package builds, tests, and lints independently via Turborepo. A
`dependency-cruiser` check (`pnpm lint:deps`) enforces that
`packages/generator-core` — the reusable engine — never depends on
`packages/create-react-foundry` or any other consumer of it.

## License

Apache-2.0. See [LICENSE](./LICENSE).
