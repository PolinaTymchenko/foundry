/**
 * Reads --name=value or --name value from argv; undefined if the flag
 * isn't present. Shared by every Foundry CLI (create-react-foundry, the
 * artifact generator, and whatever comes after) so this parsing rule is
 * defined once, not once per binary.
 */
export function parseFlag(argv: string[], name: string): string | undefined {
  const eqForm = argv.find((arg) => arg.startsWith(`--${name}=`));
  if (eqForm) {
    return eqForm.slice(`--${name}=`.length);
  }
  const flagIndex = argv.indexOf(`--${name}`);
  if (flagIndex !== -1 && argv[flagIndex + 1]) {
    return argv[flagIndex + 1];
  }
  return undefined;
}

/**
 * True if `--name` is present in argv as a boolean flag (e.g. --yes,
 * --no-git, --help). Unlike parseFlag, this never consumes a following argv
 * value, so `--yes my-project` still leaves `my-project` as a positional.
 */
export function hasFlag(argv: string[], name: string): boolean {
  return argv.includes(`--${name}`);
}
