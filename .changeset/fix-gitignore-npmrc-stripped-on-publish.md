---
"create-react-foundry": patch
---

Fixes every scaffolded project shipping without a `.gitignore` or `.npmrc`. Both files existed in the template since Milestone 1, but npm hardcodes `.gitignore` and `.npmrc` onto its always-ignore list during packing, silently stripping them from every published tarball regardless of the package's `files` config. The template now ships them as `_gitignore`/`_npmrc` and renames them to their real names during scaffolding, before `git init`/`git add -A` runs — so `git add -A` no longer stages `node_modules/` and `.DS_Store` into the first commit.
