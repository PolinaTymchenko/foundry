import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { updateBarrelExports } from "../barrel.js";

describe("updateBarrelExports", () => {
  let reactSrcDir: string;

  beforeEach(async () => {
    reactSrcDir = await mkdtemp(path.join(os.tmpdir(), "foundry-barrel-test-"));
  });

  afterEach(async () => {
    await rm(reactSrcDir, { recursive: true, force: true });
  });

  it("creates the barrel file if it doesn't exist yet", async () => {
    await updateBarrelExports(reactSrcDir, "Atoms", "Card");

    const content = await readFile(path.join(reactSrcDir, "index.ts"), "utf8");
    expect(content).toBe(
      'export { Card } from "./Atoms/Card/index.js";\nexport type { CardProps } from "./Atoms/Card/index.js";\n',
    );
  });

  it("appends to an existing barrel without disturbing what's already there", async () => {
    await mkdir(reactSrcDir, { recursive: true });
    await writeFile(
      path.join(reactSrcDir, "index.ts"),
      'export { Button } from "./Atoms/Button/index.js";\nexport type { ButtonProps } from "./Atoms/Button/index.js";\n',
    );

    await updateBarrelExports(reactSrcDir, "Molecules", "Card");

    const content = await readFile(path.join(reactSrcDir, "index.ts"), "utf8");
    expect(content).toContain('export { Button } from "./Atoms/Button/index.js";');
    expect(content).toContain('export { Card } from "./Molecules/Card/index.js";');
    expect(content).toContain('export type { CardProps } from "./Molecules/Card/index.js";');
  });

  it("is idempotent — running it twice for the same component doesn't duplicate lines", async () => {
    await updateBarrelExports(reactSrcDir, "Atoms", "Card");
    await updateBarrelExports(reactSrcDir, "Atoms", "Card");

    const content = await readFile(path.join(reactSrcDir, "index.ts"), "utf8");
    expect(content.match(/export \{ Card \}/g)).toHaveLength(1);
  });
});
