"use client";

import { ArrowRight, CalendarCheck } from "lucide-react";
import { AMBASSADOR_DEMO, ambassadorItems } from "./constants";

export default function V1WhyAmbassador() {
  return (
    <section id="ambassador" aria-labelledby="why-ambassador-heading" className="scroll-mt-36 bg-white px-4 sm:px-6 md:px-12 lg:px-20 py-16 md:py-24">
      <div className="max-w-5xl mx-auto">
        <div className="max-w-2xl mb-12">
          <h2 id="why-ambassador-heading" className="text-3xl font-bold text-neutral-800 leading-tight tracking-tight mb-4">
            Why become a GoAbroad Marketplace Ambassador?
          </h2>
          <p className="text-base text-slate-600 leading-relaxed">
            Join a community of travel creators who share products that genuinely help international travelers, and earn while you do it.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 flex flex-col gap-8">
            {ambassadorItems.map(({ num, title, description }) => (
              <div key={num} className="flex items-start gap-4">
                <div className="w-10 h-10 bg-roman-500 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-white">{num}</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-neutral-800 mb-1 leading-snug">{title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-lg border border-slate-200 p-8 flex flex-col justify-between gap-5">
            <div>
              <div className="w-14 h-14 bg-cobalt-500/10 rounded-lg flex items-center justify-center mb-5">
                <CalendarCheck className="w-7 h-7 text-cobalt-500" />
              </div>
              <h3 className="text-base font-semibold text-neutral-800 mb-1">Questions before you apply?</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Book a live demo with the GoAbroad Marketplace team and see exactly how our partnership program works.
              </p>
            </div>
            <a
              href={AMBASSADOR_DEMO}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Book an Ambassador Program demo"
              className="inline-flex items-center gap-2 bg-cobalt-500 text-white font-semibold px-6 py-3 rounded-lg hover:bg-cobalt-600 transition-colors text-sm self-start"
            >
              Book a demo
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
