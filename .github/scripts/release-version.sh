#!/bin/sh
# Invoked by changesets/action as the `version` command. `changeset version`
# rewrites package.json (version bumps, workspace: dependency ranges) in a
# way that doesn't match Biome's formatting rules, which otherwise fails
# CI's format:check on every real release. Reformatting immediately after
# is cheaper than special-casing the release PR out of that check.
set -e

pnpm changeset version
pnpm format
