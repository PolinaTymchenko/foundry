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

async function main(): Promise<void> {
  clack.intro("create-react-foundry");

  const positionalName = process.argv[2];

  try {
    const { answers } = await runGenerator<ProjectAnswers>({
      definition: {
        id: "project",
        questions: projectQuestions,
        template: { root: templateRoot },
        hooks: projectHooks,
      },
      targetDir: (answers) => path.resolve(process.cwd(), answers.projectName),
      ...(positionalName ? { initialAnswers: { projectName: positionalName } } : {}),
    });

    clack.outro(
      [
        "Your project is ready.",
        "",
        `  cd ${answers.projectName}`,
        "  pnpm build",
        "",
        "There's nothing to build yet beyond the workspace itself —",
        "this early scaffold has no packages in it. That lands in the next milestone.",
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
