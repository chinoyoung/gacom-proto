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
  "program-detail": {
    pageId: "program-detail",
    versions: [
      {
        id: "default",
        label: "Current",
        description: "The original layout",
      },
      {
        id: "modern",
        label: "Modern",
        description: "Full-width hero, card-based sections",
      },
      {
        id: "inquiry",
        label: "Inquiry",
        description: "Two-column layout with integrated inquiry form",
      },
    ],
    defaultVersion: "default",
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
  if (!config) return "default";

  if (vParam && config.versions.some((v) => v.id === vParam)) {
    return vParam;
  }

  return config.defaultVersion;
}
