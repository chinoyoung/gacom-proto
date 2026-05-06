"use client";

import type { Destination } from "../../_data/destinations";
import EsimDetailHero from "./EsimDetailHero";
import OrigEsimWhyChoose from "../../_versions/orig/OrigEsimWhyChoose";
import EsimDetailHowItWorks from "./EsimDetailHowItWorks";
import OrigEsimFAQ from "../../_versions/orig/OrigEsimFAQ";
import EsimReadyCTA from "./EsimReadyCTA";

export default function EsimDetailPage({ destination }: { destination: Destination }) {
  return (
    <main className="text-neutral-800">
      <EsimDetailHero destination={destination} />
      <OrigEsimWhyChoose />
      <EsimDetailHowItWorks />
      <OrigEsimFAQ />
      <EsimReadyCTA destination={destination} />
    </main>
  );
}
