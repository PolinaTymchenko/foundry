import { readFile } from "node:fs/promises";
import path from "node:path";

const DEFAULT_TOKEN_PREFIX = "fd";
const TOKEN_PREFIX_FIELD_PATTERN = /tokenPrefix:\s*["']([a-z][a-z0-9-]*)["']/;

export interface FoundryConfig {
  tokenPrefix: string;
}

/**
 * foundry.config.ts is a real TypeScript file, but reading it as data here
 * doesn't need a TS-execution runtime — that would be a new, heavier
 * dependency for one string field. A plain text scan is honest about what
 * it does: it reads the one field that exists today, and falls back to the
 * documented default for anything it can't find, rather than failing.
 */
export async function readFoundryConfig(projectRoot: string): Promise<FoundryConfig> {
  let source: string;
  try {
    source = await readFile(path.join(projectRoot, "foundry.config.ts"), "utf8");
  } catch {
    return { tokenPrefix: DEFAULT_TOKEN_PREFIX };
  }

  const match = source.match(TOKEN_PREFIX_FIELD_PATTERN);
  return { tokenPrefix: match?.[1] ?? DEFAULT_TOKEN_PREFIX };
}
