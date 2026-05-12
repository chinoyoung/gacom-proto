"use client";

import V1InsuranceHero from "./V1InsuranceHero";
import V1InsuranceWhatsCovered from "./V1InsuranceWhatsCovered";
import V1InsurancePlans from "./V1InsurancePlans";
import V1InsuranceWhyChoose from "./V1InsuranceWhyChoose";
import V1InsuranceHowItWorks from "./V1InsuranceHowItWorks";
import V1InsuranceFAQ from "./V1InsuranceFAQ";
import V1InsuranceCTA from "./V1InsuranceCTA";

export default function V1InsuranceLandingPage() {
  return (
    <main className="text-neutral-800">
      <V1InsuranceHero />
      <V1InsuranceWhatsCovered />
      <V1InsurancePlans />
      <V1InsuranceWhyChoose />
      <V1InsuranceHowItWorks />
      <V1InsuranceFAQ />
      <V1InsuranceCTA />
    </main>
  );
}
