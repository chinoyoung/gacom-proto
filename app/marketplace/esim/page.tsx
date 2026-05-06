"use client";

import { Suspense } from "react";
import { useDesignVersion } from "@/lib/use-design-version";
import V1EsimLandingPage from "./_versions/v1/V1EsimLandingPage";
import OrigEsimLandingPage from "./_versions/orig/OrigEsimLandingPage";

function EsimPageContent() {
  const { version } = useDesignVersion("marketplace-esim");

  switch (version) {
    case "v1":
      return <V1EsimLandingPage />;
    case "orig":
      return <OrigEsimLandingPage />;
    default:
      return <V1EsimLandingPage />;
  }
}

export default function EsimPage() {
  return (
    <Suspense>
      <EsimPageContent />
    </Suspense>
  );
}
