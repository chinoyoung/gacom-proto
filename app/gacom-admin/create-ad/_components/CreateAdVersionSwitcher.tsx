"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useDesignVersion } from "@/lib/use-design-version";

export default function CreateAdVersionSwitcher() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { version, versions } = useDesignVersion("create-ad");

  if (versions.length < 2) return null;

  return (
    <div
      className="fixed top-4 right-4 z-50 flex gap-1 rounded-full border border-slate-200 bg-white p-1 shadow-md"
      role="tablist"
      aria-label="Design version"
    >
      {versions.map((v) => {
        const isActive = v.id === version;
        const params = new URLSearchParams(searchParams.toString());
        params.set("v", v.id);
        const href = `${pathname}?${params.toString()}`;

        return (
          <Link
            key={v.id}
            href={href}
            role="tab"
            aria-selected={isActive}
            className={[
              "rounded-full px-3 py-1 text-xs font-semibold transition-colors cursor-pointer",
              isActive
                ? "bg-slate-800 text-white"
                : "text-slate-600 hover:bg-slate-100",
            ].join(" ")}
          >
            {v.label}
          </Link>
        );
      })}
    </div>
  );
}
