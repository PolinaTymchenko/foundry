import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { runGenerator } from "../generator.js";
import type { GeneratorDefinition } from "../types.js";

interface Answers extends Record<string, unknown> {
  projectName: string;
}

describe("runGenerator", () => {
  let base: string;
  let templateRoot: string;
  let targetDir: string;

  beforeEach(async () => {
    base = await mkdtemp(path.join(os.tmpdir(), "foundry-generator-test-"));
    templateRoot = path.join(base, "template");
    targetDir = path.join(base, "target");
    await mkdir(templateRoot, { recursive: true });
    await writeFile(path.join(templateRoot, "README.md"), "# {{projectName}}\n");
  });

  afterEach(async () => {
    await rm(base, { recursive: true, force: true });
  });

  it("runs beforeRender and afterRender hooks around the render, in order", async () => {
    const calls: string[] = [];
    const definition: GeneratorDefinition<Answers> = {
      id: "test-generator",
      questions: [{ name: "projectName", message: "Project name?", type: "text" }],
      template: { root: templateRoot },
      hooks: {
        beforeRender: () => {
          calls.push("before");
        },
        afterRender: () => {
          calls.push("after");
        },
      },
    };

    const result = await runGenerator({
      definition,
      targetDir,
      initialAnswers: { projectName: "acme" },
    });

    expect(calls).toEqual(["before", "after"]);
    expect(result.answers.projectName).toBe("acme");
    expect(result.filesWritten).toHaveLength(1);

    const readme = await readFile(path.join(targetDir, "README.md"), "utf8");
    expect(readme).toBe("# acme\n");
  });

  it("resolves a function targetDir from the collected answers", async () => {
    const definition: GeneratorDefinition<Answers> = {
      id: "test-generator",
      questions: [{ name: "projectName", message: "Project name?", type: "text" }],
      template: { root: templateRoot },
    };

    const result = await runGenerator({
      definition,
      targetDir: (answers) => path.join(base, "resolved", answers.projectName),
      initialAnswers: { projectName: "acme" },
    });

    expect(result.targetDir).toBe(path.join(base, "resolved", "acme"));
    const readme = await readFile(path.join(result.targetDir, "README.md"), "utf8");
    expect(readme).toBe("# acme\n");
  });

  it("refuses to render into a non-empty target directory", async () => {
    await mkdir(targetDir, { recursive: true });
    await writeFile(path.join(targetDir, "existing.txt"), "already here");

    const definition: GeneratorDefinition<Answers> = {
      id: "test-generator",
      questions: [{ name: "projectName", message: "Project name?", type: "text" }],
      template: { root: templateRoot },
    };

    await expect(
      runGenerator({ definition, targetDir, initialAnswers: { projectName: "acme" } }),
    ).rejects.toThrow(/already exists and is not empty/);
  });
});
