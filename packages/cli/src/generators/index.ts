import { createComponentGenerator } from "./component.js";

/**
 * The entire extensibility story for future artifact types (hook,
 * provider, route, token — see the original generator design) is adding
 * an entry here. Each factory takes the shared project context and
 * returns a GeneratorDefinition that runGenerator already knows how to
 * run — no per-type dispatch logic beyond this lookup.
 */
export const artifactGenerators = {
  component: createComponentGenerator,
} as const;

export type ArtifactType = keyof typeof artifactGenerators;

export function isArtifactType(value: string): value is ArtifactType {
  return value in artifactGenerators;
}
