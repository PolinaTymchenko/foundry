import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useControlledState } from "../useControlledState.js";

describe("useControlledState", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("manages its own state when uncontrolled", () => {
    const { result } = renderHook(() => useControlledState<string>(undefined, "initial"));

    expect(result.current[0]).toBe("initial");

    act(() => {
      result.current[1]("updated");
    });

    expect(result.current[0]).toBe("updated");
  });

  it("calls onChange when uncontrolled", () => {
    const onChange = vi.fn();
    const { result } = renderHook(() => useControlledState<string>(undefined, "initial", onChange));

    act(() => {
      result.current[1]("updated");
    });

    expect(onChange).toHaveBeenCalledWith("updated");
  });

  it("defers to the external value when controlled, and does not update itself", () => {
    const onChange = vi.fn();
    const { result, rerender } = renderHook(
      ({ value }) => useControlledState<string>(value, "initial", onChange),
      { initialProps: { value: "external" } },
    );

    expect(result.current[0]).toBe("external");

    act(() => {
      result.current[1]("attempted-change");
    });

    // The value doesn't change on its own — only the parent re-rendering
    // with a new `value` can change what a controlled instance shows.
    expect(onChange).toHaveBeenCalledWith("attempted-change");
    expect(result.current[0]).toBe("external");

    rerender({ value: "parent-updated" });
    expect(result.current[0]).toBe("parent-updated");
  });

  it("warns in development when switching between controlled and uncontrolled", () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const { rerender } = renderHook(
      ({ value }: { value: string | undefined }) => useControlledState<string>(value, "initial"),
      { initialProps: { value: undefined as string | undefined } },
    );

    expect(warnSpy).not.toHaveBeenCalled();

    rerender({ value: "now-controlled" });

    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining("switched from uncontrolled to controlled"),
    );
  });
});
