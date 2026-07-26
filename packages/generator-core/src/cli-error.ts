import * as clack from "@clack/prompts";
import { PromptCancelledError } from "./prompt.js";

/**
 * The catch-block every Foundry CLI needs around a runGenerator call:
 * a cancelled prompt reports as a cancellation, anything else reports as
 * an error — both set a non-zero exit code. Shared so a second CLI
 * doesn't reimplement the same six lines a third time.
 */
export function reportGeneratorError(error: unknown): void {
  if (error instanceof PromptCancelledError) {
    clack.cancel("Cancelled.");
    process.exitCode = 1;
    return;
  }
  clack.log.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
