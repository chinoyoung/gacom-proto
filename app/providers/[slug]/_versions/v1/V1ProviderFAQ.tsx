"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { Provider } from "../../_components/types";

export default function V1ProviderFAQ({ provider }: { provider: Provider }) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = provider.faqs;

  if (faqs.length === 0) return null;

  return (
    <section
      id="faqs"
      aria-labelledby="faq-heading"
      className="scroll-mt-36 w-full max-w-7xl mx-auto mt-20 px-4 xl:px-0"
    >
      <div className="flex flex-col md:flex-row gap-10 md:gap-20">
        <div className="flex-1 max-w-xs">
          <p className="text-sm font-semibold uppercase tracking-widest text-cobalt-500 mb-3">
            FAQ
          </p>
          <h2
            id="faq-heading"
            className="text-2xl md:text-3xl font-bold text-neutral-800 leading-tight tracking-tight mb-4"
          >
            Frequently Asked Questions
          </h2>
          <p className="text-base text-slate-600 leading-relaxed">
            Everything you need to know about {provider.name}.
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
                    className="w-full flex items-center justify-between gap-4 py-4 text-left text-sm font-semibold text-neutral-800 hover:text-cobalt-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500 rounded cursor-pointer"
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
                      className="pb-4 text-sm text-slate-600 leading-relaxed whitespace-pre-wrap"
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
