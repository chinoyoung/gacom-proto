"use client";

const steps = [
  {
    number: "01",
    title: "Request a Quote",
    description:
      "Fill in the duration of your trip and whether it includes travel in or outside of the U.S. only, and get instant quotes for our full range of plans.",
  },
  {
    number: "02",
    title: "Select Your Plan & Pay",
    description:
      "Choose an insurance plan that fits your trip duration and coverage needs, and proceed to complete your purchase.",
  },
  {
    number: "03",
    title: "Travel With Confidence",
    description:
      "Access our Student Zone to download your ID card and visa letter, get to know our claims process, or get any questions answered instantly before or after you arrive at your destination.",
  },
];

export default function V1InsuranceHowItWorks() {
  return (
    <section
      id="how-it-works"
      aria-labelledby="how-it-works-heading"
      className="scroll-mt-36 bg-slate-50 py-16 md:py-24"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row gap-12 md:gap-20">
          <div className="flex-1 max-w-md">
            <p className="text-sm font-semibold uppercase tracking-widest text-cobalt-500 mb-3">
              Simple Process
            </p>
            <h2
              id="how-it-works-heading"
              className="text-3xl font-bold text-neutral-800 leading-tight tracking-tight mb-4"
            >
              How to Buy a GoAbroad Insurance Plan?
            </h2>
            <p className="text-base text-slate-600 leading-relaxed">
              We&apos;ve created the simplest way for you to point, click, and purchase your travel insurance in minutes!
            </p>
          </div>
          <div className="flex-1 flex flex-col gap-8">
            {steps.map(({ number, title, description }) => (
              <div key={number} className="flex items-start gap-4">
                <div className="w-10 h-10 bg-cobalt-500 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-white">{number}</span>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-neutral-800 mb-1">{title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
