import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const VARIABLE_PATTERN = /\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g;

/**
 * Replaces every `{{variable}}` occurrence in `input` with the matching
 * entry from `variables`. Throws if a template references a variable that
 * wasn't provided — a missing substitution should fail generation loudly,
 * never ship as literal `{{...}}` text in someone's new project.
 */
export function substitute(input: string, variables: Record<string, string>): string {
  return input.replace(VARIABLE_PATTERN, (match, key: string) => {
    if (!(key in variables)) {
      throw new Error(`Template references unknown variable "${key}" (in "${match}").`);
    }
    return variables[key] as string;
  });
}

export interface RenderOptions {
  templateRoot: string;
  targetDir: string;
  variables: Record<string, string>;
}

/**
 * Copies every file under `templateRoot` into `targetDir`, substituting
 * `{{variables}}` in both file contents and file/directory names. Returns
 * the absolute paths of every file written.
 */
export async function renderTemplate({
  templateRoot,
  targetDir,
  variables,
}: RenderOptions): Promise<string[]> {
  const written: string[] = [];
  await copyDir(templateRoot, targetDir, variables, written);
  return written;
}

async function copyDir(
  sourceDir: string,
  destDir: string,
  variables: Record<string, string>,
  written: string[],
): Promise<void> {
  await mkdir(destDir, { recursive: true });
  const entries = await readdir(sourceDir, { withFileTypes: true });

  for (const entry of entries) {
    const destName = substitute(entry.name, variables);
    const sourcePath = path.join(sourceDir, entry.name);
    const destPath = path.join(destDir, destName);

    if (entry.isDirectory()) {
      await copyDir(sourcePath, destPath, variables, written);
      continue;
    }

    const raw = await readFile(sourcePath, "utf8");
    const rendered = substitute(raw, variables);
    await writeFile(destPath, rendered, "utf8");
    written.push(destPath);
  }
}

/**
 * Guards against silently overwriting a directory someone's already using.
 * Passes if the directory doesn't exist yet, or exists and is empty.
 */
export async function assertEmptyOrMissing(targetDir: string): Promise<void> {
  let entries: string[];
  try {
    entries = await readdir(targetDir);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return;
    }
    throw error;
  }
  if (entries.length > 0) {
    throw new Error(`Target directory "${targetDir}" already exists and is not empty.`);
  }
}
