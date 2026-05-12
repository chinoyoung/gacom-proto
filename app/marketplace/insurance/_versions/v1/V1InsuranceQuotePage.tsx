"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Calendar,
  Check,
  Clock,
  Globe,
  MapPin,
  Pencil,
  X,
} from "lucide-react";
import { insurancePlans, planDetails, type PlanId } from "../../_data/plans";
import InsuranceQuoteForm from "../../_components/InsuranceQuoteForm";

interface QuotePlan {
  id: PlanId;
  totalPrice: string;
  policyMax: string;
  deductible: string;
  features: string[];
}

const quoteDetails = {
  destination: "Australia",
  departureDate: "May 16, 2026",
  returnDate: "June 16, 2026",
  coverage: "US Coverage",
  usCitizen: "No",
  duration: "32 days",
};

const sharedPremiumFeatures = [
  "Emergency Medical Evacuation",
  "Repatriation for Medical Treatment",
  "Emergency Reunion",
  "Political Evacuation & Repatriation",
  "Accidental Death & Dismemberment",
  "Teladoc Health Services (US Coverage)",
  "DialCare Telemedicine Simplified (US Coverage)",
  "Baggage Theft & Loss",
  "Dental Care",
  "Personal Liability",
  "Terrorism Benefits",
];

const quotePlans: QuotePlan[] = [
  {
    id: "premium-plus",
    totalPrice: "$121.34",
    policyMax: "$1,000,000",
    deductible: "$0",
    features: sharedPremiumFeatures,
  },
  {
    id: "premium",
    totalPrice: "$87.94",
    policyMax: "$500,000",
    deductible: "$100",
    features: sharedPremiumFeatures,
  },
  {
    id: "standard",
    totalPrice: "$54.21",
    policyMax: "$250,000",
    deductible: "$50",
    features: [
      "Emergency Medical Evacuation",
      "Repatriation for Medical Treatment",
      "Emergency Reunion",
      "Political Evacuation & Repatriation",
      "Accidental Death & Dismemberment",
      "Teladoc Health Services (US Coverage)",
      "DialCare Telemedicine Simplified (US Coverage)",
      "Baggage Theft & Loss",
    ],
  },
  {
    id: "saver",
    totalPrice: "$32.18",
    policyMax: "$100,000",
    deductible: "$100",
    features: [
      "Emergency Medical Evacuation",
      "Repatriation for Medical Treatment",
      "Emergency Reunion",
      "Political Evacuation & Repatriation",
      "Accidental Death & Dismemberment",
      "Teladoc Health Services (US Coverage)",
    ],
  },
];

const tierBadgeClass: Record<PlanId, string> = {
  "premium-plus": "bg-roman-500 text-white",
  premium: "bg-sun-500 text-white",
  standard: "bg-cobalt-500 text-white",
  saver: "bg-slate-400 text-white",
};

