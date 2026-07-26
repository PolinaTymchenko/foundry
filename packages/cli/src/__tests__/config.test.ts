import { mkdtemp, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { readFoundryConfig } from "../config.js";

describe("readFoundryConfig", () => {
  let projectRoot: string;

  beforeEach(async () => {
    projectRoot = await mkdtemp(path.join(os.tmpdir(), "foundry-config-test-"));
  });

  afterEach(async () => {
    await rm(projectRoot, { recursive: true, force: true });
  });

  it("reads tokenPrefix from a real foundry.config.ts", async () => {
    await writeFile(
      path.join(projectRoot, "foundry.config.ts"),
      'export const foundryConfig = {\n  tokenPrefix: "acme",\n} as const;\n',
    );

    const config = await readFoundryConfig(projectRoot);
    expect(config.tokenPrefix).toBe("acme");
  });

  it("falls back to the default when foundry.config.ts doesn't exist", async () => {
    const config = await readFoundryConfig(projectRoot);
    expect(config.tokenPrefix).toBe("fd");
  });

  it("falls back to the default when the file exists but tokenPrefix can't be found", async () => {
    await writeFile(
      path.join(projectRoot, "foundry.config.ts"),
      "export const foundryConfig = {} as const;\n",
    );

    const config = await readFoundryConfig(projectRoot);
    expect(config.tokenPrefix).toBe("fd");
  });
});
