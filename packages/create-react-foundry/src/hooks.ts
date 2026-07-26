import { spawn } from "node:child_process";
import { rename, rm } from "node:fs/promises";
import path from "node:path";
import * as clack from "@clack/prompts";
import type { GeneratorContext, GeneratorHooks } from "@foundryui/generator-core";
import type { ProjectAnswers } from "./types.js";

export type RunFn = (command: string, args: string[], cwd: string) => Promise<void>;

export const run: RunFn = (command, args, cwd) => {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { cwd, stdio: "ignore" });
    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`"${command} ${args.join(" ")}" exited with code ${code}`));
      }
    });
  });
};

export function isCommandNotFound(error: unknown): boolean {
  return error instanceof Error && "code" in error && error.code === "ENOENT";
}

export interface InstallResult {
  ok: boolean;
  detail: string;
}

/**
 * The generated project is a pnpm workspace — packages depend on each other
 * via the "workspace:*" protocol, which only pnpm (and yarn berry) resolve
 * correctly. Plain npm silently "succeeds" on a workspace: dependency
 * without actually linking it, leaving the project looking installed but
 * structurally broken. So this always installs with pnpm specifically,
 * regardless of which package manager was used to invoke create-react-foundry
 * — falling back to corepack if pnpm isn't directly on PATH, and failing
 * honestly, not silently, if neither is available.
 */
export async function installWithPnpm(cwd: string, runFn: RunFn = run): Promise<InstallResult> {
  try {
    await runFn("pnpm", ["install"], cwd);
    return { ok: true, detail: "pnpm" };
  } catch (error) {
    if (!isCommandNotFound(error)) {
      throw error;
    }
  }

  try {
    await runFn("corepack", ["pnpm", "install"], cwd);
    return { ok: true, detail: "pnpm (via corepack)" };
  } catch (error) {
    if (!isCommandNotFound(error)) {
      throw error;
    }
  }

  return { ok: false, detail: "" };
}

const LICENSE_FILES: Record<string, string> = {
  "apache-2.0": "LICENSE-APACHE-2.0",
  mit: "LICENSE-MIT",
};

/**
 * The template ships both license texts, fully rendered, so this stays a
 * plain file operation through the same render engine everything else
 * uses — no special-cased license-writing code path. Whichever license was
 * chosen becomes LICENSE; the other gets deleted.
 */
export async function finalizeLicense(targetDir: string, license: string): Promise<void> {
  const key = license.toLowerCase();
  for (const [candidateKey, filename] of Object.entries(LICENSE_FILES)) {
    const filePath = path.join(targetDir, filename);
    if (candidateKey === key) {
      await rename(filePath, path.join(targetDir, "LICENSE"));
    } else {
      await rm(filePath);
    }
  }
}

/**
 * Most people scaffolding a design system never publish it anywhere, so
 * package scope isn't worth a prompt — it's derived from the project name
 * (the first hyphen-separated word, prefixed with "@") unless --package-scope
 * was given. Templates still need a real value to substitute, so this runs
 * before rendering rather than being asked.
 */
export function deriveDefaultPackageScope(projectName: string): string {
  const base = projectName.split("-")[0];
  return `@${base}`;
}

export const projectHooks: GeneratorHooks<ProjectAnswers> = {
  async beforeRender(ctx: GeneratorContext<ProjectAnswers>) {
    if (!ctx.answers.packageScope) {
      ctx.answers.packageScope = deriveDefaultPackageScope(ctx.answers.projectName);
    }
  },

  async afterRender(ctx: GeneratorContext<ProjectAnswers>) {
    await finalizeLicense(ctx.targetDir, ctx.answers.license);

    if (ctx.answers.initGit) {
      const gitSpinner = clack.spinner();
      gitSpinner.start("Initializing git repository");
      await run("git", ["init", "--quiet"], ctx.targetDir);
      await run("git", ["add", "-A"], ctx.targetDir);
      gitSpinner.stop("Initialized git repository");
    }

    const installSpinner = clack.spinner();
    installSpinner.start("Installing dependencies with pnpm");
    const result = await installWithPnpm(ctx.targetDir);

    if (result.ok) {
      installSpinner.stop(`Installed dependencies with ${result.detail}`);
      return;
    }

    installSpinner.stop("Skipped dependency install");
    clack.log.warn(
      [
        "Neither pnpm nor corepack was found, so dependencies were not installed.",
        "This project uses pnpm workspaces — plain npm or yarn install will not",
        "correctly link the local packages. Install pnpm (npm install -g pnpm,",
        "or corepack enable), then run pnpm install yourself.",
      ].join("\n"),
    );
  },
};
