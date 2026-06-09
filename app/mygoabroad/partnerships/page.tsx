"use client";

import { Suspense } from "react";
import { useDesignVersion } from "@/lib/use-design-version";
import V1PartnerPage from "./_versions/v1/V1PartnerPage";
import V2PartnerPage from "./_versions/v2/V2PartnerPage";

function PartnerPageContent() {
  const { version } = useDesignVersion("mygoabroad-partnerships");

  switch (version) {
    case "v2":
      return <V2PartnerPage />;
    default:
      return <V1PartnerPage />;
  }
}

export default function PartnerPage() {
  return (
    <Suspense>
      <PartnerPageContent />
    </Suspense>
  );
}
