---
"create-react-foundry": patch
---

Fixes an intermittent `pnpm dev` crash in scaffolded projects. `turbo run dev` was scheduling each package's own watch-mode `dev` task (`tsup --watch` / `vite build --watch`) alongside a separately-triggered `build` task for the same package — one running as a `^build` dependency of `apps/web`/`apps/storybook`'s `dev` tasks — and both clean-and-write the same `dist/` directory concurrently. `turbo.json` now serializes each watched package's own `build` ahead of its own `dev` watcher, so the two no longer race.
