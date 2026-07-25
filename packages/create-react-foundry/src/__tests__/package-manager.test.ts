import { describe, expect, it } from "vitest";
import { detectPackageManager, installCommand } from "../package-manager.js";

describe("detectPackageManager", () => {
  it("detects pnpm from npm_config_user_agent", () => {
    expect(detectPackageManager({ npm_config_user_agent: "pnpm/9.15.9 npm/? node/v20" })).toBe(
      "pnpm",
    );
  });

  it("detects yarn from npm_config_user_agent", () => {
    expect(detectPackageManager({ npm_config_user_agent: "yarn/4.0.0 npm/? node/v20" })).toBe(
      "yarn",
    );
  });

  it("detects bun from npm_config_user_agent", () => {
    expect(detectPackageManager({ npm_config_user_agent: "bun/1.1.0 npm/? node/v20" })).toBe("bun");
  });

  it("falls back to npm when the user agent is missing or unrecognized", () => {
    expect(detectPackageManager({})).toBe("npm");
    expect(detectPackageManager({ npm_config_user_agent: "something-else/1.0.0" })).toBe("npm");
  });
});

describe("installCommand", () => {
  it("returns the right command for each package manager", () => {
    expect(installCommand("pnpm")).toEqual(["pnpm", ["install"]]);
    expect(installCommand("yarn")).toEqual(["yarn", []]);
    expect(installCommand("bun")).toEqual(["bun", ["install"]]);
    expect(installCommand("npm")).toEqual(["npm", ["install"]]);
  });
});
