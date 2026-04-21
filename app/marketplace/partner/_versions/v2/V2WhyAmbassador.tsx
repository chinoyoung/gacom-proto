"use client";

import { ArrowRight } from "lucide-react";
import { AMBASSADOR_DEMO, ambassadorItems } from "../v1/constants";

export default function V2WhyAmbassador() {
  return (
    <section
      id="ambassador"
      aria-labelledby="why-ambassador-heading"
      className="scroll-mt-36 bg-white px-4 sm:px-6 md:px-12 lg:px-20 py-16 md:py-24"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row-reverse gap-12 md:gap-16 mb-12">
          {/* Text + items */}
          <div className="flex-1">
            <div className="max-w-2xl mb-10">
              <h2
                id="why-ambassador-heading"
                className="text-3xl font-bold text-neutral-800 leading-tight tracking-tight mb-4"
              >
                Why become a GoAbroad Marketplace Ambassador?
              </h2>
              <p className="text-base text-slate-600 leading-relaxed">
                Join a community of travel creators who share products that genuinely help international travelers, and earn while you do it.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-8">
              {ambassadorItems.map(({ num, title, description }) => (
                <div key={num} className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-roman-500 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-white">{num}</span>
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-neutral-800 mb-1 leading-snug">{title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Side illustration */}
          <div className="w-full md:w-72 shrink-0 flex items-start justify-center">
            <img
              src="/illustrations/influencer.svg"
              alt="Illustration of a travel creator sharing content"
              className="w-full max-w-xs md:max-w-none h-auto rounded-lg"
            />
          </div>
        </div>

        {/* Demo callout */}
        <div className="bg-white rounded-lg border border-slate-200 px-8 py-7 md:px-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div>
            <h3 className="text-base font-semibold text-neutral-800 mb-1">Questions before you apply?</h3>
            <p className="text-sm text-slate-500 leading-relaxed max-w-md">
              Book a live demo with the GoAbroad Marketplace team and see exactly how our partnership program works.
            </p>
          </div>
          <a
            href={AMBASSADOR_DEMO}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Book an Ambassador Program demo"
            className="inline-flex items-center gap-2 bg-roman-500 text-white font-semibold px-6 py-3 rounded-lg hover:bg-roman-600 transition-colors shrink-0 text-sm"
          >
            Book a demo
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
