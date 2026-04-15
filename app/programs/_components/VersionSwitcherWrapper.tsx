"use client";

import { Suspense } from "react";
import { usePathname } from "next/navigation";
import { DesignVersionSwitcher } from "@/components/DesignVersionSwitcher";

function VersionSwitcher() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  // Only show on /programs/[id], not on /programs
  if (segments.length < 2 || segments[0] !== "programs") return null;

  return <DesignVersionSwitcher pageId="program-detail" />;
}

export function VersionSwitcherWrapper() {
  return (
    <Suspense>
      <VersionSwitcher />
    </Suspense>
  );
}
