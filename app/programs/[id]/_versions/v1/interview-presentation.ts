// Presentation-only helpers for interview cards. The DB stores no avatar color
// or initials; these derive them so the visual matches the original placeholder.

const AVATAR_PALETTE = [
  "bg-cobalt-500/10 text-cobalt-600",
  "bg-sun-500/10 text-sun-700",
  "bg-fern-500/10 text-fern-700",
];

/** First letter of the first two words, uppercased. "?" when empty. */
export function interviewInitials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "?";
  return words
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("");
}

/** Deterministic avatar color classes, rotating through a fixed palette. */
export function interviewAvatarClasses(index: number): string {
  return AVATAR_PALETTE[index % AVATAR_PALETTE.length];
}
