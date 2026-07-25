export type PackageManager = "pnpm" | "npm" | "yarn" | "bun";

/**
 * npm, pnpm, yarn, and bun all set npm_config_user_agent when they invoke a
 * `create-*` package, so the package manager the user is already using can
 * be read directly instead of asked for — one fewer question in the flow.
 */
export function detectPackageManager(env: NodeJS.ProcessEnv = process.env): PackageManager {
  const userAgent = env.npm_config_user_agent ?? "";
  if (userAgent.startsWith("pnpm")) return "pnpm";
  if (userAgent.startsWith("yarn")) return "yarn";
  if (userAgent.startsWith("bun")) return "bun";
  return "npm";
}

export function installCommand(pm: PackageManager): [command: string, args: string[]] {
  switch (pm) {
    case "pnpm":
      return ["pnpm", ["install"]];
    case "yarn":
      return ["yarn", []];
    case "bun":
      return ["bun", ["install"]];
    case "npm":
      return ["npm", ["install"]];
  }
}
