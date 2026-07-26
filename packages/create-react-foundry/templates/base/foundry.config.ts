/**
 * Project-level Foundry settings. This file is the canonical place later
 * tooling (the component generator, the token pipeline) reads project
 * configuration from, rather than each inventing its own mechanism.
 *
 * Editing tokenPrefix here does NOT currently regenerate
 * packages/tokens/src/tokens.css — this file only records what was chosen
 * at `create-react-foundry` time. A config-driven token pipeline that reads
 * this live is a later milestone, not this one.
 */
export const foundryConfig = {
  tokenPrefix: "{{tokenPrefix}}",
} as const;
