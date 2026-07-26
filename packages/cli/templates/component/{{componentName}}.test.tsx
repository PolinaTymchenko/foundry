import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { {{componentName}} } from "./{{componentName}}.js";

describe("{{componentName}}", () => {
  it("renders its children", () => {
    render(<{{componentName}}>Content</{{componentName}}>);
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("forwards the ref to the underlying element", () => {
    const ref = createRef<HTMLDivElement>();
    render(<{{componentName}} ref={ref}>Content</{{componentName}}>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("warns in development when rendered with no accessible content or label", () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    render(<{{componentName}} />);
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining("accessible name"));
    warnSpy.mockRestore();
  });
});
