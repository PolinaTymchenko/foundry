#!/usr/bin/env node
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as clack from "@clack/prompts";
import { PromptCancelledError, runGenerator } from "@foundryui/generator-core";
import { projectHooks } from "./hooks.js";
import { projectQuestions } from "./prompts.js";
import type { ProjectAnswers } from "./types.js";

const packageRoot = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const templateRoot = path.join(packageRoot, "templates", "base");

const TOKEN_PREFIX_PATTERN = /^[a-z][a-z0-9-]*$/;

/** Reads --name=value or --name value from argv; undefined if the flag isn't present. */
function parseFlag(argv: string[], name: string): string | undefined {
  const eqForm = argv.find((arg) => arg.startsWith(`--${name}=`));
  if (eqForm) {
    return eqForm.slice(`--${name}=`.length);
  }
  const flagIndex = argv.indexOf(`--${name}`);
  if (flagIndex !== -1 && argv[flagIndex + 1]) {
    return argv[flagIndex + 1];
  }
  return undefined;
}

async function main(): Promise<void> {
  clack.intro("create-react-foundry");

  const argv = process.argv.slice(2);
  const positionalName = argv.find((arg) => !arg.startsWith("-"));
  const tokenPrefix = parseFlag(argv, "token-prefix") ?? "fd";
  const packageScope = parseFlag(argv, "package-scope");

  if (!TOKEN_PREFIX_PATTERN.test(tokenPrefix)) {
    clack.log.error(
      `--token-prefix "${tokenPrefix}" is invalid. Use lowercase letters, numbers, and hyphens, starting with a letter.`,
    );
    process.exitCode = 1;
    return;
  }

  try {
    const { answers } = await runGenerator<ProjectAnswers>({
      definition: {
        id: "project",
        questions: projectQuestions,
        template: { root: templateRoot },
        hooks: projectHooks,
      },
      targetDir: (answers) => path.resolve(process.cwd(), answers.projectName),
      initialAnswers: {
        tokenPrefix,
        ...(positionalName ? { projectName: positionalName } : {}),
        ...(packageScope ? { packageScope } : {}),
      },
    });

    clack.outro(
      [
        "Your project is ready.",
        "",
        `  cd ${answers.projectName}`,
        "  pnpm dev",
        "",
        "That starts Storybook with a real Button component — variants,",
        "sizes, loading and disabled states, icon slots, and a passing",
        "accessibility check, ready to look at and modify.",
      ].join("\n"),
    );
  } catch (error) {
    if (error instanceof PromptCancelledError) {
      clack.cancel("Cancelled.");
      process.exitCode = 1;
      return;
    }
    clack.log.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}

void main();
