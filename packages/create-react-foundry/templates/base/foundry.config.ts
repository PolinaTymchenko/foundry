/**
 * Project-level Foundry settings. `foundry generate component` reads
 * tokenPrefix from here so generated components use your project's
 * namespace without asking again. This is the one place project-wide
 * config lives, instead of each generator inventing its own mechanism.
 *
 * Editing tokenPrefix here does not regenerate packages/tokens/src/tokens.css
 * or already-generated components. It only affects what new ones use. A
 * config-driven token pipeline that updates existing output is a later
 * milestone, not this one.
 */
export const foundryConfig = {
  tokenPrefix: "{{tokenPrefix}}",
} as const;
