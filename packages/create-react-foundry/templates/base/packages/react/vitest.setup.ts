import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";

// RTL's automatic cleanup detects Jest-style global afterEach. We import
// Vitest's test functions explicitly rather than using Vitest's `globals`
// mode, so that detection doesn't fire — this registers it by hand instead.
afterEach(() => {
  cleanup();
});
