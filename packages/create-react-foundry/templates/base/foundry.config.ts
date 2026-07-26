/**
 * Project-level Foundry settings. `foundry generate component` reads
 * tokenPrefix from here so generated components use your project's
 * namespace without asking again — the canonical place project-wide
 * config lives, rather than each generator inventing its own mechanism.
 *
 * Editing tokenPrefix here does NOT regenerate
 * packages/tokens/src/tokens.css or already-generated components — it
 * only affects what new ones use. A config-driven token pipeline that
 * updates existing output is a later milestone, not this one.
 */
export const foundryConfig = {
  tokenPrefix: "{{tokenPrefix}}",
} as const;
