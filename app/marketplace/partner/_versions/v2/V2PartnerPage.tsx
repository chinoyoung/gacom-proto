"use client";

import {
  Package,
  Globe,
  TrendingUp,
  Building2,
  Megaphone,
  Smartphone,
  ShieldCheck,
  Check,
  ArrowRight,
} from "lucide-react";

const AFFILIATE_DEMO = "https://sales.goabroad.com/widget/bookings/goabroad_marketplace_partnership";
const AMBASSADOR_DEMO = "https://sales.goabroad.com/widget/bookings/goabroad_marketplace_ambassador_program";
const AFFILIATE_FORM = "https://sales.goabroad.com/widget/form/yGEYwhOqSV5CwE5MqFML";
const AMBASSADOR_FORM = "https://sales.goabroad.com/widget/form/QAu6BLPIIZoSZuir1svA";

const valueProps = [
  {
    icon: Package,
    title: "All-in-One Travel Essentials",
    description: "Give travelers access to trusted services in one convenient platform.",
  },
  {
    icon: Globe,
    title: "215+ Countries Covered",
    description: "Global connectivity and protection for travelers worldwide.",
  },
  {
    icon: TrendingUp,
    title: "Referral Revenue Opportunity",
    description: "Earn commission by recommending trusted travel services to your participants or audience.",
  },
];

const esimFeatures = [
  "Save up to 80% on roaming",
  "215+ countries & regions",
  "Activate in minutes",
  "Custom coupon codes for participants",
  "Transparent earnings dashboard",
];

const insuranceFeatures = [
  "Medical & evacuation support",
  "215+ countries covered",
  "24/7 virtual health access",
  "Flexible plan lengths",
  "Simplified online claims",
  "Real-time claims status",
];

const affiliateItems = [
  {
    num: "01",
    title: "Give travelers what they need",
    description: "Equip your participants with trusted eSIMs and insurance, right in your program experience.",
  },
  {
    num: "02",
    title: "Easy to set up",
    description: "Get up and running in minutes with a simple onboarding process and dedicated support.",
  },
  {
    num: "03",
    title: "Track it all in one place",
    description: "Monitor referrals, conversions, and commissions from a single dashboard.",
  },
  {
    num: "04",
    title: "Earn on every purchase",
    description: "Receive competitive commissions for every product your participants buy through your link.",
  },
];

const ambassadorItems = [
  {
    num: "01",
    title: "Exclusive commission on every referral sale",
    description: "Earn a competitive commission rate every time someone purchases through your unique link.",
  },
  {
    num: "02",
    title: "Personal coupon codes to share",
    description: "Give your audience exclusive discount codes while you earn on every redemption.",
  },
  {
    num: "03",
    title: "Dedicated ambassador support",
    description: "Our team is here to help you succeed with resources, guidance, and a dedicated point of contact.",
  },
  {
    num: "04",
    title: "Made for international travel audiences",
    description: "We look for creators whose audiences are passionate about international experiences.",
  },
];

