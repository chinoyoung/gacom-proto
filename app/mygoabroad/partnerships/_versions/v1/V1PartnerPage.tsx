"use client";

import V1Hero from "./V1Hero";
import V1InPageNav from "./V1InPageNav";
import V1ValueProps from "./V1ValueProps";
import V1Opportunities from "./V1Opportunities";
import V1Products from "./V1Products";
import V1WhyAffiliate from "./V1WhyAffiliate";
import V1WhyAmbassador from "./V1WhyAmbassador";
import V1GetStarted from "./V1GetStarted";

export default function V1PartnerPage() {
  return (
    // Section rhythm: cobalt-500 → white → cobalt-500 → white → slate-50 → cobalt-500 → cobalt-700
    <main className="text-neutral-800">
      <V1Hero />
      <V1InPageNav />
      <V1ValueProps />
      <V1Opportunities />
      <V1WhyAffiliate />
      <V1WhyAmbassador />
      <V1Products />
      <V1GetStarted />
    </main>
  );
}
