"use client";

import { DollarSign, ExternalLink } from "lucide-react";
import type { Program } from "../../_components/types";

function formatPrice(price: number): string {
  return "$" + price.toLocaleString("en-US");
}

const PLACEHOLDER_COST_VARIATIONS = [
  { label: "2 Weeks", price: 2500 },
  { label: "4 Weeks", price: 4800 },
];

const PLACEHOLDER_PAYMENT_TERMS = [
  "Payment Plan",
  "Scholarships",
  "Upfront Deposit",
];

export function PricingSection({ program }: { program: Program }) {
  const hasStartingPrice = program.startingPrice != null;
  const hasCostVariations =
    program.costVariations != null && program.costVariations.length > 0;
  const hasPaymentTerms =
    program.paymentTerms != null && program.paymentTerms.length > 0;
  const hasRefundPolicy = !!program.refundPolicy;
  const hasDepositFee = program.depositFee != null;

  // Starting price display
  let priceDisplay: React.ReactNode;
  let priceSubtitle: React.ReactNode = null;

  if (program.isFree) {
    priceDisplay = <span className="text-fern-500">Free</span>;
    priceSubtitle = (
      <p className="text-sm text-fern-500 mt-1">No Upfront Fees</p>
    );
  } else if (hasStartingPrice) {
    priceDisplay = formatPrice(program.startingPrice!);
  } else {
    priceDisplay = (
      <>
        $2,500{" "}
        <span className="text-base font-normal text-slate-400">
          (placeholder)
        </span>
      </>
    );
  }

  return (
    <section className="px-4 xl:px-0 py-4">
      <div className="bg-slate-50 border border-gray-200 rounded-md p-4 md:p-6 flex flex-col gap-6">
        {/* Section header */}
        <div className="flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-cobalt-500 shrink-0" />
          <h2 className="text-xl font-bold">Pricing & Fees</h2>
        </div>

        {/* Starting price */}
        <div className="flex flex-col gap-1 pb-6 border-b border-gray-200">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Starting Price
          </p>
          <p className="text-3xl font-bold">{priceDisplay}</p>
          {priceSubtitle}
        </div>

        {/* Cost variations */}
        <div className="flex flex-col gap-3 pb-6 border-b border-gray-200">
          <p className="text-sm font-semibold text-slate-700">
            Cost Variations
          </p>
          <div className="flex flex-col divide-y divide-gray-200">
            {(hasCostVariations
              ? program.costVariations!
              : PLACEHOLDER_COST_VARIATIONS
            ).map((variation, i) => (
              <div
                key={i}
                className={`flex items-center justify-between py-2.5 text-sm ${
                  !hasCostVariations ? "text-slate-400" : "text-neutral-700"
                }`}
              >
                <span>
                  {variation.label}
                  {!hasCostVariations && (
                    <span className="ml-1.5 text-xs text-slate-400">
                      (placeholder)
                    </span>
                  )}
                </span>
                <span className="font-medium tabular-nums">
                  {formatPrice(variation.price)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Payment terms */}
        <div className="flex flex-col gap-3 pb-6 border-b border-gray-200">
          <p className="text-sm font-semibold text-slate-700">Payment Terms</p>
          <div className="flex flex-wrap gap-2">
            {(hasPaymentTerms
              ? program.paymentTerms!
              : PLACEHOLDER_PAYMENT_TERMS
            ).map((term, i) => (
              <span
                key={i}
                className={`text-xs px-2.5 py-1 rounded border ${
                  hasPaymentTerms
                    ? "bg-white border-gray-200 text-neutral-700"
                    : "bg-white border-gray-200 text-slate-400"
                }`}
              >
                {term}
                {!hasPaymentTerms && (
                  <span className="ml-1 text-slate-400">(placeholder)</span>
                )}
              </span>
            ))}
          </div>
        </div>

        {/* Deposit / application fee */}
        <div className="flex flex-col gap-1 pb-6 border-b border-gray-200">
          <p className="text-sm font-semibold text-slate-700">
            Application Fee
          </p>
          {hasDepositFee ? (
            <p className="text-sm text-neutral-700">
              {formatPrice(program.depositFee!)} Application Fee
            </p>
          ) : (
            <p className="text-sm text-slate-400">
              $250 Application Fee{" "}
              <span className="text-xs">(placeholder)</span>
            </p>
          )}
        </div>

        {/* Refund policy */}
        <div className="flex flex-col gap-1">
          <p className="text-sm font-semibold text-slate-700">Refund Policy</p>
          {hasRefundPolicy ? (
            <div className="flex flex-col gap-1">
              <p className="text-sm text-neutral-700 leading-relaxed">
                {program.refundPolicy}
              </p>
              {program.refundPolicyUrl && (
                <a
                  href={program.refundPolicyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-cobalt-500 font-medium mt-1"
                >
                  View full policy
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          ) : (
            <p className="text-sm text-slate-400">
              Full refund up to 30 days before start date{" "}
              <span className="text-xs">(placeholder)</span>
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
