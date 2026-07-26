#!/usr/bin/env node
import { access } from "node:fs/promises";
import path from "node:path";
import * as clack from "@clack/prompts";
import { parseFlag, reportGeneratorError, runGenerator } from "@foundryui/generator-core";
import { readFoundryConfig } from "./config.js";
import { artifactGenerators, isArtifactType } from "./generators/index.js";

const CATEGORY_FLAG_VALUES: Record<string, string> = {
  atom: "Atoms",
  molecule: "Molecules",
  organism: "Organisms",
  template: "Templates",
};

function printUsage(): void {
  clack.log.error(
    [
      "Usage: foundry generate <type> <name>",
      "",
      `Supported types: ${Object.keys(artifactGenerators).join(", ")}`,
    ].join("\n"),
  );
}

async function main(): Promise<void> {
  const argv = process.argv.slice(2);
  const [verb, type, name] = argv;

  if (verb !== "generate" || !type || !isArtifactType(type)) {
    printUsage();
    process.exitCode = 1;
    return;
  }

  const projectRoot = process.cwd();
  const reactSrcDir = path.join(projectRoot, "packages", "react", "src");

  try {
    await access(reactSrcDir);
  } catch {
    clack.log.error(
      `Couldn't find packages/react/src under ${projectRoot}. Run this from your project's root.`,
    );
    process.exitCode = 1;
    return;
  }

  clack.intro(`foundry generate ${type}`);

  const { tokenPrefix } = await readFoundryConfig(projectRoot);
  const categoryFlag = parseFlag(argv, "category");
  const category = categoryFlag ? CATEGORY_FLAG_VALUES[categoryFlag.toLowerCase()] : undefined;

  if (categoryFlag && !category) {
    clack.log.error(
      `--category "${categoryFlag}" is not recognized. Use atom, molecule, organism, or template.`,
    );
    process.exitCode = 1;
    return;
  }

  // Only "component" is registered today; this stays generic on purpose
  // so a second artifact type doesn't need this dispatch rewritten.
  const definition = artifactGenerators[type]({ reactSrcDir });

  try {
    const { answers, targetDir, filesWritten } = await runGenerator({
      definition,
      targetDir: (a) => path.join(reactSrcDir, a.componentName),
      initialAnswers: {
        tokenPrefix,
        ...(name ? { componentName: name } : {}),
        ...(category ? { category } : {}),
      },
    });

    clack.log.success(
      [
        ...filesWritten.map((filePath) => `✔ ${path.relative(projectRoot, filePath)}`),
        `✔ Updated ${path.relative(projectRoot, path.join(reactSrcDir, "index.ts"))}`,
      ].join("\n"),
    );

    clack.outro(
      `${answers.componentName} is ready — ${path.relative(projectRoot, path.join(targetDir, `${answers.componentName}.tsx`))}`,
    );
  } catch (error) {
    reportGeneratorError(error);
  }
}

void main();
