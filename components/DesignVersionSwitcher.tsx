"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useDesignVersion } from "@/lib/use-design-version";
import type { DesignVersion } from "@/lib/design-versions";

interface DesignVersionSwitcherProps {
  pageId: string;
}

export function DesignVersionSwitcher({ pageId }: DesignVersionSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { version, versions } = useDesignVersion(pageId);

  if (versions.length < 2) return null;

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
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[60] sm:bottom-6">
      <div className="bg-slate-900 shadow-lg rounded-full px-1.5 py-1.5 flex gap-1 items-center">
        <span className="text-[11px] font-medium text-slate-400 pl-2.5 pr-1 uppercase tracking-wide select-none">
          Design
        </span>
        {versions.map((v) => {
          const isActive = v.id === version;
          const isDefault = v.id === firstVersion.id;
          return (
            <button
              key={v.id}
              onClick={() => navigateTo(v, isDefault)}
              className={[
                "px-3.5 py-1.5 text-xs font-medium rounded-full transition-colors cursor-pointer",
                isActive
                  ? "bg-cobalt-500 text-white"
                  : "text-slate-300 hover:bg-slate-700",
              ].join(" ")}
              aria-pressed={isActive}
            >
              {v.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
