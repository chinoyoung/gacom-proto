"use client";

const steps = [
  {
    number: "01",
    title: "Choose Your Plan",
    description: "Browse destinations, pick your data amount and validity period.",
  },
  {
    number: "02",
    title: "Install & Activate",
    description: "Scan the QR code or install directly. Activation takes under 5 minutes.",
  },
  {
    number: "03",
    title: "Stay Connected",
    description: "Land at your destination and enjoy instant data. Top up anytime if you need more.",
  },
];

export default function EsimDetailHowItWorks() {
  return (
    <section
      id="how-it-works"
      aria-labelledby="esim-detail-how-it-works-heading"
      className="scroll-mt-36 bg-white py-16 md:py-24"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 lg:px-0">
        <div className="flex flex-col md:flex-row gap-12 md:gap-20">
          <div className="flex-1 max-w-md">
            <p className="text-sm font-semibold uppercase tracking-widest text-cobalt-500 mb-3">
              Simple Process
            </p>
            <h2
              id="esim-detail-how-it-works-heading"
              className="text-3xl font-bold text-neutral-800 leading-tight tracking-tight mb-4"
            >
              How to Buy Your eSIM
            </h2>
            <p className="text-base leading-relaxed text-slate-600">
              From checkout to connected in under five minutes — no contracts, no shipping.
            </p>
          </div>
          <ol className="flex-1 flex flex-col gap-8">
            {steps.map(({ number, title, description }) => (
              <li key={number} className="flex items-start gap-4">
                <div className="w-10 h-10 bg-cobalt-500 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-white">{number}</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-neutral-800 mb-1">{title}</h3>
                  <p className="text-sm leading-relaxed text-slate-500">{description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
