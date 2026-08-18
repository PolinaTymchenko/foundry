---
"create-react-foundry": patch
---

Fixes the scaffolded project's `@foundryui/cli` dependency, pinned to `^0.1.0` since Milestone 3 and never bumped. Since `^0.1.0` excludes `0.2.x` under semver, every fresh scaffold was silently installing the pre-0.2.0 `foundry generate` behavior (flat `src/ComponentName/` output, no category subfolders) instead of what's documented in the README. Now pinned to `^0.2.0`.
