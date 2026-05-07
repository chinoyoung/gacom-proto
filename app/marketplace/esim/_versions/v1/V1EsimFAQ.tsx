"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "What is an eSIM and how does it work?",
    answer:
      "An eSIM is a digital SIM card that's built directly into your phone. Instead of inserting a physical card, you scan a QR code that downloads a mobile plan to your device. You can keep your regular SIM active and use the eSIM just for travel data.",
  },
  {
    question: "Is my phone compatible with eSIM?",
    answer:
      "Most phones released after 2018 support eSIM, including iPhone XS and newer, Google Pixel 3 and newer, and most flagship Samsung Galaxy devices. We'll check compatibility before you purchase.",
  },
  {
    question: "How long does activation take?",
    answer:
      "Activation typically takes under 5 minutes. You'll receive a QR code by email immediately after purchase. Scan it with your phone's camera and the eSIM installs automatically.",
  },
  {
    question: "What happens when my data plan runs out?",
    answer:
      "You'll receive a notification before your plan expires. You can top up directly from your account dashboard at any time, or purchase a new plan if you're heading to another country.",
  },
  {
    question: "Can I keep my existing phone number?",
    answer:
      "Yes. The eSIM works alongside your physical SIM, so calls and texts to your regular number still come through while you use the eSIM for affordable mobile data abroad.",
  },
  {
    question: "Can I get a refund if I haven't used the eSIM?",
    answer:
      "Yes. If you haven't activated your eSIM, you can request a full refund within 30 days of purchase. Reach out to our support team and we'll process it quickly.",
  },
];

export default function V1EsimFAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="scroll-mt-36 bg-white py-16 md:py-24"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 lg:px-0 flex flex-col md:flex-row gap-12 md:gap-20">
        <div className="flex-1 max-w-xs">
          <p className="text-sm font-semibold uppercase tracking-widest text-cobalt-500 mb-3">
            FAQ
          </p>
          <h2
            id="faq-heading"
            className="text-3xl font-bold text-neutral-800 leading-tight tracking-tight mb-4"
          >
            Frequently Asked Questions
          </h2>
          <p className="text-base text-slate-600 leading-relaxed">
            Everything you need to know before you buy.
          </p>
        </div>

        <div className="flex-1">
          <div className="divide-y divide-slate-200">
            {faqs.map((faq, idx) => {
              const isOpen = openIdx === idx;
              return (
                <div key={faq.question}>
                  <button
                    type="button"
                    onClick={() => setOpenIdx(isOpen ? null : idx)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${idx}`}
                    className="w-full flex items-center justify-between gap-4 py-4 text-left text-sm font-semibold text-neutral-800 hover:text-cobalt-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500 rounded"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={`w-5 h-5 shrink-0 text-slate-400 transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                      aria-hidden="true"
                    />
                  </button>
                  {isOpen && (
                    <div
                      id={`faq-answer-${idx}`}
                      className="pb-4 text-sm text-slate-600 leading-relaxed"
                    >
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
