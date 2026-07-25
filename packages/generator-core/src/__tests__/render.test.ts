import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { renderTemplate, substitute } from "../render.js";

describe("substitute", () => {
  it("replaces {{variables}} with provided values", () => {
    expect(substitute("Hello {{name}}", { name: "Foundry" })).toBe("Hello Foundry");
  });

  it("leaves text with no placeholders untouched", () => {
    expect(substitute("no placeholders here", {})).toBe("no placeholders here");
  });

  it("throws on a variable that wasn't provided", () => {
    expect(() => substitute("{{missing}}", {})).toThrow(/unknown variable/);
  });
});

describe("renderTemplate", () => {
  let base: string;
  let templateRoot: string;
  let targetDir: string;

  beforeEach(async () => {
    base = await mkdtemp(path.join(os.tmpdir(), "foundry-render-test-"));
    templateRoot = path.join(base, "template");
    targetDir = path.join(base, "target");
    await mkdir(path.join(templateRoot, "src"), { recursive: true });
    await writeFile(path.join(templateRoot, "package.json"), '{"name": "{{projectName}}"}');
    await writeFile(
      path.join(templateRoot, "src", "{{projectName}}.config.ts"),
      'export const name = "{{projectName}}";\n',
    );
  });

  afterEach(async () => {
    await rm(base, { recursive: true, force: true });
  });

  it("substitutes variables in file contents and in file/directory names", async () => {
    const written = await renderTemplate({
      templateRoot,
      targetDir,
      variables: { projectName: "acme" },
    });

    expect(written).toHaveLength(2);

    const pkg = await readFile(path.join(targetDir, "package.json"), "utf8");
    expect(pkg).toBe('{"name": "acme"}');

    const config = await readFile(path.join(targetDir, "src", "acme.config.ts"), "utf8");
    expect(config).toContain('export const name = "acme";');
  });
});
