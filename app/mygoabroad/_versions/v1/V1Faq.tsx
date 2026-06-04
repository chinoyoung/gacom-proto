"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { MYG_FAQS } from "../../_shared/content";

export default function V1Faq() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="mb-2">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          Frequently Asked Questions
        </h2>
      </div>
      {MYG_FAQS.map((faq, idx) => {
        const isOpen = openIdx === idx;
        return (
          <div key={faq.question} className="rounded-lg border border-slate-200 bg-white px-6">
            <button
              type="button"
              onClick={() => setOpenIdx(isOpen ? null : idx)}
              aria-expanded={isOpen}
              className="w-full flex items-center justify-between gap-4 py-5 text-left font-bold text-slate-800 cursor-pointer"
            >
              <span>{faq.question}</span>
              <ChevronDown
                className={`w-5 h-5 shrink-0 text-slate-400 transition-transform duration-200 ${
                  isOpen ? "rotate-180" : ""
                }`}
                aria-hidden="true"
              />
            </button>
            {isOpen && (
              <p className="pb-5 text-slate-700 leading-relaxed whitespace-pre-wrap">{faq.answer}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
