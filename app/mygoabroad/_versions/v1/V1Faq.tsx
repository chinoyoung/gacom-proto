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
    <p className="text-slate-700 leading-relaxed">
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
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 list-none p-0 m-0">
          {faq.directoryLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cobalt-500 no-underline hover:underline text-sm"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      )}

      {faq.steps && faq.steps.length > 0 && (
        <ol className="list-decimal pl-5 flex flex-col gap-2 text-slate-700 leading-relaxed">
          {faq.steps.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ol>
      )}

      {faq.readLinks && faq.readLinks.length > 0 && (
        <div className="flex flex-col gap-1">
          {faq.readLinks.map((link) => (
            <p key={link.href} className="text-slate-700 leading-relaxed">
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
            {isOpen && <FaqAnswer faq={faq} />}
          </div>
        );
      })}
    </div>
  );
}
