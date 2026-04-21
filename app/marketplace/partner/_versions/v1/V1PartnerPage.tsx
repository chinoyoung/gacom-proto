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
  Gift,
  Zap,
  BarChart3,
  Coins,
  Percent,
  Tag,
  Headphones,
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

const affiliateBenefits = [
  {
    icon: Gift,
    title: "Give travelers what they need",
    description: "Equip your participants with trusted eSIMs and insurance, right in your program experience.",
  },
  {
    icon: Zap,
    title: "Easy to set up",
    description: "Get up and running in minutes with a simple onboarding process and dedicated support.",
  },
  {
    icon: BarChart3,
    title: "Track it all in one place",
    description: "Monitor referrals, conversions, and commissions from a single dashboard.",
  },
  {
    icon: Coins,
    title: "Earn on every purchase",
    description: "Receive competitive commissions for every product your participants buy through your link.",
  },
];

const ambassadorBenefits = [
  {
    icon: Percent,
    title: "Exclusive commission on every referral sale",
    description: "Earn a competitive commission rate every time someone purchases through your unique link.",
  },
  {
    icon: Tag,
    title: "Personal coupon codes to share",
    description: "Give your audience exclusive discount codes while you earn on every redemption.",
  },
  {
    icon: Headphones,
    title: "Dedicated ambassador support",
    description: "Our team is here to help you succeed with resources, guidance, and a dedicated point of contact.",
  },
  {
    icon: Globe,
    title: "Made for international travel audiences",
    description: "We look for creators whose audiences are passionate about international experiences.",
  },
];

