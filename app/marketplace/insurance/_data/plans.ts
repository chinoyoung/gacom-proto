export interface InsuranceTier {
  label: string;
  accentClass: string;
  textClass: string;
  ringClass?: string;
}

export type PlanId = "premium-plus" | "premium" | "standard" | "saver";

export interface InsurancePlan {
  id: PlanId;
  name: string;
  tagline: string;
  coverageLimit: string;
  deductible: string;
  tier: InsuranceTier;
}

export interface ComparisonRow {
  feature: string;
  caption?: string;
  boosted: PlanId[];
  excluded?: PlanId[];
}

export const insurancePlans: InsurancePlan[] = [
  {
    id: "premium-plus",
    name: "Premium +",
    tagline: "Maximum coverage for optimal security and cost saving.",
    coverageLimit: "$1,000,000",
    deductible: "$0",
    tier: {
      label: "Maximum",
      accentClass: "bg-roman-500",
      textClass: "text-roman-500",
    },
  },
  {
    id: "premium",
    name: "Premium",
    tagline: "Expanded coverage for nearly any scenario.",
    coverageLimit: "$500,000",
    deductible: "$100",
    tier: {
      label: "Most Popular",
      accentClass: "bg-sun-500",
      textClass: "text-sun-600",
      ringClass: "ring-2 ring-sun-500",
    },
  },
  {
    id: "standard",
    name: "Standard",
    tagline: "Upgraded coverage for more convenience.",
    coverageLimit: "$250,000",
    deductible: "$50",
    tier: {
      label: "Essential",
      accentClass: "bg-cobalt-500",
      textClass: "text-cobalt-500",
    },
  },
  {
    id: "saver",
    name: "Saver",
    tagline: "Basic coverage for essential health and safety.",
    coverageLimit: "$100,000",
    deductible: "$100",
    tier: {
      label: "Basic",
      accentClass: "bg-slate-300",
      textClass: "text-slate-500",
    },
  },
];

export const comparisonRows: ComparisonRow[] = [
  { feature: "100% Coinsurance", boosted: [], excluded: ["saver"] },
  { feature: "Emergency Medical Evacuation", boosted: [] },
  { feature: "Repatriation for Medical Treatment", boosted: ["premium-plus", "premium"] },
  { feature: "Emergency Reunion", boosted: ["premium-plus", "premium"] },
  { feature: "Political Evacuation & Repatriation", boosted: [] },
  { feature: "Accidental Death & Dismemberment", boosted: [] },
  { feature: "Telehealth — US", caption: "Teladoc, DialCare", boosted: [] },
  { feature: "Telehealth — Non-US", caption: "AllHealth360, Telus Health", boosted: [], excluded: ["saver"] },
  { feature: "Baggage Theft & Loss", boosted: ["premium-plus", "premium"], excluded: ["saver"] },
  { feature: "Dental Care", boosted: [], excluded: ["standard", "saver"] },
  { feature: "Personal Liability", boosted: [], excluded: ["standard", "saver"] },
  { feature: "Terrorism Benefits", boosted: [], excluded: ["standard", "saver"] },
];
