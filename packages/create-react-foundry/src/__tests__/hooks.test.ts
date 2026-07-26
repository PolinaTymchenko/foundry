import { mkdtemp, readdir, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  deriveDefaultPackageScope,
  finalizeLicense,
  installWithPnpm,
  isCommandNotFound,
} from "../hooks.js";

function enoent(): NodeJS.ErrnoException {
  const error = new Error("spawn ENOENT") as NodeJS.ErrnoException;
  error.code = "ENOENT";
  return error;
}

describe("isCommandNotFound", () => {
  it("recognizes an ENOENT error", () => {
    expect(isCommandNotFound(enoent())).toBe(true);
  });

  it("does not mistake an unrelated error for a missing command", () => {
    expect(isCommandNotFound(new Error("exited with code 1"))).toBe(false);
    expect(isCommandNotFound("not an error")).toBe(false);
  });
});

describe("installWithPnpm", () => {
  it("uses pnpm directly when it's available", async () => {
    const runFn = vi.fn().mockResolvedValue(undefined);
    const result = await installWithPnpm("/some/dir", runFn);

    expect(result).toEqual({ ok: true, detail: "pnpm" });
    expect(runFn).toHaveBeenCalledTimes(1);
    expect(runFn).toHaveBeenCalledWith("pnpm", ["install"], "/some/dir");
  });

  it("falls back to corepack when pnpm isn't on PATH", async () => {
    const runFn = vi.fn().mockRejectedValueOnce(enoent()).mockResolvedValueOnce(undefined);

    const result = await installWithPnpm("/some/dir", runFn);

    expect(result).toEqual({ ok: true, detail: "pnpm (via corepack)" });
    expect(runFn).toHaveBeenNthCalledWith(1, "pnpm", ["install"], "/some/dir");
    expect(runFn).toHaveBeenNthCalledWith(2, "corepack", ["pnpm", "install"], "/some/dir");
  });

  it("reports failure honestly when neither pnpm nor corepack is available, rather than silently succeeding", async () => {
    const runFn = vi.fn().mockRejectedValue(enoent());

    const result = await installWithPnpm("/some/dir", runFn);

    expect(result).toEqual({ ok: false, detail: "" });
  });

  it("does not swallow a real install failure (e.g. a broken package.json) as if pnpm were missing", async () => {
    const runFn = vi.fn().mockRejectedValue(new Error("pnpm install exited with code 1"));

    await expect(installWithPnpm("/some/dir", runFn)).rejects.toThrow("exited with code 1");
  });
});

describe("deriveDefaultPackageScope", () => {
  it("uses the first hyphen-separated word of the project name", () => {
    expect(deriveDefaultPackageScope("acme-design-system")).toBe("@acme");
  });

  it("works for a project name with no hyphens", () => {
    expect(deriveDefaultPackageScope("mydesignsystem")).toBe("@mydesignsystem");
  });
});

describe("finalizeLicense", () => {
  let targetDir: string;

  beforeEach(async () => {
    targetDir = await mkdtemp(path.join(os.tmpdir(), "foundry-license-test-"));
    await writeFile(path.join(targetDir, "LICENSE-APACHE-2.0"), "apache text");
    await writeFile(path.join(targetDir, "LICENSE-MIT"), "mit text");
  });

  afterEach(async () => {
    await rm(targetDir, { recursive: true, force: true });
  });

  it("keeps Apache-2.0 as LICENSE and removes LICENSE-MIT", async () => {
    await finalizeLicense(targetDir, "Apache-2.0");

    const entries = await readdir(targetDir);
    expect(entries).toContain("LICENSE");
    expect(entries).not.toContain("LICENSE-APACHE-2.0");
    expect(entries).not.toContain("LICENSE-MIT");
    expect(await readFile(path.join(targetDir, "LICENSE"), "utf8")).toBe("apache text");
  });

  it("keeps MIT as LICENSE and removes LICENSE-APACHE-2.0", async () => {
    await finalizeLicense(targetDir, "MIT");

    const entries = await readdir(targetDir);
    expect(entries).toContain("LICENSE");
    expect(entries).not.toContain("LICENSE-APACHE-2.0");
    expect(entries).not.toContain("LICENSE-MIT");
    expect(await readFile(path.join(targetDir, "LICENSE"), "utf8")).toBe("mit text");
  });
});
