"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  MYG_FAQS,
  type MyGFaq,
  type ParagraphSegments,
  type LinkSegment,
} from "../../_shared/content";

function isLinkSegment(seg: string | LinkSegment): seg is LinkSegment {
  return typeof seg === "object" && seg !== null && "href" in seg;
}

function RenderParagraph({ segments }: { segments: ParagraphSegments }) {
  return (
    <p className="text-sm text-slate-600 leading-relaxed">
      {segments.map((seg, i) =>
        isLinkSegment(seg) ? (
          <a
            key={i}
            href={seg.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-cobalt-500 no-underline hover:underline"
          >
            {seg.text}
          </a>
        ) : (
          <span key={i}>{seg}</span>
        )
      )}
    </p>
  );
}

function FaqAnswer({ faq }: { faq: MyGFaq }) {
  return (
    <div className="pb-5 flex flex-col gap-3">
      {faq.paragraphs.map((segments, i) => (
        <RenderParagraph key={i} segments={segments} />
      ))}

      {faq.directoryLinks && faq.directoryLinks.length > 0 && (
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 list-none p-0 m-0 mt-1">
          {faq.directoryLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-cobalt-500 no-underline hover:underline"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      )}

      {faq.steps && faq.steps.length > 0 && (
        <ol className="list-decimal pl-5 flex flex-col gap-2 text-sm text-slate-600 leading-relaxed">
          {faq.steps.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ol>
      )}

      {faq.readLinks && faq.readLinks.length > 0 && (
        <div className="flex flex-col gap-1">
          {faq.readLinks.map((link) => (
            <p key={link.href} className="text-sm text-slate-600 leading-relaxed">
              Read:{" "}
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cobalt-500 no-underline hover:underline"
              >
                {link.label}
              </a>
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

export default function V2Faq() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <section
      id="faq"
      aria-labelledby="myg-faq-heading"
      className="scroll-mt-24 bg-slate-50 px-4 sm:px-6 md:px-12 lg:px-20 py-16 md:py-24"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-10 md:gap-20">
        <div className="flex-1 max-w-xs">
          <p className="text-sm font-semibold uppercase tracking-widest text-cobalt-500 mb-3">FAQ</p>
          <h2
            id="myg-faq-heading"
            className="text-3xl font-bold tracking-tight text-neutral-800 leading-tight"
          >
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
                    className="w-full flex items-center justify-between gap-4 py-4 text-left text-sm font-semibold text-neutral-800 hover:text-cobalt-600 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500 rounded-lg"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={`w-5 h-5 shrink-0 text-slate-400 transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                      aria-hidden="true"
                    />
                  </button>
                  {isOpen && <FaqAnswer faq={faq} />}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
