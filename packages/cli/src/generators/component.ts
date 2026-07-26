import path from "node:path";
import { fileURLToPath } from "node:url";
import type { GeneratorDefinition, Question } from "@foundryui/generator-core";
import { updateBarrelExports } from "../barrel.js";

export interface ComponentAnswers extends Record<string, unknown> {
  componentName: string;
  /** The Storybook title-grouping segment ("Atoms", "Molecules", ...) — see docs/adr, category is metadata, not an archetype. */
  category: string;
  /** Not a question — read from foundry.config.ts and injected by the caller. */
  tokenPrefix: string;
}

const packageRoot = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const templateRoot = path.join(packageRoot, "templates", "component");

const COMPONENT_NAME_PATTERN = /^[A-Z][A-Za-z0-9]*$/;

const questions: Array<Question<ComponentAnswers>> = [
  {
    name: "componentName",
    message: "Component name",
    type: "text",
    validate: (value) =>
      COMPONENT_NAME_PATTERN.test(value) ? undefined : 'Use PascalCase, e.g. "Card".',
  },
  {
    name: "category",
    message: "Component category",
    type: "select",
    default: "Atoms",
    choices: [
      { label: "Atom", value: "Atoms" },
      { label: "Molecule", value: "Molecules" },
      { label: "Organism", value: "Organisms" },
      { label: "Template", value: "Templates" },
    ],
  },
];

export interface CreateComponentGeneratorOptions {
  /** Absolute path to packages/react/src — where the component directory is rendered and the barrel lives. */
  reactSrcDir: string;
}

/**
 * The one registered artifact type today. Future types (hook, provider,
 * route, token — see the original generator design) register the same
 * way: a questions array, a template directory, and hooks — reusing this
 * exact shape, not a new mechanism.
 */
export function createComponentGenerator({
  reactSrcDir,
}: CreateComponentGeneratorOptions): GeneratorDefinition<ComponentAnswers> {
  return {
    id: "component",
    questions,
    template: { root: templateRoot },
    hooks: {
      async afterRender(ctx) {
        await updateBarrelExports(reactSrcDir, ctx.answers.componentName);
      },
    },
  };
}
