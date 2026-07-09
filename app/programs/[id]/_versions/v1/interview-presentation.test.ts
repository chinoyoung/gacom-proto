import { describe, expect, it } from "vitest";
import { interviewInitials, interviewAvatarClasses } from "./interview-presentation";

describe("interviewInitials", () => {
  it("uses the first letter of the first two words", () => {
    expect(interviewInitials("Kristianna Williams")).toBe("KW");
    expect(interviewInitials("Daniel Ortega")).toBe("DO");
  });

  it("handles a single word", () => {
    expect(interviewInitials("Marissa")).toBe("M");
  });

  it("handles extra whitespace and empty input", () => {
    expect(interviewInitials("  Ana   Cruz  ")).toBe("AC");
    expect(interviewInitials("")).toBe("?");
  });
});

describe("interviewAvatarClasses", () => {
  it("returns a class string and rotates deterministically by index", () => {
    const a = interviewAvatarClasses(0);
    expect(typeof a).toBe("string");
    expect(a.length).toBeGreaterThan(0);
    expect(interviewAvatarClasses(3)).toBe(interviewAvatarClasses(0));
  });
});
