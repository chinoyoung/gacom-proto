"use client";

import { Suspense } from "react";
import type { Destination } from "../../_data/destinations";
import EsimDetailHero from "./EsimDetailHero";
import V1EsimWhyChoose from "../../_versions/v1/V1EsimWhyChoose";
import EsimDetailHowItWorks from "./EsimDetailHowItWorks";
import V1EsimFAQ from "../../_versions/v1/V1EsimFAQ";
import EsimReadyCTA from "./EsimReadyCTA";

export default function EsimDetailPage({ destination }: { destination: Destination }) {
  return (
    <main className="text-neutral-800">
      <Suspense fallback={<section className="bg-white min-h-[420px]" aria-hidden="true" />}>
        <EsimDetailHero destination={destination} />
      </Suspense>
      <V1EsimWhyChoose />
      <EsimDetailHowItWorks />
      <V1EsimFAQ />
      <EsimReadyCTA destination={destination} />
    </main>
  );
}