export default function V1InsuranceQuotePage() {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [detailsPlanId, setDetailsPlanId] = useState<PlanId | null>(null);
  const anyModalOpen = isEditOpen || detailsPlanId !== null;

  useEffect(() => {
    if (!anyModalOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setIsEditOpen(false);
        setDetailsPlanId(null);
      }
    }
    document.addEventListener("keydown", handleKey);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKey);
    };
  }, [anyModalOpen]);

  const detailsPlan = detailsPlanId
    ? insurancePlans.find((p) => p.id === detailsPlanId)
    : null;
  const detailsContent = detailsPlanId ? planDetails[detailsPlanId] : null;

  return (
    <main className="bg-slate-100 min-h-screen text-neutral-800">
      <section className="py-10 md:py-16 px-4 sm:px-6 md:px-12 lg:px-20">
        <div className="max-w-6xl mx-auto">
          <Link
            href="/marketplace/insurance"
            className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-800 hover:text-cobalt-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500 rounded"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            Edit Information
          </Link>

          <div className="text-center mt-10 mb-10">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Your Quote
            </h1>
            <p className="text-base text-slate-600 mt-4 max-w-xl mx-auto leading-relaxed">
              Please provide required information so we can compute your quote
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden mb-6">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px]">
              <div className="p-6 md:p-8">
                <h2 className="text-lg font-semibold text-neutral-800 mb-6">
                  Quote Details
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                  <StatRow
                    icon={<MapPin className="w-4 h-4 text-cobalt-500" aria-hidden="true" />}
                    label="Destination"
                    value={quoteDetails.destination}
                  />
                  <StatRow
                    icon={<Calendar className="w-4 h-4 text-cobalt-500" aria-hidden="true" />}
                    label="Travel Dates"
                    value={
                      <span className="inline-flex items-center gap-1.5 flex-wrap">
                        {quoteDetails.departureDate}
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                        {quoteDetails.returnDate}
                      </span>
                    }
                  />
                  <StatRow
                    icon={<Globe className="w-4 h-4 text-cobalt-500" aria-hidden="true" />}
                    label="Coverage"
                    value={quoteDetails.coverage}
                  />
                  <StatRow
                    icon={<BadgeCheck className="w-4 h-4 text-cobalt-500" aria-hidden="true" />}
                    label="US Citizen"
                    value={quoteDetails.usCitizen}
                  />
                </div>
              </div>

              <div className="bg-slate-50 border-t lg:border-t-0 lg:border-l border-slate-200 p-6 md:p-8 flex flex-col justify-center gap-5">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-cobalt-600" aria-hidden="true" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-cobalt-700">
                      Duration
                    </span>
                  </div>
                  <p className="text-3xl md:text-4xl font-bold tracking-tight text-neutral-800">
                    {quoteDetails.duration}
                  </p>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Start &amp; End dates included
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsEditOpen(true)}
                  className="inline-flex items-center justify-center gap-2 border border-slate-300 bg-white text-neutral-800 font-semibold px-4 py-2 rounded-lg hover:bg-slate-100 hover:border-slate-400 cursor-pointer transition-colors text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500"
                >
                  <Pencil className="w-3.5 h-3.5" aria-hidden="true" />
                  Edit Information
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            {quotePlans.map((quote) => {
              const plan = insurancePlans.find((p) => p.id === quote.id);
              if (!plan) return null;
              return (
                <article
                  key={quote.id}
                  className="bg-white border border-slate-200 rounded-xl overflow-hidden"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px]">
                    <div className="p-6 md:p-8">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${tierBadgeClass[quote.id]}`}
                      >
                        {plan.name}
                      </span>
                      <h3 className="text-2xl md:text-3xl font-bold tracking-tight mt-4">
                        Coverage up to {plan.coverageLimit}
                      </h3>
                      <p className="text-sm text-slate-500 mt-1">
                        Per person, per policy period
                      </p>

                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5 mt-6">
                        {quote.features.map((feature) => (
                          <li
                            key={feature}
                            className="flex items-start gap-2.5 text-sm text-neutral-800"
                          >
                            <span
                              className="w-5 h-5 rounded-full bg-fern-500/10 flex items-center justify-center shrink-0 mt-0.5"
                              aria-hidden="true"
                            >
                              <Check className="w-3.5 h-3.5 text-fern-600" strokeWidth={3} />
                            </span>
                            <span className="leading-snug">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-slate-50 border-t lg:border-t-0 lg:border-l border-slate-200 p-6 md:p-8 flex flex-col gap-4">
                      <div>
                        <p className="text-3xl md:text-4xl font-bold tracking-tight">
                          {quote.totalPrice}
                        </p>
                        <p className="text-xs text-slate-500 leading-relaxed mt-1">
                          Total for {quoteDetails.duration} per person (excluding admin fees)
                        </p>
                      </div>

                      <div className="flex flex-col gap-2">
                        <PriceRow label="Policy Maximum" value={quote.policyMax} />
                        <PriceRow label="Deductible" value={quote.deductible} />
                      </div>

                      <div className="grid grid-cols-2 gap-2 mt-auto">
                        <button
                          type="button"
                          onClick={() => setDetailsPlanId(quote.id)}
                          className="whitespace-nowrap border border-slate-300 text-neutral-800 font-semibold px-2 py-2.5 rounded-lg hover:bg-white hover:border-slate-400 cursor-pointer transition-colors text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500"
                        >
                          View Plan Details
                        </button>
                        <button
                          type="button"
                          className="whitespace-nowrap bg-cobalt-500 text-white font-semibold px-2 py-2.5 rounded-lg hover:bg-cobalt-600 cursor-pointer transition-colors text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500"
                        >
                          Select Plan
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {isEditOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Edit Information"
          className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-4 sm:p-6 bg-neutral-900/50 overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsEditOpen(false);
          }}
        >
          <div className="relative w-full max-w-lg my-8 sm:my-0 bg-white rounded-xl border border-slate-200">
            <button
              type="button"
              onClick={() => setIsEditOpen(false)}
              aria-label="Close"
              className="absolute top-2 right-2 z-10 w-9 h-9 inline-flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-neutral-800 cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
            <div className="px-6 pt-6 pb-4 text-center">
              <h2 className="text-xl md:text-2xl font-bold tracking-tight text-neutral-800">
                Update Information
              </h2>
              <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                Please provide required information so we can compute your quote
              </p>
            </div>
            <div className="px-6 pb-6">
              <InsuranceQuoteForm bare onSubmitted={() => setIsEditOpen(false)} />
            </div>
          </div>
        </div>
      )}

      {detailsPlan && detailsContent && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="plan-details-title"
          className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-4 sm:p-6 bg-neutral-900/50 overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) setDetailsPlanId(null);
          }}
        >
          <div className="relative w-full max-w-3xl my-8 sm:my-4 bg-white rounded-xl border border-slate-200 max-h-[calc(100vh-4rem)] overflow-hidden flex flex-col">
            <button
              type="button"
              onClick={() => setDetailsPlanId(null)}
              aria-label="Close"
              className="absolute top-3 right-3 z-10 w-9 h-9 inline-flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-neutral-800 cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
            <div className="px-6 md:px-8 pt-6 pb-5 border-b border-slate-200">
              <h2
                id="plan-details-title"
                className="text-2xl md:text-3xl font-bold tracking-tight text-neutral-800"
              >
                {detailsPlan.name}
              </h2>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed pr-10">
                {detailsContent.description}
              </p>
            </div>
            <div className="overflow-y-auto px-6 md:px-8 py-4">
              <dl className="divide-y divide-slate-100">
                {detailsContent.rows.map((row) => (
                  <div
                    key={row.label}
                    className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-1 sm:gap-6 py-3"
                  >
                    <dt className="text-sm font-semibold text-neutral-800 leading-snug">
                      {row.label}
                    </dt>
                    <dd className="text-sm text-cobalt-600 sm:text-right leading-snug">
                      {Array.isArray(row.value) ? (
                        <span className="flex flex-col gap-0.5">
                          {row.value.map((line, i) => (
                            <span key={i}>{line}</span>
                          ))}
                        </span>
                      ) : (
                        row.value
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function StatRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="w-8 h-8 rounded-lg bg-cobalt-500/10 flex items-center justify-center shrink-0 mt-0.5">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
          {label}
        </p>
        <p className="text-sm font-bold text-neutral-800 mt-0.5 leading-snug">
          {value}
        </p>
      </div>
    </div>
  );
}

function PriceRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border border-slate-200 bg-white rounded-lg px-4 py-2.5">
      <span className="text-sm text-slate-600">{label}</span>
      <span className="text-sm font-bold text-neutral-800">{value}</span>
    </div>
  );
}
