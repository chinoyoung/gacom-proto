"use client";

const steps = [
  {
    number: "01",
    title: "Choose Your Plan",
    description: "Pick the destination and data package that fits your trip. Plans start from under $5.",
  },
  {
    number: "02",
    title: "Install & Activate",
    description: "Scan the QR code we email you to install your eSIM in seconds. No app required.",
  },
  {
    number: "03",
    title: "Stay Connected",
    description: "Land, connect, and use your data anywhere in your destination country. Top up anytime.",
  },
];

export default function V1EsimHowItWorks() {
  return (
    <section
      id="how-it-works"
      aria-labelledby="how-it-works-heading"
      className="scroll-mt-36 bg-slate-50 py-16 md:py-24"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 lg:px-0">
        <div className="flex flex-col md:flex-row gap-12 md:gap-20">
          <div className="flex-1 max-w-md">
            <p className="text-sm font-semibold uppercase tracking-widest text-cobalt-500 mb-3">
              Simple Process
            </p>
            <h2
              id="how-it-works-heading"
              className="text-3xl font-bold text-neutral-800 leading-tight tracking-tight mb-4"
            >
              How to Buy Your eSIM
            </h2>
            <p className="text-base text-slate-600 leading-relaxed">
              Three simple steps from purchase to connection. From checkout to connected in under five minutes.
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
