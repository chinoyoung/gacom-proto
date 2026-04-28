import { describe, expect, it } from "vitest";
import {
  CANVAS_MESSAGE_NAMESPACE,
  isCanvasMessage,
} from "./cross-frame-protocol";

describe("isCanvasMessage", () => {
  it("returns true for a properly namespaced envelope", () => {
    const msg = { __ns: CANVAS_MESSAGE_NAMESPACE, payload: { type: "ready", pageKey: "/x::desktop" } };
    expect(isCanvasMessage(msg)).toBe(true);
  });

  it("returns false for a payload without the namespace", () => {
    expect(isCanvasMessage({ payload: { type: "ready" } })).toBe(false);
  });

  it("returns false for null", () => {
    expect(isCanvasMessage(null)).toBe(false);
  });

  it("returns false for a string (e.g. extension noise)", () => {
    expect(isCanvasMessage("hello")).toBe(false);
  });

  it("returns false for an envelope with the wrong namespace", () => {
    expect(isCanvasMessage({ __ns: "other-namespace", payload: {} })).toBe(false);
  });
});
