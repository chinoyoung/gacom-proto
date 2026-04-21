"use client";

import { Building2, Megaphone } from "lucide-react";

export default function V1Opportunities() {
  return (
    <section id="opportunities" aria-labelledby="opportunities-heading" className="scroll-mt-36 bg-cobalt-500 px-4 sm:px-6 md:px-12 lg:px-20 py-16 md:py-24">
      <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
        <h2 id="opportunities-heading" className="text-3xl font-bold text-white leading-tight tracking-tight mb-4">Partnership Opportunities</h2>
        <p className="text-sm font-semibold uppercase tracking-widest text-white/50 mb-5">Two strategic ways to partner with us</p>
        <p className="text-sm text-white/60 max-w-2xl leading-relaxed mb-12">
          Whether you&#39;re running a travel organization or building an audience of travelers, there&#39;s a marketplace partnership opportunity designed for you.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full text-left">
          {/* Affiliate card */}
          <div className="bg-white rounded-xl p-8 flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-cobalt-500/10 rounded-lg flex items-center justify-center shrink-0">
                <Building2 className="w-5 h-5 text-cobalt-500" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-neutral-900 leading-tight">Affiliate</h3>
                <p className="text-xs font-semibold text-cobalt-500 uppercase tracking-wide mt-0.5">Businesses &amp; Organizations</p>
              </div>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              Study abroad providers, universities, NGOs, and travel organizations. Add the Marketplace to your participant experience and earn commissions while giving travelers the tools they need.
            </p>
          </div>
          {/* Ambassador card */}
          <div className="bg-white rounded-xl p-8 flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-cobalt-500/10 rounded-lg flex items-center justify-center shrink-0">
                <Megaphone className="w-5 h-5 text-cobalt-500" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-neutral-900 leading-tight">Ambassador</h3>
                <p className="text-xs font-semibold text-cobalt-500 uppercase tracking-wide mt-0.5">Travel Influencers &amp; Creators</p>
              </div>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              Content creators, travel bloggers, and social media personalities. Share trusted products with your audience, earn on every referral, and add value to your community.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
