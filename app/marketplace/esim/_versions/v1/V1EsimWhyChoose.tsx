"use client";

import { Zap, Globe, Wifi, Smartphone, HeadphonesIcon, ShieldCheck } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Instant Setup",
    description: "Activate your eSIM in minutes with a simple QR code scan. No waiting, no shipping.",
    accent: "cobalt",
  },
  {
    icon: Globe,
    title: "Global Coverage",
    description: "Stay connected in 200+ countries with reliable, high-speed mobile data wherever you go.",
    accent: "cobalt",
  },
  {
    icon: Wifi,
    title: "Lightning Fast",
    description: "Connect to local 4G and 5G networks the moment you land — no slow roaming speeds.",
    accent: "sun",
  },
  {
    icon: Smartphone,
    title: "Easy to Use",
    description: "Works alongside your existing SIM. Keep your number while using local data abroad.",
    accent: "cobalt",
  },
  {
    icon: HeadphonesIcon,
    title: "24/7 Support",
    description: "Our travel-savvy support team is here for you any time of day, in any time zone.",
    accent: "cobalt",
  },
  {
    icon: ShieldCheck,
    title: "Secure & Reliable",
    description: "Trusted by thousands of travelers with enterprise-grade encryption and uptime.",
    accent: "cobalt",
  },
] as const;

export default function V1EsimWhyChoose() {
  return (
    <section
      id="why-choose"
      aria-labelledby="why-choose-heading"
      className="scroll-mt-36 bg-white px-4 sm:px-6 md:px-12 lg:px-20 py-16 md:py-24"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-12 md:gap-20">
        <div className="flex-1 max-w-md">
          <p className="text-sm font-semibold uppercase tracking-widest text-cobalt-500 mb-3">
            Why GoAbroad eSIM
          </p>
          <h2
            id="why-choose-heading"
            className="text-3xl font-bold text-neutral-800 leading-tight tracking-tight mb-4"
          >
            The smartest way to stay connected when you travel
          </h2>
          <p className="text-base text-slate-600 leading-relaxed">
            Built for the way modern travelers actually move — instant activation, zero physical cards, and coverage in over 200 countries.
          </p>
        </div>
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-7">
          {features.map(({ icon: Icon, title, description, accent }) => {
            const isSun = accent === "sun";
            const iconBg = isSun ? "bg-sun-500/15" : "bg-cobalt-500/10";
            const iconColor = isSun ? "text-sun-600" : "text-cobalt-500";
            return (
              <div key={title} className="flex items-start gap-4">
                <div className={`w-10 h-10 ${iconBg} rounded-lg flex items-center justify-center shrink-0 mt-0.5`}>
                  <Icon className={`w-5 h-5 ${iconColor}`} />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-neutral-800 mb-1">{title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
