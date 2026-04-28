interface PageNameEntry {
  pattern: RegExp;
  name: string;
}

const ENTRIES: PageNameEntry[] = [
  { pattern: /^\/programs\/[^/]+$/, name: "Program Detail" },
  { pattern: /^\/programs$/, name: "Program Directory" },
  { pattern: /^\/marketplace\/partner$/, name: "Partner Marketplace" },
];

export function pageNameForPath(pathname: string): string {
  for (const { pattern, name } of ENTRIES) {
    if (pattern.test(pathname)) return name;
  }
  return "Prototype";
}
