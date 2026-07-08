export interface DesignVersion {
  id: string;
  label: string;
  description?: string;
}

export interface PageVersionConfig {
  pageId: string;
  versions: DesignVersion[];
  defaultVersion: string;
}

export const PAGE_VERSIONS: Record<string, PageVersionConfig> = {
  "mygoabroad-partnerships": {
    pageId: "mygoabroad-partnerships",
    versions: [
      { id: "v1", label: "v1", description: "Split hero with image on right" },
      { id: "v2", label: "v2", description: "Friendly redesign with illustrations" },
    ],
    defaultVersion: "v1",
  },
  "mygoabroad-esim": {
    pageId: "mygoabroad-esim",
    versions: [
      { id: "v1", label: "v1", description: "Brand-aligned default following BRANDING.md" },
    ],
    defaultVersion: "v1",
  },
  "mygoabroad-esim-detail": {
    pageId: "mygoabroad-esim-detail",
    versions: [
      { id: "v1", label: "v1", description: "Destination eSIM detail page" },
    ],
    defaultVersion: "v1",
  },
  "marketplace-insurance": {
    pageId: "marketplace-insurance",
    versions: [
      { id: "v1", label: "v1", description: "Brand-aligned default following BRANDING.md" },
    ],
    defaultVersion: "v1",
  },
  "program-detail": {
    pageId: "program-detail",
    versions: [
      { id: "v1", label: "v1", description: "Stakeholder-feedback redesign (May 2026)" },
      { id: "v2", label: "v2", description: "Redesigned reviews section (REVIEWS SECTIONS PROPOSAL 2026)" },
    ],
    defaultVersion: "v1",
  },
  "provider-detail": {
    pageId: "provider-detail",
    versions: [
      { id: "v1", label: "v1", description: "Provider profile page" },
    ],
    defaultVersion: "v1",
  },
  "mygoabroad": {
    pageId: "mygoabroad",
    versions: [
      { id: "v1", label: "v1", description: "Direct copy of the live MyGoAbroad page" },
      { id: "v2", label: "v2", description: "Redesigned to match the marketplace design language" },
    ],
    defaultVersion: "v1",
  },
};

export function getVersionConfig(pageId: string): PageVersionConfig | null {
  return PAGE_VERSIONS[pageId] ?? null;
}

export function resolveVersion(
  pageId: string,
  vParam: string | null
): string {
  const config = getVersionConfig(pageId);
  if (!config) return "v1";

  if (vParam && config.versions.some((v) => v.id === vParam)) {
    return vParam;
  }

  return config.defaultVersion;
}
