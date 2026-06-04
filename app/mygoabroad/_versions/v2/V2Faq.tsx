"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { MYG_FAQS } from "../../_shared/content";

export default function V2Faq() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section className="bg-slate-50 px-4 sm:px-6 md:px-12 lg:px-20 py-16 md:py-24">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-10 md:gap-20">
        <div className="flex-1 max-w-xs">
          <p className="text-xs font-semibold uppercase tracking-widest text-cobalt-500 mb-3">FAQ</p>
          <h2 className="text-2xl md:text-3xl font-bold text-neutral-800 leading-tight tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-base text-slate-600 leading-relaxed mt-4">
            Everything you need to know about GoAbroad and MyGoAbroad.
          </p>
        </div>
        <div className="flex-1">
          <div className="divide-y divide-slate-200">
            {MYG_FAQS.map((faq, idx) => {
              const isOpen = openIdx === idx;
              return (
                <div key={faq.question}>
                  <button
                    type="button"
                    onClick={() => setOpenIdx(isOpen ? null : idx)}
                    aria-expanded={isOpen}
                    className="w-full flex items-center justify-between gap-4 py-4 text-left text-sm font-semibold text-neutral-800 hover:text-cobalt-600 transition-colors cursor-pointer"
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
                    <p className="pb-4 text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                      {faq.answer}
                    </p>
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
