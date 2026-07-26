import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef, useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { Input } from "./Input.js";

describe("Input", () => {
  it("associates its label with the input via htmlFor/id", () => {
    render(<Input label="Email" />);
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
  });

  it("forwards the ref to the underlying input element", () => {
    const ref = createRef<HTMLInputElement>();
    render(<Input label="Email" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it("manages its own value when uncontrolled", async () => {
    const user = userEvent.setup();
    render(<Input label="Email" defaultValue="" />);

    const input = screen.getByLabelText("Email");
    await user.type(input, "hi@example.com");

    expect(input).toHaveValue("hi@example.com");
  });

  it("defers to the parent's value when controlled, and calls onChange", async () => {
    const user = userEvent.setup();

    function ControlledWrapper() {
      const [value, setValue] = useState("start");
      return <Input label="Email" value={value} onChange={setValue} />;
    }

    render(<ControlledWrapper />);
    const input = screen.getByLabelText("Email");
    expect(input).toHaveValue("start");

    await user.type(input, "!");
    expect(input).toHaveValue("start!");
  });

  it("associates description text via aria-describedby", () => {
    render(<Input label="Email" description="We won't spam you." />);
    const input = screen.getByLabelText("Email");
    const describedBy = input.getAttribute("aria-describedby");
    expect(describedBy).toBeTruthy();
    expect(screen.getByText("We won't spam you.")).toHaveAttribute("id", describedBy);
  });

  it("marks itself invalid and associates the error message when error is set", () => {
    render(<Input label="Email" error="Enter a valid email." />);
    const input = screen.getByLabelText("Email");

    expect(input).toHaveAttribute("aria-invalid", "true");
    const errorEl = screen.getByRole("alert");
    expect(errorEl).toHaveTextContent("Enter a valid email.");
    expect(input.getAttribute("aria-describedby")).toContain(errorEl.id);
  });

  it("shows both description and error together, and describes both", () => {
    render(<Input label="Email" description="Helper text" error="Error text" />);
    const input = screen.getByLabelText("Email");
    const describedBy = input.getAttribute("aria-describedby") ?? "";

    expect(describedBy.split(" ")).toHaveLength(2);
  });

  it("shows a required indicator and sets aria-required", () => {
    render(<Input label="Email" required />);
    const input = screen.getByLabelText(/Email/);
    expect(input).toHaveAttribute("aria-required", "true");
    expect(input).toBeRequired();
  });

  it("disables the input when disabled", () => {
    render(<Input label="Email" disabled />);
    expect(screen.getByLabelText("Email")).toBeDisabled();
  });

  it("applies the requested size as a data attribute", () => {
    render(<Input label="Email" size="lg" />);
    expect(screen.getByLabelText("Email")).toHaveAttribute("data-size", "lg");
  });

  it("has an accessible name via aria-label when there is no visible label", () => {
    render(<Input aria-label="Search" />);
    expect(screen.getByRole("textbox", { name: "Search" })).toBeInTheDocument();
  });

  it("warns in development when there is no label and no aria-label", () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    render(<Input />);
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining("accessible name"));
    warnSpy.mockRestore();
  });

  it("warns when switching from uncontrolled to controlled", () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const { rerender } = render(<Input label="Email" defaultValue="" />);

    expect(warnSpy).not.toHaveBeenCalled();

    rerender(<Input label="Email" value="now-controlled" onChange={() => {}} />);

    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining("uncontrolled to controlled"));
    warnSpy.mockRestore();
  });
});
