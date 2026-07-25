# Changesets

Every PR that changes a published package needs a changeset:
`pnpm changeset`. CI (`changeset-check.yml`) fails the PR otherwise — this is
a gate, not a suggestion. See https://github.com/changesets/changesets.
