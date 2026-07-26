import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

/**
 * Adds the new component's export lines to packages/react/src/index.ts —
 * the "automatically update barrel exports" requirement. This handles
 * what the generator itself knows about: the component and its base Props
 * type. A component that later grows additional exported types (variant
 * unions, size unions, ...) still needs those added by hand — this isn't
 * trying to guess a component's eventual public surface.
 *
 * Idempotent: running it twice for the same component doesn't duplicate
 * the export lines.
 */
export async function updateBarrelExports(
  reactSrcDir: string,
  componentName: string,
): Promise<void> {
  const barrelPath = path.join(reactSrcDir, "index.ts");

  let existing: string;
  try {
    existing = await readFile(barrelPath, "utf8");
  } catch {
    existing = "";
  }

  const importPath = `./${componentName}/index.js`;
  if (existing.includes(`from "${importPath}"`)) {
    return;
  }

  const exportLines = [
    `export { ${componentName} } from "${importPath}";`,
    `export type { ${componentName}Props } from "${importPath}";`,
  ].join("\n");

  const separator = existing.length > 0 && !existing.endsWith("\n") ? "\n" : "";
  const updated = `${existing}${separator}${exportLines}\n`;

  await writeFile(barrelPath, updated, "utf8");
}
