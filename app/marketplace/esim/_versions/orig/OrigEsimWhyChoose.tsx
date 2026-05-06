"use client";

import { Zap, Globe, Wifi, Smartphone, HeadphonesIcon, ShieldCheck } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Instant Setup",
    description: "Activate your eSIM in minutes with a simple QR code scan. No waiting, no shipping.",
  },
  {
    icon: Globe,
    title: "Global Coverage",
    description: "Stay connected in 200+ countries with reliable, high-speed mobile data wherever you go.",
  },
  {
    icon: Wifi,
    title: "Lightning Fast",
    description: "Connect to local 4G and 5G networks the moment you land — no slow roaming speeds.",
  },
  {
    icon: Smartphone,
    title: "Easy to Use",
    description: "Works alongside your existing SIM. Keep your number while using local data abroad.",
  },
  {
    icon: HeadphonesIcon,
    title: "24/7 Support",
    description: "Our travel-savvy support team is here for you any time of day, in any time zone.",
  },
  {
    icon: ShieldCheck,
    title: "Secure & Reliable",
    description: "Trusted by thousands of travelers with enterprise-grade encryption and uptime.",
  },
];

export default function OrigEsimWhyChoose() {
  return (
    <section className="bg-slate-50 py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-3">
            Why Choose GoAbroad eSIM
          </h2>
          <p className="text-base text-slate-600 max-w-2xl mx-auto">
            The smartest way to stay connected when you travel — built for the way modern travelers actually move.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="bg-white rounded-xl p-6 md:p-8 border border-slate-100"
              >
                <div className="inline-flex items-center justify-center w-11 h-11 bg-cobalt-50/40 text-cobalt-500 rounded-lg mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-neutral-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
