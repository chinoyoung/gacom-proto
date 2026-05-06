"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useDesignVersion } from "@/lib/use-design-version";
import type { DesignVersion } from "@/lib/design-versions";

function pageIdForPath(pathname: string): string | null {
  if (/^\/programs\/[^/]+$/.test(pathname)) return "program-detail";
  if (pathname === "/marketplace/partner") return "marketplace-partner";
  if (pathname === "/marketplace/esim") return "marketplace-esim";
  if (/^\/marketplace\/esim\/[^/]+$/.test(pathname)) return "marketplace-esim-detail";
  return null;
}

export function ToolbarVersionSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const pageId = pageIdForPath(pathname);

  // Hooks must run unconditionally — call useDesignVersion with a safe placeholder when there's no pageId.
  const { version, versions } = useDesignVersion(pageId ?? "__none__");

  if (!pageId || versions.length < 2) return null;

  function navigateTo(v: DesignVersion, isDefault: boolean) {
    const params = new URLSearchParams(searchParams.toString());
    if (isDefault) {
      params.delete("v");
    } else {
      params.set("v", v.id);
    }
    const qs = params.toString();
    router.push(pathname + (qs ? `?${qs}` : ""));
  }

  const firstVersion = versions[0];

  return (
    <div className="bg-sun-50 rounded-full p-1 flex gap-1" role="tablist" aria-label="Design version">
      {versions.map((v) => {
        const isActive = v.id === version;
        const isDefault = v.id === firstVersion.id;
        return (
          <button
            key={v.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => navigateTo(v, isDefault)}
            className={[
              "px-3 py-1 text-xs font-semibold rounded-full transition-colors cursor-pointer",
              isActive
                ? "bg-white text-sun-700 shadow-sm"
                : "text-slate-600 hover:text-sun-700",
            ].join(" ")}
          >
            {v.label}
          </button>
        );
      })}
    </div>
  );
}
