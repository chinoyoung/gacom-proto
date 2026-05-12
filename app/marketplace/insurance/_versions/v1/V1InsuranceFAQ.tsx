"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

type FaqAnswer = string | { lead: string; bullets: string[] };

interface Faq {
  question: string;
  answer: FaqAnswer;
}

const faqs: Faq[] = [
  {
    question: "What is travel insurance, and why do I need it?",
    answer:
      "Travel insurance is a type of coverage that protects you while you're abroad by providing benefits like emergency medical care, evacuation, repatriation, and lost luggage protection.\n\nYou need travel insurance, especially in case of emergencies, to avoid paying high medical costs or being left without support in unexpected situations. That's why GoAbroad offers trusted plans specifically designed for global travelers.",
  },
  {
    question: "Do I need travel insurance if I already have domestic health insurance?",
    answer:
      "Yes! Most domestic health insurance plans don't provide full coverage outside your home country. They often exclude international medical treatment or emergency evacuation benefits. Travel insurance helps fill these gaps by offering dedicated global coverage and 24/7 support while you're abroad.",
  },
  {
    question: "What kinds of situations does travel insurance cover?",
    answer:
      "Travel insurance covers a range of unexpected situations while you're abroad. Depending on the plan, this can include medical emergencies, evacuation, repatriation, lost or delayed baggage, and disruptions due to natural disasters, political unrest, or family emergencies.\n\nSome plans also offer virtual healthcare and emotional wellness support (check out our Standard and Premium plan options!), so you can choose the protection that best fits your needs.",
  },
  {
    question: "Does travel insurance cover COVID-19 or other types of pandemics?",
    answer:
      "In most cases, yes! Many GoAbroad plans include benefits for COVID-19-related medical care, quarantine costs, and emergency return to your home country. Always review your plan's policy details to be sure!",
  },
  {
    question: "When should I buy travel insurance?",
    answer:
      "Travel insurance should be purchased as soon as you book your trip to ensure you have everything lined up for your time abroad. In some cases, it's even required for visa application processes too!",
  },
  {
    question: "How do I access my insurance documents?",
    answer: {
      lead: "After purchasing a plan, you'll receive access to a personalized Student Zone. This portal allows you to download important documents, including:",
      bullets: [
        "Your insurance ID card",
        "A visa support letter (if required)",
        "Full policy details and claim instructions",
      ],
    },
  },
  {
    question: "What makes travel insurance from GoAbroad the best for international travelers?",
    answer:
      "GoAbroad partners with trusted insurance providers that offer global coverage tailored for students, interns, volunteers, and other international travelers. The plans are flexible, affordable, and supported by helpful features like 24/7 Student Zone access, instant documentation, and virtual healthcare services while abroad.",
  },
];

export default function V1InsuranceFAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="scroll-mt-36 bg-white py-16 md:py-24"
    >
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row gap-12 md:gap-20">
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
            Find out everything you need to know about GoAbroad Travel Insurance.
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
                      className="pb-4 text-sm text-slate-600 leading-relaxed"
                    >
                      {typeof faq.answer === "string" ? (
                        <p className="whitespace-pre-line">{faq.answer}</p>
                      ) : (
                        <>
                          <p>{faq.answer.lead}</p>
                          <ul className="list-disc pl-5 mt-2 space-y-1">
                            {faq.answer.bullets.map((bullet) => (
                              <li key={bullet}>{bullet}</li>
                            ))}
                          </ul>
                        </>
                      )}
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
