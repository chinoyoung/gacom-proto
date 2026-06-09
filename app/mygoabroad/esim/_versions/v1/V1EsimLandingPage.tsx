"use client";

import V1EsimHero from "./V1EsimHero";
import V1EsimDestinations from "./V1EsimDestinations";
import V1EsimWhyChoose from "./V1EsimWhyChoose";
import V1EsimHowItWorks from "./V1EsimHowItWorks";
import V1EsimFAQ from "./V1EsimFAQ";
import V1EsimCTA from "./V1EsimCTA";

export default function V1EsimLandingPage() {
  return (
    <main className="text-neutral-800">
      <V1EsimHero />
      <V1EsimDestinations />
      <V1EsimWhyChoose />
      <V1EsimHowItWorks />
      <V1EsimFAQ />
      <V1EsimCTA />
    </main>
  );
}
