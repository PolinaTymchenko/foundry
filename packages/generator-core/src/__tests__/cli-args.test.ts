import { describe, expect, it } from "vitest";
import { parseFlag } from "../cli-args.js";

describe("parseFlag", () => {
  it("reads --name=value form", () => {
    expect(parseFlag(["--token-prefix=fd"], "token-prefix")).toBe("fd");
  });

  it("reads --name value (space-separated) form", () => {
    expect(parseFlag(["--token-prefix", "fd"], "token-prefix")).toBe("fd");
  });

  it("returns undefined when the flag isn't present", () => {
    expect(parseFlag(["--other-flag=x"], "token-prefix")).toBeUndefined();
  });

  it("returns undefined when the space-separated form has no following value", () => {
    expect(parseFlag(["--token-prefix"], "token-prefix")).toBeUndefined();
  });

  it("finds the flag among other positional and flag arguments", () => {
    expect(
      parseFlag(["my-project", "--package-scope=@acme", "--token-prefix=fd"], "package-scope"),
    ).toBe("@acme");
  });
});
