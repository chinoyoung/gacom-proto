"use client";

import { Layers, ShieldCheck, Stethoscope, Globe } from "lucide-react";

const features = [
  {
    icon: Layers,
    title: "Insurance plan options",
    body: "We offer four comprehensive travel insurance plans with varying deductibles and coverage limits to suit any trip and budget. From the budget-friendly Saver plan with a $100 deductible and $100,000 coverage, to the Premium+ plan offering comprehensive coverage with a $0 deductible and up to $1,000,000 in benefits.",
  },
  {
    icon: ShieldCheck,
    title: "Key inclusions",
    body: "Each GoAbroad travel insurance plan includes emergency medical evacuation, repatriation for medical treatment, emergency reunion, political evacuation, and accidental death and dismemberment coverage for your peace of mind while traveling.",
  },
  {
    icon: Stethoscope,
    title: "Tele-Health support",
    body: "All our plans include essential virtual health care support, giving you 24/7 access to care while abroad. For Non-US coverage, this includes AllHealth360 Telemedicine and Telus Health Virtual Emotional Wellness Care (available under Standard and Premium plans), while for US coverage, it includes Teladoc Health Services and DialCare Telemedicine (available under Saver, Standard, and Premium plans).",
  },
  {
    icon: Globe,
    title: "Worldwide coverage",
    body: "Our travel insurance plans cover travel to over 215 countries and regions across the globe, ensuring you're protected with comprehensive health and life support for the duration of your time abroad.",
  },
];

export default function V1InsuranceWhatsCovered() {
  return (
    <section
      id="whats-covered"
      aria-labelledby="whats-covered-heading"
      className="scroll-mt-36 bg-white py-16 md:py-24"
    >
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row gap-12 md:gap-20">
        <div className="flex-1 max-w-md">
          <p className="text-sm font-semibold uppercase tracking-widest text-cobalt-500 mb-3">
            Travel Insurance
          </p>
          <h2
            id="whats-covered-heading"
            className="text-3xl font-bold text-neutral-800 leading-tight tracking-tight mb-4"
          >
            What is Travel Insurance?
          </h2>
          <p className="text-base text-slate-600 leading-relaxed">
            Travel insurance provides essential life and health coverage while you&apos;re abroad, including emergency medical care and evacuation — so you&apos;re protected wherever your journey takes you.
          </p>
        </div>
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-7">
          {features.map(({ icon: Icon, title, body }) => (
            <div key={title} className="flex items-start gap-4">
              <div className="w-10 h-10 bg-cobalt-500/10 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                <Icon className="w-5 h-5 text-cobalt-500" aria-hidden="true" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-neutral-800 mb-1">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
