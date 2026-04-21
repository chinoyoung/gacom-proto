"use client";

import { Smartphone, ShieldCheck, Check } from "lucide-react";
import { esimFeatures, insuranceFeatures } from "./constants";

export default function V1Products() {
  return (
    <section id="products" aria-labelledby="products-heading" className="scroll-mt-36 bg-white px-4 sm:px-6 md:px-12 lg:px-20 py-16 md:py-24">
      <div className="max-w-7xl mx-auto">
        <div className="mb-14">
          <h2 id="products-heading" className="text-3xl font-bold text-neutral-800 leading-tight tracking-tight mb-2">What You&#39;ll Offer</h2>
          <p className="text-lg font-medium text-slate-500 mb-3">Products your travelers actually need</p>
          <p className="text-base text-slate-600 leading-relaxed max-w-2xl">
            Two flagship products with real benefits and real commission potential.
          </p>
        </div>

        {/* Divider between product rows for mobile scannability */}
        <div className="flex flex-col divide-y divide-slate-100">
          {/* eSIM row */}
          <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16 pb-14">
            <div className="w-full md:w-1/2 shrink-0">
              <img
                src="https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&w=1200&q=80"
                alt="A traveler using a smartphone with a travel eSIM abroad"
                className="w-full h-56 md:h-[380px] object-cover rounded-lg"
              />
            </div>
            <div className="w-full md:w-1/2 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-cobalt-500/10 rounded-lg flex items-center justify-center shrink-0">
                  <Smartphone className="w-4.5 h-4.5 text-cobalt-500" />
                </div>
                <h3 className="text-lg font-semibold text-neutral-800">Travel eSIM</h3>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                Seamless mobile data access in 215+ countries, no physical SIM, no app required.
              </p>
              <ul className="flex flex-col gap-2 mt-1">
                {esimFeatures.map((f) => (
                  <li key={f} className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-cobalt-500 shrink-0" />
                    <span className="text-sm text-slate-700">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Insurance row */}
          <div className="flex flex-col md:flex-row-reverse items-center gap-10 md:gap-16 pt-14">
            <div className="w-full md:w-1/2 shrink-0">
              <img
                src="https://images.unsplash.com/photo-1587440871875-191322ee64b0?auto=format&fit=crop&w=1200&q=80"
                alt="Traveler reviewing a travel insurance plan on a laptop"
                className="w-full h-56 md:h-[380px] object-cover rounded-lg"
              />
            </div>
            <div className="w-full md:w-1/2 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-cobalt-500/10 rounded-lg flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4.5 h-4.5 text-cobalt-500" />
                </div>
                <h3 className="text-lg font-semibold text-neutral-800">Travel Insurance</h3>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                Peace of mind with reliable worldwide coverage and flexible plans for any trip.
              </p>
              <ul className="flex flex-col gap-2 mt-1">
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
