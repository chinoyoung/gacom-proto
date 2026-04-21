"use client";

import V2Hero from "./V2Hero";
import V1InPageNav from "../v1/V1InPageNav";
import V2ValueProps from "./V2ValueProps";
import V2Opportunities from "./V2Opportunities";
import V2Products from "./V2Products";
import V2WhyAffiliate from "./V2WhyAffiliate";
import V2WhyAmbassador from "./V2WhyAmbassador";
import V2GetStarted from "./V2GetStarted";

export default function V2PartnerPage() {
  return (
    // Section rhythm: cobalt-50 → white → slate-50 → white → slate-50 → white → cobalt-700
    <main className="text-neutral-800">
      <V2Hero />
      <V1InPageNav />
      <V2ValueProps />
      <V2Opportunities />
      <V2Products />
      <V2WhyAffiliate />
      <V2WhyAmbassador />
      <V2GetStarted />
    </main>
  );
}
