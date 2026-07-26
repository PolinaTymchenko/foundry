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

// Keys here are deliberately lowercase and match `license.toLowerCase()`
// exactly — hooks.ts's finalizeLicense derives the file-selection key back
// from the SPDX id this way, rather than threading a second field through.
const LICENSE_SPDX: Record<string, string> = {
  "apache-2.0": "Apache-2.0",
  mit: "MIT",
};

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
  const licenseKey = (parseFlag(argv, "license") ?? "apache-2.0").toLowerCase();

  if (!TOKEN_PREFIX_PATTERN.test(tokenPrefix)) {
    clack.log.error(
      `--token-prefix "${tokenPrefix}" is invalid. Use lowercase letters, numbers, and hyphens, starting with a letter.`,
    );
    process.exitCode = 1;
    return;
  }

  const license = LICENSE_SPDX[licenseKey];
  if (!license) {
    clack.log.error(`--license "${licenseKey}" is not supported. Use "apache-2.0" or "mit".`);
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
        license,
        currentYear: String(new Date().getFullYear()),
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
        "That starts Storybook with two real components — Button and Input —",
        "covering variants, loading and disabled states, controlled and",
        "uncontrolled form state, and a passing accessibility check.",
        "Ready to look at and modify.",
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
