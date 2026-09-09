"use client";

import { Suspense } from "react";
import { useDesignVersion } from "@/lib/use-design-version";
import FaithfulCreateAd from "./_versions/faithful/FaithfulCreateAd";
import StudioCreateAd from "./_versions/studio/StudioCreateAd";
// import BrandCreateAd from "./_versions/brand/BrandCreateAd"; // added in Task 6

function CreateAdContent() {
  const { version } = useDesignVersion("create-ad");

  switch (version) {
    // case "brand": return <BrandCreateAd />; // Task 6
    case "studio":
      return <StudioCreateAd />;
    case "faithful":
    default:
      return <FaithfulCreateAd />;
  }
}

export default function CreateAdPage() {
  return (
    <Suspense fallback={null}>
      <CreateAdContent />
    </Suspense>
  );
}
