"use client";

import OrigEsimHero from "./OrigEsimHero";
import OrigEsimDestinations from "./OrigEsimDestinations";
import OrigEsimWhyChoose from "./OrigEsimWhyChoose";
import OrigEsimHowItWorks from "./OrigEsimHowItWorks";
import OrigEsimFAQ from "./OrigEsimFAQ";

export default function OrigEsimLandingPage() {
  return (
    <main className="text-neutral-800">
      <OrigEsimHero />
      <OrigEsimDestinations />
      <OrigEsimWhyChoose />
      <OrigEsimHowItWorks />
      <OrigEsimFAQ />
    </main>
  );
}
