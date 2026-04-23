import { describe, it, expect } from "vitest";
import {
  computeRelativeCoords,
  computeScreenCoords,
  PAGE_ANCHOR_ID,
  type AnchorRect,
} from "./anchor-math";

describe("computeRelativeCoords", () => {
  it("returns 0,0 for clicks at the top-left of the anchor", () => {
    const rect: AnchorRect = { left: 100, top: 100, width: 400, height: 300 };
    expect(computeRelativeCoords(rect, 100, 100)).toEqual({ relX: 0, relY: 0 });
  });

  it("returns 1,1 for clicks at the bottom-right of the anchor", () => {
    const rect: AnchorRect = { left: 100, top: 100, width: 400, height: 300 };
    expect(computeRelativeCoords(rect, 500, 400)).toEqual({ relX: 1, relY: 1 });
  });

  it("returns 0.5,0.5 for clicks at the center of the anchor", () => {
    const rect: AnchorRect = { left: 0, top: 0, width: 200, height: 100 };
    expect(computeRelativeCoords(rect, 100, 50)).toEqual({ relX: 0.5, relY: 0.5 });
  });

  it("clamps negative relative coords to 0", () => {
    const rect: AnchorRect = { left: 100, top: 100, width: 100, height: 100 };
    expect(computeRelativeCoords(rect, 50, 50)).toEqual({ relX: 0, relY: 0 });
  });

  it("clamps relative coords >1 to 1", () => {
    const rect: AnchorRect = { left: 0, top: 0, width: 100, height: 100 };
    expect(computeRelativeCoords(rect, 500, 500)).toEqual({ relX: 1, relY: 1 });
  });

  it("handles zero-sized anchors by returning 0,0", () => {
    const rect: AnchorRect = { left: 50, top: 50, width: 0, height: 0 };
    expect(computeRelativeCoords(rect, 50, 50)).toEqual({ relX: 0, relY: 0 });
  });
});

describe("computeScreenCoords", () => {
  it("places a rel(0,0) pin at the anchor's top-left", () => {
    const rect: AnchorRect = { left: 200, top: 150, width: 400, height: 300 };
    expect(computeScreenCoords(rect, 0, 0)).toEqual({ x: 200, y: 150 });
  });

  it("places a rel(1,1) pin at the anchor's bottom-right", () => {
    const rect: AnchorRect = { left: 200, top: 150, width: 400, height: 300 };
    expect(computeScreenCoords(rect, 1, 1)).toEqual({ x: 600, y: 450 });
  });

  it("roundtrips: relative -> screen -> relative returns the original rel coords", () => {
    const rect: AnchorRect = { left: 50, top: 80, width: 300, height: 200 };
    const screen = computeScreenCoords(rect, 0.3, 0.7);
    const rel = computeRelativeCoords(rect, screen.x, screen.y);
    expect(rel.relX).toBeCloseTo(0.3);
    expect(rel.relY).toBeCloseTo(0.7);
  });
});

describe("PAGE_ANCHOR_ID", () => {
  it("is the sentinel string used when no section anchor is found", () => {
    expect(PAGE_ANCHOR_ID).toBe("__page__");
  });
});
