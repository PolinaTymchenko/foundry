#!/bin/sh
# Invoked by changesets/action as the `publish` command. Kept as a real
# script rather than an inline `publish:` string in release.yml because
# changesets/action tokenizes that string itself and mangles nested
# quoting (confirmed empirically: it stripped the quotes around
# "$NODE_AUTH_TOKEN" and broke on the echo message's punctuation).
set -e

if [ -n "$NODE_AUTH_TOKEN" ]; then
  pnpm release
else
  echo "NPM_TOKEN secret not set - skipping publish. Add it in repo settings when ready to publish for real (see CONTRIBUTING.md)."
fi
