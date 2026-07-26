import { mkdtemp, readdir, readFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { renderTemplate } from "@foundryui/generator-core";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

const here = path.dirname(fileURLToPath(import.meta.url));
const templateRoot = path.resolve(here, "../../templates/component");

describe("the component artifact template", () => {
  let targetDir: string;

  beforeEach(async () => {
    targetDir = await mkdtemp(path.join(os.tmpdir(), "foundry-component-template-test-"));
  });

  afterEach(async () => {
    await rm(targetDir, { recursive: true, force: true });
  });

  it("renders every file with the component name substituted, in filenames and content, with no leftover placeholders", async () => {
    const written = await renderTemplate({
      templateRoot,
      targetDir,
      variables: { componentName: "Card", category: "Atoms", tokenPrefix: "fd" },
    });

    expect(written.length).toBe(5);

    const names = (await readdir(targetDir)).sort();
    expect(names).toEqual(
      ["Card.module.css", "Card.stories.tsx", "Card.test.tsx", "Card.tsx", "index.ts"].sort(),
    );

    for (const filePath of written) {
      const content = await readFile(filePath, "utf8");
      expect(content).not.toMatch(/\{\{.*?\}\}/);
    }

    const component = await readFile(path.join(targetDir, "Card.tsx"), "utf8");
    expect(component).toContain("export const Card");
    expect(component).toContain("export interface CardProps");
    expect(component).toContain("forwardRef");
    expect(component).toContain('component: "Card"');

    const stories = await readFile(path.join(targetDir, "Card.stories.tsx"), "utf8");
    expect(stories).toContain('title: "Atoms/Card"');

    const css = await readFile(path.join(targetDir, "Card.module.css"), "utf8");
    expect(css).toContain("--fd-font-sans");

    const barrel = await readFile(path.join(targetDir, "index.ts"), "utf8");
    expect(barrel).toBe(
      'export { Card } from "./Card.js";\nexport type { CardProps } from "./Card.js";\n',
    );
  });
});
