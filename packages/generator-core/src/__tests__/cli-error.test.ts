import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@clack/prompts", () => ({
  cancel: vi.fn(),
  log: { error: vi.fn() },
}));

import * as clack from "@clack/prompts";
import { reportGeneratorError } from "../cli-error.js";
import { PromptCancelledError } from "../prompt.js";

describe("reportGeneratorError", () => {
  afterEach(() => {
    vi.clearAllMocks();
    process.exitCode = undefined;
  });

  it("reports a cancelled prompt as a cancellation, not an error", () => {
    reportGeneratorError(new PromptCancelledError());

    expect(clack.cancel).toHaveBeenCalledWith("Cancelled.");
    expect(clack.log.error).not.toHaveBeenCalled();
    expect(process.exitCode).toBe(1);
  });

  it("reports a real Error's message", () => {
    reportGeneratorError(new Error("something broke"));

    expect(clack.log.error).toHaveBeenCalledWith("something broke");
    expect(clack.cancel).not.toHaveBeenCalled();
    expect(process.exitCode).toBe(1);
  });

  it("stringifies a non-Error throw rather than crashing on it", () => {
    reportGeneratorError("a plain string throw");

    expect(clack.log.error).toHaveBeenCalledWith("a plain string throw");
    expect(process.exitCode).toBe(1);
  });
});
