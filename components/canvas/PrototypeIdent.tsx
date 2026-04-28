"use client";

import { LayoutTemplate } from "lucide-react";
import { usePathname } from "next/navigation";
import { pageNameForPath } from "./page-name-registry";

export function PrototypeIdent() {
  const pathname = usePathname();
  const name = pageNameForPath(pathname);
  return (
    <div className="flex items-center gap-2 text-slate-100">
      <LayoutTemplate className="w-4 h-4 text-slate-400" strokeWidth={2} />
      <span className="text-sm font-semibold tracking-tight">{name}</span>
    </div>
  );
}
