"use client";

import { useSearchParams } from "next/navigation";
import { resolveVersion, getVersionConfig, type DesignVersion } from "./design-versions";

export function useDesignVersion(pageId: string): {
  version: string;
  versions: DesignVersion[];
  isDefault: boolean;
} {
  const searchParams = useSearchParams();
  const vParam = searchParams.get("v");

  const config = getVersionConfig(pageId);
  const versions = config?.versions ?? [];
  const version = resolveVersion(pageId, vParam);
  const isDefault = version === (config?.defaultVersion ?? "default");

  return { version, versions, isDefault };
}