export default function V2PartnerPage() {
  return (
    <main className="flex flex-col text-neutral-800">
      {/* Section 1 — Hero */}
      <section>
        <div className="bg-cobalt-500 px-4 sm:px-6 md:px-12 lg:px-20 py-20 md:py-24 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight max-w-3xl mb-5">
            Become a Marketplace Partner
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-xl leading-relaxed mb-10">
            Connect your organization or audience with trusted travel essentials and services. Earn commissions, offer real value, and grow together.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <a
              href="#get-started"
              className="inline-flex items-center justify-center bg-white text-cobalt-500 font-semibold px-8 py-3.5 rounded-lg hover:bg-slate-50 transition-colors w-full sm:w-auto text-center"
            >
              Become an Affiliate
            </a>
            <a
              href={AFFILIATE_DEMO}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center border-2 border-white text-white font-semibold px-8 py-3.5 rounded-lg hover:bg-white/10 transition-colors w-full sm:w-auto text-center"
            >
              Book a Demo
            </a>
          </div>
        </div>
        {/* Image strip */}
        <div className="flex h-[200px] sm:h-[240px] md:h-[320px] overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800&q=80"
            alt="Airport terminal"
            className="flex-1 object-cover"
          />
          <img
            src="https://images.unsplash.com/photo-1525253086316-d0c936c814f8?auto=format&fit=crop&w=800&q=80"
            alt="Travelers exploring"
            className="flex-1 object-cover"
          />
          <img
            src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80"
            alt="City travel"
            className="flex-1 object-cover"
          />
        </div>
      </section>

      {/* Section 2 — What is Marketplace */}
      <section className="bg-white px-4 sm:px-6 md:px-12 lg:px-20 py-16 md:py-24">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-12 md:gap-16">
          {/* Left */}
          <div className="flex-1">
            <p className="text-xs font-semibold text-cobalt-500 tracking-widest uppercase mb-5">
              Your Travelers&#39; One-Stop Shop for Travel Essentials
            </p>
            <p className="text-lg text-slate-600 leading-relaxed">
              The GoAbroad Marketplace is a curated hub where travelers can access everything they need for their trip — from eSIMs to insurance. As a partner, you can serve your travelers better and earn along the way.
            </p>
          </div>
          {/* Right */}
          <div className="flex-1 flex flex-col gap-8">
            {valueProps.map(({ icon: Icon, title, description }) => (
              <div key={title} className="flex items-start gap-4">
                <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center shrink-0">
                  <Icon className="w-6 h-6 text-cobalt-500" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-neutral-800 mb-1">{title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3 — Partnership Opportunities */}
      <section className="bg-cobalt-500 px-4 sm:px-6 md:px-12 lg:px-20 py-16 md:py-24">
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
          <h2 className="text-4xl font-bold text-white mb-3">Partnership Opportunities</h2>
          <p className="text-lg text-white/80 mb-12">Two strategic ways to partner with us</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
            {/* Affiliate */}
            <div className="bg-white rounded-xl p-9 flex flex-col gap-5 text-left">
              <div className="w-[52px] h-[52px] bg-cobalt-500/10 rounded-xl flex items-center justify-center shrink-0">
                <Building2 className="w-[26px] h-[26px] text-cobalt-500" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-neutral-800 mb-1">Affiliate</h3>
                <p className="text-sm font-semibold text-cobalt-500 mb-3">Businesses &amp; Organizations</p>
                <p className="text-sm text-slate-600 leading-relaxed">
                  For study abroad providers, universities, NGOs, and organizations looking to add real value to their participant experience. Integrate the Marketplace into your program and earn commissions with every purchase.
                </p>
              </div>
            </div>
            {/* Ambassador */}
            <div className="bg-white rounded-xl p-9 flex flex-col gap-5 text-left">
              <div className="w-[52px] h-[52px] bg-cobalt-500/10 rounded-xl flex items-center justify-center shrink-0">
                <Megaphone className="w-[26px] h-[26px] text-cobalt-500" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-neutral-800 mb-1">Ambassador</h3>
                <p className="text-sm font-semibold text-cobalt-500 mb-3">Travel Influencers &amp; Creators</p>
                <p className="text-sm text-slate-600 leading-relaxed">
                  For content creators, bloggers, and travel influencers with audiences who love exploring the world. Share trusted products, grow your credibility, and earn on every sale you drive.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4 — What You'll Offer */}
      <section className="bg-white px-4 sm:px-6 md:px-12 lg:px-20 py-16 md:py-24">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-neutral-800 mb-3">What You&#39;ll Offer</h2>
            <p className="text-lg text-slate-600">Products your travelers actually need</p>
          </div>
          <div className="flex flex-col gap-16">
            {/* Row 1: Image left, text right */}
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="w-full md:w-1/2">
                <img
                  src="https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&w=1200&q=80"
                  alt="Travel eSIM on phone"
                  className="w-full h-60 md:h-[400px] object-cover rounded-xl"
                />
              </div>
              <div className="w-full md:w-1/2 flex flex-col gap-5">
                <div className="w-12 h-12 bg-cobalt-500/10 rounded-lg flex items-center justify-center shrink-0">
                  <Smartphone className="w-6 h-6 text-cobalt-500" />
                </div>
                <h3 className="text-2xl font-bold text-neutral-800">Travel eSIM</h3>
                <p className="text-base text-slate-600 leading-relaxed">
                  Seamless mobile data access in 215+ countries, no physical SIM, no app required.
                </p>
                <ul className="flex flex-col gap-2.5">
                  {esimFeatures.map((f) => (
                    <li key={f} className="flex items-center gap-2.5">
                      <Check className="w-[18px] h-[18px] text-cobalt-500 shrink-0" />
                      <span className="text-sm text-slate-900">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            {/* Row 2: Text left, image right */}
            <div className="flex flex-col md:flex-row-reverse items-center gap-12">
              <div className="w-full md:w-1/2">
                <img
                  src="https://images.unsplash.com/photo-1587440871875-191322ee64b0?auto=format&fit=crop&w=1200&q=80"
                  alt="Travel insurance"
                  className="w-full h-60 md:h-[400px] object-cover rounded-xl"
                />
              </div>
              <div className="w-full md:w-1/2 flex flex-col gap-5">
                <div className="w-12 h-12 bg-cobalt-500/10 rounded-lg flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-6 h-6 text-cobalt-500" />
                </div>
                <h3 className="text-2xl font-bold text-neutral-800">Travel Insurance</h3>
                <p className="text-base text-slate-600 leading-relaxed">
                  Peace of mind with reliable worldwide coverage and flexible plans for any trip.
                </p>
                <ul className="flex flex-col gap-2.5">
                  {insuranceFeatures.map((f) => (
                    <li key={f} className="flex items-center gap-2.5">
                      <Check className="w-[18px] h-[18px] text-cobalt-500 shrink-0" />
                      <span className="text-sm text-slate-900">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5 — Get Started */}
      <section id="get-started" className="bg-slate-100 px-4 sm:px-6 md:px-12 lg:px-20 py-10 md:py-14">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="text-2xl font-bold text-neutral-800 mb-2">Get Started</h2>
            <p className="text-base text-slate-600 leading-relaxed max-w-md">
              Ready to partner with us? Choose the path that fits you best.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 shrink-0">
            <a
              href={AFFILIATE_FORM}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center bg-cobalt-500 text-white font-semibold px-7 py-3.5 rounded-lg hover:bg-cobalt-600 transition-colors w-full sm:w-auto text-center"
            >
              Affiliate Program
            </a>
            <a
              href={AMBASSADOR_FORM}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center bg-white text-cobalt-500 border border-cobalt-500 font-semibold px-7 py-3.5 rounded-lg hover:bg-cobalt-500/5 transition-colors w-full sm:w-auto text-center"
            >
              Ambassador Program
            </a>
          </div>
        </div>
      </section>

      {/* Section 6 — Why Affiliate */}
      <section className="bg-slate-100 px-4 sm:px-6 md:px-12 lg:px-20 py-16 md:py-24">
        <div className="max-w-5xl mx-auto">
          <div className="max-w-2xl mb-12">
            <h2 className="text-4xl font-bold text-neutral-800 leading-tight tracking-tight mb-5">
              Why become a Marketplace Affiliate Partner?
            </h2>
            <p className="text-base text-slate-600 leading-relaxed">
              When an organization becomes a Marketplace partner, they&#39;re not just adding a feature — they&#39;re adding real value for their participants while unlocking a new revenue stream for themselves.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            {affiliateItems.map(({ num, title, description }) => (
              <div key={num} className="flex items-start gap-4">
                <div className="w-12 h-12 bg-cobalt-500 rounded-xl flex items-center justify-center shrink-0">
                  <span className="text-sm font-bold text-white">{num}</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-neutral-800 mb-1">{title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{description}</p>
                </div>
              </div>
            ))}
          </div>
          {/* Demo callout */}
          <div className="bg-white rounded-xl border border-slate-200 px-8 py-8 md:px-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-semibold text-neutral-800 mb-2">Prefer to talk first?</h3>
              <p className="text-sm text-slate-600 leading-relaxed max-w-lg">
                Book a live demo with the GoAbroad Marketplace team and see exactly how our partnership program works.
              </p>
            </div>
            <a
              href={AFFILIATE_DEMO}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-cobalt-500 text-white font-semibold px-8 py-3.5 rounded-lg hover:bg-cobalt-600 transition-colors shrink-0"
            >
              Book a Demo
              <ArrowRight className="w-4 h-4 text-white" />
            </a>
          </div>
        </div>
      </section>

      {/* Section 7 — Why Ambassador */}
      <section className="bg-cobalt-500 px-4 sm:px-6 md:px-12 lg:px-20 py-16 md:py-24">
        <div className="max-w-5xl mx-auto">
          <div className="max-w-2xl mb-12">
            <h2 className="text-4xl font-bold text-white leading-tight tracking-tight mb-5">
              Why become a GoAbroad Marketplace Ambassador?
            </h2>
            <p className="text-base text-slate-300 leading-relaxed">
              Join a community of travel creators who share products that genuinely help international travelers, and earn while you do it.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            {ambassadorItems.map(({ num, title, description }) => (
              <div key={num} className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                  <span className="text-sm font-bold text-white">{num}</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">{title}</h3>
                  <p className="text-sm text-slate-300 leading-relaxed">{description}</p>
                </div>
              </div>
            ))}
          </div>
          {/* Demo callout */}
          <div className="bg-white/10 rounded-xl border border-white/20 px-8 py-8 md:px-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">Prefer to talk first?</h3>
              <p className="text-sm text-slate-300 leading-relaxed max-w-lg">
                Book a live demo with the GoAbroad Marketplace team and see exactly how our partnership program works.
              </p>
            </div>
            <a
              href={AMBASSADOR_DEMO}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white text-cobalt-500 font-semibold px-8 py-3.5 rounded-lg hover:bg-slate-50 transition-colors shrink-0"
            >
              Book a Demo
              <ArrowRight className="w-4 h-4 text-cobalt-500" />
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
