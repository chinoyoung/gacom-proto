"use client";

const steps = [
  {
    number: "1",
    title: "Choose Your Plan",
    description: "Browse destinations, pick your data amount and validity period.",
    color: "bg-cobalt-500",
  },
  {
    number: "2",
    title: "Install & Activate",
    description: "Scan the QR code or install directly. Activation takes under 5 minutes.",
    color: "bg-cobalt-100",
  },
  {
    number: "3",
    title: "Stay Connected",
    description: "Land at your destination and enjoy instant data. Top up anytime if you need more.",
    color: "bg-roman-500",
  },
];

export default function EsimDetailHowItWorks() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-3">
            How to Buy Your eSIM
          </h2>
          <p className="text-base text-slate-600 max-w-2xl mx-auto">
            Get connected in three simple steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {steps.map((step) => (
            <div
              key={step.number}
              className="flex flex-col items-center text-center bg-slate-50 rounded-xl p-8"
            >
              <div className={`flex items-center justify-center w-12 h-12 ${step.color} text-white text-lg font-bold rounded-full mb-5`}>
                {step.number}
              </div>
              <h3 className="text-lg font-bold text-neutral-900 mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
