import { describe, expect, it } from "vitest";
import { isSuperadminRole } from "./is-superadmin";

describe("isSuperadminRole", () => {
  it("returns true for the superadmin role", () => {
    expect(isSuperadminRole("superadmin")).toBe(true);
  });

  it("returns false for a non-admin role string", () => {
    expect(isSuperadminRole("user")).toBe(false);
    expect(isSuperadminRole("admin")).toBe(false);
  });

  it("returns false when role is missing or non-string", () => {
    expect(isSuperadminRole(undefined)).toBe(false);
    expect(isSuperadminRole(null)).toBe(false);
    expect(isSuperadminRole(42)).toBe(false);
  });
});
