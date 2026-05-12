"use client";

import Link from "next/link";
import { Check, X } from "lucide-react";
import { insurancePlans, comparisonRows } from "../../_data/plans";

export default function V1InsurancePlans() {
  return (
    <section
      id="plans"
      aria-labelledby="plans-heading"
      className="scroll-mt-36 bg-cobalt-500 py-16 md:py-24"
    >
      <div className="max-w-7xl mx-auto px-6 flex flex-col items-center text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-white/50 mb-3">
          Insurance Plans
        </p>
        <h2
          id="plans-heading"
          className="text-3xl font-bold text-white leading-tight tracking-tight mb-4"
        >
          GoAbroad Insurance Plans &amp; Inclusions
        </h2>
        <p className="text-sm text-white/60 max-w-2xl leading-relaxed mb-12">
          Our dependable travel insurance plans will provide you with affordable, comprehensive support to give you confidence traveling to over 215+ countries and regions worldwide.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full text-left items-start">
          {insurancePlans.map((plan) => (
            <div
              key={plan.id}
              className={`bg-white rounded-xl border border-slate-200 p-6 overflow-hidden ${plan.tier.ringClass ?? ""}`}
            >
              <div className={`h-3 -mx-6 -mt-6 mb-5 ${plan.tier.accentClass}`} />
              <p className={`text-[11px] font-semibold uppercase tracking-widest mb-1.5 ${plan.tier.textClass}`}>
                {plan.tier.label}
              </p>
              <h3 className="text-lg font-semibold text-neutral-800">
                {plan.name}
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed mt-1">
                {plan.tagline}
              </p>

              <div className="border-t border-slate-200 my-5" />

              <div className="flex flex-col gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Coverage Limit
                  </p>
                  <p className={`text-2xl font-bold ${plan.tier.textClass}`}>
                    {plan.coverageLimit}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Deductible
                  </p>
                  <p className="text-xl font-bold text-neutral-800">
                    {plan.deductible}
                  </p>
                </div>
              </div>

              <div className="border-t border-slate-200 my-5" />

              <Link
                href="#hero"
                className="w-full inline-flex items-center justify-center bg-cobalt-500 text-white font-semibold px-7 py-3 rounded-lg hover:bg-cobalt-600 transition-colors text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500"
              >
                Get a quote
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-white rounded-xl border border-slate-200 overflow-x-auto w-full">
          <table className="w-full text-left min-w-2xl table-fixed">
            <thead>
              <tr className="border-b border-slate-200">
                <th
                  scope="col"
                  className="text-xs font-semibold uppercase tracking-wider text-slate-500 py-4 px-4 w-1/4"
                >
                  What&apos;s included
                </th>
                {insurancePlans.map((plan) => (
                  <th
                    key={plan.id}
                    scope="col"
                    className="py-4 px-4 text-center"
                  >
                    <span className={`block text-[11px] font-semibold uppercase tracking-widest ${plan.tier.textClass}`}>
                      {plan.tier.label}
                    </span>
                    <span className="block text-sm font-semibold text-neutral-800">
                      {plan.name}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row, rowIndex) => (
                <tr
                  key={row.feature}
                  className={rowIndex < comparisonRows.length - 1 ? "border-b border-slate-100" : ""}
                >
                  <td className="py-3 px-4 sticky left-0 bg-white">
                    <span className="text-sm text-neutral-800 leading-snug">
                      {row.feature}
                    </span>
                    {row.caption && (
                      <span className="block text-[11px] text-slate-500 leading-snug mt-0.5">
                        {row.caption}
                      </span>
                    )}
                  </td>
                  {insurancePlans.map((plan) => {
                    if (row.excluded?.includes(plan.id)) {
                      return (
                        <td key={plan.id} className="py-3 px-4 text-center">
                          <X
                            className="w-4 h-4 text-roman-500 inline-block"
                            aria-hidden="true"
                          />
                          <span className="sr-only">Not included</span>
                        </td>
                      );
                    }
                    if (row.boosted.includes(plan.id)) {
                      return (
                        <td key={plan.id} className="py-3 px-4 text-center">
                          <span
                            className="inline-block px-1.5 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider bg-fern-500/15 text-fern-700"
                            aria-hidden="true"
                          >
                            2x
                          </span>
                          <span className="sr-only">Included, 2x the coverage limit</span>
                        </td>
                      );
                    }
                    return (
                      <td key={plan.id} className="py-3 px-4 text-center">
                        <Check
                          className="w-4 h-4 text-fern-600 inline-block"
                          aria-hidden="true"
                        />
                        <span className="sr-only">Included</span>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
