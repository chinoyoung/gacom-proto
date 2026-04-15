"use client";

import { ArrowRight } from "lucide-react";
import type { Program } from "../../_components/types";

interface PricingBarProps {
  program: Program;
}

interface PriceDetail {
  label: string;
  value: string;
}

const PRICE_DETAILS: PriceDetail[] = [
  { label: "Tuition", value: "From $8,500" },
  { label: "Housing", value: "From $1,200" },
  { label: "Insurance", value: "Included" },
];

export default function PricingBar({ program }: PricingBarProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6">
      <div className="bg-cobalt-500 rounded-2xl py-6 px-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        {/* Price Info */}
        <div className="flex flex-col gap-1">
          <p className="text-[12px] font-semibold text-zinc-400 tracking-widest uppercase">
            Program Tuition
          </p>
          <p className="text-[24px] font-bold text-white leading-tight">
            {program.cost
              ? `${program.cost} / semester`
              : "Contact for pricing"}
          </p>
        </div>

        {/* Price Details — hidden on mobile */}
        <div className="hidden md:flex items-start gap-8">
          {PRICE_DETAILS.map((detail) => (
            <div key={detail.label} className="flex flex-col gap-0.5">
              <span className="text-[13px] font-semibold text-white">
                {detail.label}
              </span>
              <span className="text-[13px] text-zinc-300">
                {detail.value}
              </span>
            </div>
          ))}
        </div>

        {/* Quote Button */}
        <button
          type="button"
          className="flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white text-[14px] font-semibold rounded-lg py-3 px-6 transition-colors md:shrink-0 w-full md:w-auto"
        >
          Get Custom Quote
          <ArrowRight size={16} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
