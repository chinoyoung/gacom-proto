"use client";

import { Smartphone, ShieldCheck, Check } from "lucide-react";
import { esimFeatures, insuranceFeatures } from "../v1/constants";

export default function V2Products() {
  return (
    <section
      id="products"
      aria-labelledby="products-heading"
      className="scroll-mt-36 bg-white px-4 sm:px-6 md:px-12 lg:px-20 py-16 md:py-24"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2
            id="products-heading"
            className="text-3xl font-bold text-neutral-800 leading-tight tracking-tight mb-2"
          >
            What You&#39;ll Offer
          </h2>
          <p className="text-base text-slate-500 leading-relaxed">
            Two flagship products with real benefits and real commission potential.
          </p>
        </div>

        <div className="flex flex-col gap-10">
          {/* eSIM product */}
          <div className="bg-slate-50 rounded-lg border border-slate-100 overflow-hidden flex flex-col md:flex-row">
            <div className="md:w-2/5 shrink-0">
              <img
                src="/illustrations/mobile-data.svg"
                alt="Illustration of a traveler using mobile data abroad"
                className="w-full h-56 md:h-72 object-contain p-6"
              />
            </div>
            <div className="flex-1 p-8 md:p-10 flex flex-col gap-5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-cobalt-500/10 rounded-lg flex items-center justify-center shrink-0">
                  <Smartphone className="w-4.5 h-4.5 text-cobalt-500" />
                </div>
                <h3 className="text-xl font-semibold text-neutral-800">Travel eSIM</h3>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                Seamless mobile data access in 215+ countries, no physical SIM, no app required.
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {esimFeatures.map((f) => (
                  <li key={f} className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-cobalt-500 shrink-0" />
                    <span className="text-sm text-slate-700">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Insurance product */}
          <div className="bg-slate-50 rounded-lg border border-slate-100 overflow-hidden flex flex-col md:flex-row-reverse">
            <div className="md:w-2/5 shrink-0">
              <img
                src="/illustrations/security.svg"
                alt="Illustration of travel insurance protection"
                className="w-full h-56 md:h-72 object-contain p-6"
              />
            </div>
            <div className="flex-1 p-8 md:p-10 flex flex-col gap-5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-cobalt-500/10 rounded-lg flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4.5 h-4.5 text-cobalt-500" />
                </div>
                <h3 className="text-xl font-semibold text-neutral-800">Travel Insurance</h3>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                Peace of mind with reliable worldwide coverage and flexible plans for any trip.
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {insuranceFeatures.map((f) => (
                  <li key={f} className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-cobalt-500 shrink-0" />
                    <span className="text-sm text-slate-700">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
