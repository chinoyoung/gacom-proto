"use client";

import { ArrowRight } from "lucide-react";
import { AFFILIATE_DEMO, affiliateItems } from "./constants";

export default function V1WhyAffiliate() {
  return (
    <section id="affiliate" aria-labelledby="why-affiliate-heading" className="scroll-mt-36 bg-slate-50 px-4 sm:px-6 md:px-12 lg:px-20 py-16 md:py-24">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-2xl mb-12">
          <h2 id="why-affiliate-heading" className="text-3xl font-bold text-neutral-800 leading-tight tracking-tight mb-4">
            Why become a Marketplace Affiliate Partner?
          </h2>
          <p className="text-base text-slate-600 leading-relaxed">
            When an organization becomes a Marketplace partner, they&#39;re not just adding a feature, they&#39;re adding real value for their participants while unlocking a new revenue stream for themselves.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 mb-12">
          {affiliateItems.map(({ num, title, description }) => (
            <div key={num} className="flex items-start gap-4">
              <div className="w-10 h-10 bg-cobalt-500 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-xs font-bold text-white">{num}</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-neutral-800 mb-1">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-lg border border-slate-200 px-8 py-7 md:px-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div>
            <h3 className="text-base font-semibold text-neutral-800 mb-1">Prefer to talk first?</h3>
            <p className="text-sm text-slate-500 leading-relaxed max-w-md">
              Book a live demo with the GoAbroad Marketplace team and see exactly how our partnership program works.
            </p>
          </div>
          <a
            href={AFFILIATE_DEMO}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Book an Affiliate Program demo"
            className="inline-flex items-center gap-2 bg-cobalt-500 text-white font-semibold px-6 py-3 rounded-lg hover:bg-cobalt-600 transition-colors shrink-0 text-sm"
          >
            Book a demo
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