export default function V1PartnerPage() {
  return (
    <main className="flex flex-col text-neutral-800">
      {/* Section 1 — Hero */}
      <section className="flex flex-col md:flex-row min-h-[520px]">
        <div className="flex-1 bg-cobalt-500 flex flex-col justify-center px-8 sm:px-12 lg:px-20 py-20">
          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-5">
            Become a<br />Marketplace Partner
          </h1>
          <p className="text-lg text-white/80 max-w-lg mb-8 leading-relaxed">
            Connect your organization or audience with trusted travel essentials and services. Earn commissions, offer real value, and grow together.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <a
              href="#get-started"
              className="inline-flex items-center justify-center bg-white text-cobalt-500 font-semibold px-7 py-3.5 rounded-lg hover:bg-slate-50 transition-colors w-full sm:w-auto text-center"
            >
              Become an Affiliate
            </a>
            <a
              href={AFFILIATE_DEMO}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center border-2 border-white text-white font-semibold px-7 py-3.5 rounded-lg hover:bg-white/10 transition-colors w-full sm:w-auto text-center"
            >
              Book a Demo
            </a>
          </div>
        </div>
        <div className="w-full md:w-1/2 min-h-64 md:min-h-0">
          <img
            src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80"
            alt="Travelers with backpacks"
            className="w-full h-full object-cover"
            style={{ minHeight: "260px" }}
          />
        </div>
      </section>

      {/* Section 2 — What is Marketplace */}
      <section className="bg-white px-4 sm:px-6 md:px-12 lg:px-20 py-16 md:py-24">
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
          <p className="text-xs font-semibold text-cobalt-500 tracking-widest uppercase mb-5">
            Your Travelers&#39; One-Stop Shop for Travel Essentials
          </p>
          <p className="text-lg text-slate-600 max-w-2xl leading-relaxed mb-14">
            The GoAbroad Marketplace is a curated hub where travelers can access everything they need for their trip — from eSIMs to insurance. As a partner, you can serve your travelers better and earn along the way.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
            {valueProps.map(({ icon: Icon, title, description }) => (
              <div key={title} className="bg-slate-100 rounded-xl p-8 flex flex-col gap-4 text-left">
                <div className="w-12 h-12 bg-cobalt-500 rounded-lg flex items-center justify-center shrink-0">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-neutral-800">{title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3 — Partnership Opportunities */}
      <section className="bg-slate-100 px-4 sm:px-6 md:px-12 lg:px-20 py-16 md:py-24">
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
          <h2 className="text-4xl font-bold text-neutral-800 mb-3">Partnership Opportunities</h2>
          <p className="text-lg text-slate-600 mb-4">Two strategic ways to partner with us</p>
          <p className="text-base text-slate-600 max-w-lg leading-relaxed mb-12">
            Whether you represent an organization or build an audience online, there&#39;s a partnership model designed for you.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
            {/* Affiliate Card */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-10 flex flex-col gap-5 text-left">
              <div className="w-14 h-14 bg-cobalt-500 rounded-lg flex items-center justify-center shrink-0">
                <Building2 className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-neutral-800 mb-1">Affiliate</h3>
                <p className="text-sm font-semibold text-cobalt-500 mb-3">Businesses &amp; Organizations</p>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Study abroad providers, universities, NGOs, and travel organizations. Add the Marketplace to your participant experience and earn commissions while giving travelers the tools they need.
                </p>
              </div>
            </div>
            {/* Ambassador Card */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-10 flex flex-col gap-5 text-left">
              <div className="w-14 h-14 bg-cobalt-500 rounded-lg flex items-center justify-center shrink-0">
                <Megaphone className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-neutral-800 mb-1">Ambassador</h3>
                <p className="text-sm font-semibold text-cobalt-500 mb-3">Travel Influencers &amp; Creators</p>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Content creators, travel bloggers, and social media personalities. Share trusted products with your audience, earn on every referral, and add value to your community.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4 — What You'll Offer */}
      <section className="bg-slate-100 px-4 sm:px-6 md:px-12 lg:px-20 py-16 md:py-24">
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
          <h2 className="text-4xl font-bold text-neutral-800 mb-3">What You&#39;ll Offer</h2>
          <p className="text-lg text-slate-600 font-medium mb-4">Products your travelers actually need</p>
          <p className="text-base text-slate-600 max-w-lg leading-relaxed mb-12">
            Give your audience access to essential travel products they&#39;ll love — and earn commissions on every sale.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
            {/* eSIM Card */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8 flex flex-col gap-5 text-left">
              <div className="w-12 h-12 bg-cobalt-500/10 rounded-lg flex items-center justify-center shrink-0">
                <Smartphone className="w-6 h-6 text-cobalt-500" />
              </div>
              <h3 className="text-xl font-bold text-neutral-800">Travel eSIM</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Seamless mobile data access in 215+ countries, no physical SIM, no app required.
              </p>
              <ul className="flex flex-col gap-2">
                {esimFeatures.map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <Check className="w-[18px] h-[18px] text-cobalt-500 shrink-0" />
                    <span className="text-sm text-slate-600">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
            {/* Insurance Card */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8 flex flex-col gap-5 text-left">
              <div className="w-12 h-12 bg-cobalt-500/10 rounded-lg flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6 text-cobalt-500" />
              </div>
              <h3 className="text-xl font-bold text-neutral-800">Travel Insurance</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Peace of mind with reliable worldwide coverage and flexible plans for any trip.
              </p>
              <ul className="flex flex-col gap-2">
                {insuranceFeatures.map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <Check className="w-[18px] h-[18px] text-cobalt-500 shrink-0" />
                    <span className="text-sm text-slate-600">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5 — Get Started */}
      <section id="get-started" className="bg-cobalt-500 px-4 sm:px-6 md:px-12 lg:px-20 py-16 md:py-24">
        <div className="max-w-2xl mx-auto flex flex-col items-center text-center">
          <h2 className="text-4xl font-bold text-white mb-3">Get Started</h2>
          <p className="text-xl text-white/80 font-medium mb-4">Ready to partner with us?</p>
          <p className="text-base text-white/70 max-w-md leading-relaxed mb-10">
            Choose the path that fits you best. Fill out the form below and our team will be in touch!
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <a
              href={AFFILIATE_FORM}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center bg-white text-cobalt-500 font-semibold px-10 py-4 rounded-lg hover:bg-slate-50 transition-colors w-full sm:w-auto text-center"
            >
              Affiliate Program
            </a>
            <a
              href={AMBASSADOR_FORM}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center border-2 border-white text-white font-semibold px-10 py-4 rounded-lg hover:bg-white/10 transition-colors w-full sm:w-auto text-center"
            >
              Ambassador Program
            </a>
          </div>
        </div>
      </section>

      {/* Section 6 — Why Affiliate */}
      <section className="bg-slate-100 px-4 sm:px-6 md:px-12 lg:px-20 py-16 md:py-24">
        <div className="max-w-5xl mx-auto flex flex-col items-center">
          <div className="text-center max-w-3xl mb-12">
            <h2 className="text-4xl font-bold text-neutral-800 mb-5">
              Why become a Marketplace Affiliate Partner?
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              When an organization becomes a Marketplace partner, they&#39;re not just adding a feature — they&#39;re adding real value for their participants while unlocking a new revenue stream for themselves.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full mb-12">
            {affiliateBenefits.map(({ icon: Icon, title, description }) => (
              <div key={title} className="bg-white rounded-xl p-8 shadow-sm flex flex-col gap-3">
                <Icon className="w-8 h-8 text-cobalt-500 shrink-0" />
                <h3 className="text-base font-semibold text-neutral-800">{title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
          {/* Demo callout */}
          <div className="bg-white rounded-xl shadow-sm px-10 py-12 flex flex-col items-center text-center max-w-3xl w-full">
            <h3 className="text-xl font-bold text-neutral-800 mb-3">Prefer to talk first?</h3>
            <p className="text-base text-slate-600 max-w-lg leading-relaxed mb-7">
              Book a live demo with the GoAbroad Marketplace team and see exactly how our partnership program works.
            </p>
            <a
              href={AFFILIATE_DEMO}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center bg-cobalt-500 text-white font-semibold px-8 py-3 rounded-lg hover:bg-cobalt-600 transition-colors"
            >
              Book a Demo
            </a>
          </div>
        </div>
      </section>

      {/* Section 7 — Why Ambassador */}
      <section className="bg-white px-4 sm:px-6 md:px-12 lg:px-20 py-16 md:py-24">
        <div className="max-w-5xl mx-auto flex flex-col items-center">
          <div className="text-center max-w-3xl mb-12">
            <h2 className="text-4xl font-bold text-neutral-800 mb-5">
              Why become a GoAbroad Marketplace Ambassador?
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              Join a community of travel creators who share products that genuinely help international travelers, and earn while you do it.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full mb-12">
            {ambassadorBenefits.map(({ icon: Icon, title, description }) => (
              <div key={title} className="bg-slate-100 rounded-xl p-8 shadow-sm flex flex-col gap-3">
                <Icon className="w-8 h-8 text-cobalt-500 shrink-0" />
                <h3 className="text-base font-semibold text-neutral-800">{title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
          {/* Demo callout */}
          <div className="bg-slate-100 rounded-xl px-10 py-12 flex flex-col items-center text-center max-w-3xl w-full">
            <h3 className="text-xl font-bold text-neutral-800 mb-3">Prefer to talk first?</h3>
            <p className="text-base text-slate-600 max-w-lg leading-relaxed mb-7">
              Book a live demo with the GoAbroad Marketplace team and see exactly how our partnership program works.
            </p>
            <a
              href={AMBASSADOR_DEMO}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center bg-cobalt-500 text-white font-semibold px-8 py-3 rounded-lg hover:bg-cobalt-600 transition-colors"
            >
              Book a Demo
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
