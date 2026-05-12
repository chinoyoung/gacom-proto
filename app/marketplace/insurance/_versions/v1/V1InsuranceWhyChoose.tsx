"use client";

import { ShieldCheck, HeadphonesIcon, FileCheck } from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "Curated Plans",
    description:
      "With per day coverage rates and a range of plan options, you can get the coverage you need without paying for any extra days or unnecessary inclusions.",
  },
  {
    icon: HeadphonesIcon,
    title: "Instant Support",
    description:
      "Get 24/7 access to our curated Student Zone for help with claims, your downloadable ID and visa letter, and answers to all your health and wellness questions.",
  },
  {
    icon: FileCheck,
    title: "Simplified Claims",
    description:
      "All plans offer straightforward claims processes to reduce wait times, get your questions answered, and have real time status updates.",
  },
] as const;

export default function V1InsuranceWhyChoose() {
  return (
    <section
      id="why-choose"
      aria-labelledby="why-choose-heading"
      className="scroll-mt-36 bg-white py-16 md:py-24"
    >
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row gap-12 md:gap-20">
        <div className="flex-1 max-w-md">
          <p className="text-sm font-semibold uppercase tracking-widest text-cobalt-500 mb-3">
            Why GoAbroad Insurance
          </p>
          <h2
            id="why-choose-heading"
            className="text-3xl font-bold text-neutral-800 leading-tight tracking-tight"
          >
            Why Choose Travel Insurance from GoAbroad?
          </h2>
        </div>
        <div className="flex-1 flex flex-col gap-7">
          {features.map(({ icon: Icon, title, description }) => (
            <div key={title} className="flex items-start gap-4">
              <div className="w-10 h-10 bg-cobalt-500/10 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                <Icon className="w-5 h-5 text-cobalt-500" aria-hidden="true" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-neutral-800 mb-1">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
