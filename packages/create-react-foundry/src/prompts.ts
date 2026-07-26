import type { Question } from "@foundryui/generator-core";
import type { ProjectAnswers } from "./types.js";

const NAME_PATTERN = /^[a-z0-9][a-z0-9-]*$/;

/**
 * Matches the shape a package scope's positional argument must have when
 * given via --package-scope. Exported so index.ts can validate the flag the
 * same way this file used to validate the (now removed) interactive prompt.
 */
export const SCOPE_PATTERN = /^@[a-z0-9][a-z0-9-]*$/;

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
