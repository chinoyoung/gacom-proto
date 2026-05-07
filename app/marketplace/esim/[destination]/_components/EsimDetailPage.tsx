"use client";

import { Suspense } from "react";
import type { Destination } from "../../_data/destinations";
import EsimDetailHero from "./EsimDetailHero";
import OrigEsimWhyChoose from "../../_versions/orig/OrigEsimWhyChoose";
import EsimDetailHowItWorks from "./EsimDetailHowItWorks";
import OrigEsimFAQ from "../../_versions/orig/OrigEsimFAQ";
import EsimReadyCTA from "./EsimReadyCTA";

export default function EsimDetailPage({ destination }: { destination: Destination }) {
  return (
    <main className="text-neutral-800">
      <Suspense fallback={<section className="bg-white min-h-[420px]" aria-hidden="true" />}>
        <EsimDetailHero destination={destination} />
      </Suspense>
      <OrigEsimWhyChoose />
      <EsimDetailHowItWorks />
      <OrigEsimFAQ />
      <EsimReadyCTA destination={destination} />
    </main>
  );
}
