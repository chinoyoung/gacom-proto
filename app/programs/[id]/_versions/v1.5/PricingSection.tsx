"use client";

import { DollarSign, ExternalLink } from "lucide-react";
import type { Program } from "../../_components/types";

function formatPrice(price: number): string {
  return "$" + price.toLocaleString("en-US");
}

const PLACEHOLDER_COST_VARIATIONS = [
  { label: "2 Weeks", price: 2500 },
  { label: "4 Weeks", price: 4800 },
  { label: "8 Weeks", price: 8900 },
  { label: "Semester (12 Weeks)", price: 12500 },
];

const PLACEHOLDER_PAYMENT_TERMS = [
  "Payment Plan",
  "Scholarships Available",
  "Upfront Deposit",
  "Credit Card Accepted",
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
    priceDisplay = "$2,500";
  }

  return (
    <div className="flex flex-col px-4 xl:px-0 gap-4">
      <div>
        <h2 className="flex items-center text-2xl font-bold gap-2">
          <DollarSign className="w-6 h-6 text-cobalt-500" />
          Pricing & Fees
        </h2>
        <p className="text-sm text-neutral-500 mt-1">
          Everything you need to know about costs and payment
        </p>
      </div>

      <div className="bg-slate-50 border border-gray-200 rounded-md p-4 md:p-6 flex flex-col gap-6">
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
                className="flex items-center justify-between py-2.5 text-sm text-neutral-700"
              >
                <span>{variation.label}</span>
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
                className="text-xs px-2.5 py-1 rounded border bg-white border-gray-200 text-neutral-700"
              >
                {term}
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
            <p className="text-sm text-neutral-700">
              $250 non-refundable application fee, credited toward program cost
              upon enrollment
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
            <p className="text-sm text-neutral-700 leading-relaxed">
              Full refund available up to 60 days before the program start
              date. 50% refund between 30–60 days prior. No refunds within 30
              days of start, though credits toward future programs may apply.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
