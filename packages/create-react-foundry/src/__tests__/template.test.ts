import { mkdtemp, readFile, readdir, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { renderTemplate } from "@foundryui/generator-core";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

const here = path.dirname(fileURLToPath(import.meta.url));
const templateRoot = path.resolve(here, "../../templates/base");

const baseVariables = {
  projectName: "acme-design-system",
  packageScope: "@acme",
  tokenPrefix: "fd",
  license: "Apache-2.0",
  currentYear: "2026",
};

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
      variables: baseVariables,
    });

    expect(written.length).toBeGreaterThan(0);

    for (const filePath of written) {
      const content = await readFile(filePath, "utf8");
      expect(content).not.toMatch(/\{\{.*?\}\}/);
    }

    const pkg = JSON.parse(await readFile(path.join(targetDir, "package.json"), "utf8")) as {
      name: string;
      packageManager: string;
      license: string;
    };
    expect(pkg.name).toBe("acme-design-system");
    expect(pkg.packageManager).toMatch(/^pnpm@/);
    expect(pkg.license).toBe("Apache-2.0");

    const workspaceRoot = await readdir(targetDir);
    expect(workspaceRoot).toContain("pnpm-workspace.yaml");
    expect(workspaceRoot).toContain("turbo.json");
    expect(workspaceRoot).toContain(".github");
    expect(workspaceRoot).toContain("apps");
  });

  it("scopes generated package names and CSS token names using the answered values", async () => {
    await renderTemplate({
      templateRoot,
      targetDir,
      variables: baseVariables,
    });

    const tokensPkg = JSON.parse(
      await readFile(path.join(targetDir, "packages/tokens/package.json"), "utf8"),
    ) as { name: string; license: string };
    expect(tokensPkg.name).toBe("@acme/tokens");
    expect(tokensPkg.license).toBe("Apache-2.0");

    const reactPkg = JSON.parse(
      await readFile(path.join(targetDir, "packages/react/package.json"), "utf8"),
    ) as { name: string; dependencies: Record<string, string> };
    expect(reactPkg.name).toBe("@acme/react");
    expect(reactPkg.dependencies["@acme/tokens"]).toBe("workspace:*");

    const tokensCss = await readFile(
      path.join(targetDir, "packages/tokens/src/tokens.css"),
      "utf8",
    );
    expect(tokensCss).toContain("--fd-color-primary");
    expect(tokensCss).not.toContain("--{{");

    const buttonSource = await readFile(
      path.join(targetDir, "packages/react/src/Button/Button.tsx"),
      "utf8",
    );
    expect(buttonSource).toContain("forwardRef");
    expect(buttonSource).toContain("aria-busy");

    const inputSource = await readFile(
      path.join(targetDir, "packages/react/src/Input/Input.tsx"),
      "utf8",
    );
    expect(inputSource).toContain("useControlledState");
    expect(inputSource).toContain("aria-describedby");
  });

  it("renders both license texts with the copyright line filled in — selection happens later, in the CLI's own hook", async () => {
    await renderTemplate({
      templateRoot,
      targetDir,
      variables: baseVariables,
    });

    const apache = await readFile(path.join(targetDir, "LICENSE-APACHE-2.0"), "utf8");
    expect(apache).toContain("Copyright 2026 acme-design-system Contributors");
    expect(apache).toContain("Apache License");

    const mit = await readFile(path.join(targetDir, "LICENSE-MIT"), "utf8");
    expect(mit).toContain("Copyright (c) 2026 acme-design-system Contributors");
    expect(mit).toContain("MIT License");
  });
});
