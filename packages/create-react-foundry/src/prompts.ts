import type { Question } from "@foundryui/generator-core";
import type { ProjectAnswers } from "./types.js";

type PartialAnswers = Partial<ProjectAnswers>;

const NAME_PATTERN = /^[a-z0-9][a-z0-9-]*$/;
const SCOPE_PATTERN = /^@[a-z0-9][a-z0-9-]*$/;

export const projectQuestions: Array<Question<ProjectAnswers>> = [
  {
    name: "projectName",
    message: "Project name",
    type: "text",
    default: "my-design-system",
    validate: (value) => {
      if (!NAME_PATTERN.test(value)) {
        return "Use lowercase letters, numbers, and hyphens only.";
      }
      return undefined;
    },
  },
  {
    name: "packageScope",
    message: "Package scope (publishes as {scope}/react, {scope}/tokens, ...)",
    type: "text",
    default: (answers: PartialAnswers) => {
      const base = String(answers.projectName ?? "my-design-system").split("-")[0];
      return `@${base}`;
    },
    validate: (value) => {
      if (!SCOPE_PATTERN.test(value)) {
        return 'Use an npm scope starting with "@", e.g. "@acme".';
      }
      return undefined;
    },
  },
  {
    name: "initGit",
    message: "Initialize a git repository?",
    type: "confirm",
    default: true,
  },
];
