import { spawn } from "node:child_process";
import * as clack from "@clack/prompts";
import type { GeneratorContext, GeneratorHooks } from "@foundryui/generator-core";
import { detectPackageManager, installCommand } from "./package-manager.js";
import type { ProjectAnswers } from "./types.js";

function run(command: string, args: string[], cwd: string): Promise<void> {
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

    const pm = detectPackageManager();
    const [installCmd, installArgs] = installCommand(pm);
    const installSpinner = clack.spinner();
    installSpinner.start(`Installing dependencies with ${pm}`);
    await run(installCmd, installArgs, ctx.targetDir);
    installSpinner.stop(`Installed dependencies with ${pm}`);
  },
};
