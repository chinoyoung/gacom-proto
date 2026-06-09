import { describe, expect, it } from "vitest";
import { pageNameForPath } from "./page-name-registry";

describe("pageNameForPath", () => {
  it("matches a program detail page", () => {
    expect(pageNameForPath("/programs/study-in-paris")).toBe("Program Detail");
  });

  it("matches the programs index", () => {
    expect(pageNameForPath("/programs")).toBe("Program Directory");
  });

  it("matches the partner marketplace", () => {
    expect(pageNameForPath("/mygoabroad/partnerships")).toBe("Partner Marketplace");
  });

  it("falls back to Prototype for unknown paths", () => {
    expect(pageNameForPath("/admin/create-listing")).toBe("Prototype");
  });
});
