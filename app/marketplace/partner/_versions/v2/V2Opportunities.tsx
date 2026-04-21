"use client";

export default function V2Opportunities() {
  return (
    <section
      id="opportunities"
      aria-labelledby="opportunities-heading"
      className="scroll-mt-36 bg-slate-50 px-4 sm:px-6 md:px-12 lg:px-20 py-16 md:py-24"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2
            id="opportunities-heading"
            className="text-3xl font-bold text-neutral-800 leading-tight tracking-tight mb-4"
          >
            Partnership Opportunities
          </h2>
          <p className="text-sm font-semibold uppercase tracking-widest text-slate-400 mb-4">
            Two strategic ways to partner with us
          </p>
          <p className="text-sm text-slate-600 leading-relaxed">
            Whether you&#39;re running a travel organization or building an audience of travelers, there&#39;s a marketplace partnership opportunity designed for you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Affiliate tile */}
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden flex flex-col">
            <img
              src="/illustrations/business.svg"
              alt="Illustration of a business organization partnering as an affiliate"
              className="w-full h-56 object-contain bg-cobalt-50/60 p-6"
            />
            <div className="p-8 flex flex-col gap-3">
              <div>
                <p className="text-xs font-semibold text-cobalt-500 uppercase tracking-wide mb-1">
                  Businesses &amp; Organizations
                </p>
                <h3 className="text-xl font-bold text-neutral-900">Affiliate</h3>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                Study abroad providers, universities, NGOs, and travel organizations. Add the Marketplace to your participant experience and earn commissions while giving travelers the tools they need.
              </p>
            </div>
          </div>

          {/* Ambassador tile */}
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden flex flex-col">
            <img
              src="/illustrations/influencer.svg"
              alt="Illustration of a travel creator sharing content with their audience"
              className="w-full h-56 object-contain bg-cobalt-50/60 p-6"
            />
            <div className="p-8 flex flex-col gap-3">
              <div>
                <p className="text-xs font-semibold text-cobalt-500 uppercase tracking-wide mb-1">
                  Travel Influencers &amp; Creators
                </p>
                <h3 className="text-xl font-bold text-neutral-900">Ambassador</h3>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                Content creators, travel bloggers, and social media personalities. Share trusted products with your audience, earn on every referral, and add value to your community.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
