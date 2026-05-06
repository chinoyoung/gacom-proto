"use client";

const steps = [
  {
    number: "1",
    title: "Choose Your Plan",
    description: "Pick the destination and data package that fits your trip.",
  },
  {
    number: "2",
    title: "Install & Activate",
    description: "Scan the QR code we email you to install your eSIM in seconds.",
  },
  {
    number: "3",
    title: "Stay Connected",
    description: "Land, connect, and use your data anywhere in your destination country.",
  },
];

export default function OrigEsimHowItWorks() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-3">
            How to Buy Your eSIM
          </h2>
          <p className="text-base text-slate-600 max-w-2xl mx-auto">
            Three simple steps from purchase to connection.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 max-w-5xl mx-auto">
          {steps.map((step, idx) => (
            <div
              key={step.number}
              className="relative flex flex-col items-center text-center bg-slate-50 rounded-xl p-8"
            >
              <div className="flex items-center justify-center w-12 h-12 bg-cobalt-500 text-white text-lg font-bold rounded-full mb-5">
                {step.number}
              </div>
              <h3 className="text-lg font-bold text-neutral-900 mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {step.description}
              </p>

              {idx < steps.length - 1 && (
                <div className="hidden md:block absolute top-14 -right-3 text-slate-300" aria-hidden="true">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
