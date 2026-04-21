"use client";

import { Suspense } from "react";
import { usePathname } from "next/navigation";
import { DesignVersionSwitcher } from "@/components/DesignVersionSwitcher";

function VersionSwitcher() {
  const pathname = usePathname();

  if (pathname !== "/marketplace/partner") return null;

  return <DesignVersionSwitcher pageId="marketplace-partner" />;
}

export function VersionSwitcherWrapper() {
  return (
    <Suspense>
      <VersionSwitcher />
    </Suspense>
  );
}
