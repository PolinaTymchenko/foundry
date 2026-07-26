import { afterEach, describe, expect, it, vi } from "vitest";
import { warnIfMissingAccessibleName } from "../a11y.js";

describe("warnIfMissingAccessibleName", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("warns when there is no accessible content, aria-label, or aria-labelledby", () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    warnIfMissingAccessibleName({
      component: "TestComponent",
      hasAccessibleContent: false,
      guidance: "needs a name",
    });

    expect(warnSpy).toHaveBeenCalledWith("TestComponent: needs a name");
  });

  it("does not warn when there is accessible content", () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    warnIfMissingAccessibleName({
      component: "TestComponent",
      hasAccessibleContent: true,
      guidance: "needs a name",
    });

    expect(warnSpy).not.toHaveBeenCalled();
  });

  it("does not warn when aria-label is present", () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    warnIfMissingAccessibleName({
      component: "TestComponent",
      hasAccessibleContent: false,
      ariaLabel: "Confirm",
      guidance: "needs a name",
    });

    expect(warnSpy).not.toHaveBeenCalled();
  });

  it("does not warn when aria-labelledby is present", () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    warnIfMissingAccessibleName({
      component: "TestComponent",
      hasAccessibleContent: false,
      ariaLabelledBy: "some-id",
      guidance: "needs a name",
    });

    expect(warnSpy).not.toHaveBeenCalled();
  });
});
