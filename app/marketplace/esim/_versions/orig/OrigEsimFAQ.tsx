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

export default function OrigEsimFAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section className="bg-white pb-16 md:pb-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-3">
            Frequently Asked Questions
          </h2>
          <p className="text-base text-slate-600">
            Everything you need to know before you buy.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={faq.question}
                className="bg-slate-50 border border-slate-100 rounded-xl overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left text-sm md:text-base font-semibold text-neutral-900 hover:bg-slate-100 transition-colors"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 shrink-0 text-slate-500 transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                    aria-hidden="true"
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-sm text-slate-600 leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
