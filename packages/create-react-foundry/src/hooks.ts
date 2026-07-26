import { spawn } from "node:child_process";
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

export const projectHooks: GeneratorHooks<ProjectAnswers> = {
  async afterRender(ctx: GeneratorContext<ProjectAnswers>) {
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
