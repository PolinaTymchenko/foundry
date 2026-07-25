import { mkdtemp, readFile, readdir, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { renderTemplate } from "@foundryui/generator-core";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

const here = path.dirname(fileURLToPath(import.meta.url));
const templateRoot = path.resolve(here, "../../templates/base");

describe("the base template", () => {
  let targetDir: string;

  beforeEach(async () => {
    targetDir = await mkdtemp(path.join(os.tmpdir(), "foundry-base-template-test-"));
  });

  afterEach(async () => {
    await rm(targetDir, { recursive: true, force: true });
  });

  it("renders into a valid, self-consistent monorepo shell with no leftover placeholders", async () => {
    const written = await renderTemplate({
      templateRoot,
      targetDir,
      variables: { projectName: "acme-design-system" },
    });

    expect(written.length).toBeGreaterThan(0);

    for (const filePath of written) {
      const content = await readFile(filePath, "utf8");
      expect(content).not.toMatch(/\{\{.*?\}\}/);
    }

    const pkg = JSON.parse(await readFile(path.join(targetDir, "package.json"), "utf8")) as {
      name: string;
      packageManager: string;
    };
    expect(pkg.name).toBe("acme-design-system");
    expect(pkg.packageManager).toMatch(/^pnpm@/);

    const workspaceRoot = await readdir(targetDir);
    expect(workspaceRoot).toContain("pnpm-workspace.yaml");
    expect(workspaceRoot).toContain("turbo.json");
    expect(workspaceRoot).toContain(".github");
  });
});
