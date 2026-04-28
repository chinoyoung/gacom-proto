"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function DashboardLink() {
  return (
    <Link
      href="/"
      className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
    >
      <ArrowLeft className="w-3.5 h-3.5" />
      Dashboard
    </Link>
  );
}
