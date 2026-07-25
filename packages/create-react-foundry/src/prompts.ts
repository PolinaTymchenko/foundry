import type { Question } from "@foundryui/generator-core";
import type { ProjectAnswers } from "./types.js";

const NAME_PATTERN = /^[a-z0-9][a-z0-9-]*$/;

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
    name: "initGit",
    message: "Initialize a git repository?",
    type: "confirm",
    default: true,
  },
];
