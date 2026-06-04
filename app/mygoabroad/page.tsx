"use client";

import { Suspense } from "react";
import { useDesignVersion } from "@/lib/use-design-version";
import V1MyGoAbroadPage from "./_versions/v1/V1MyGoAbroadPage";
import V2MyGoAbroadPage from "./_versions/v2/V2MyGoAbroadPage";

function MyGoAbroadPageContent() {
  const { version } = useDesignVersion("mygoabroad");

  switch (version) {
    case "v2":
      return <V2MyGoAbroadPage />;
    default:
      return <V1MyGoAbroadPage />;
  }
}

export default function MyGoAbroadPage() {
  return (
    <Suspense>
      <MyGoAbroadPageContent />
    </Suspense>
  );
}
