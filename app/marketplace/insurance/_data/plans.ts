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

export interface PlanDetailRow {
  label: string;
  value: string | string[];
}

export interface PlanDetails {
  description: string;
  rows: PlanDetailRow[];
}

const sharedDescription =
  "For all clients, we review existing claims data (if available for new clients) and current policy details to explain where claims are occurring and suggest plan modifications to better support your participants.";

export const planDetails: Record<PlanId, PlanDetails> = {
  "premium-plus": {
    description: sharedDescription,
    rows: [
      { label: "Deductible", value: "$0" },
      { label: "Coverage Limit", value: "$1,000,000" },
      { label: "Coinsurance", value: "100% Coinsurance" },
      { label: "Urgent Care Visit Copayment", value: "$25" },
      { label: "Walk in Clinic Visit Copayment", value: "$10" },
      {
        label: "Emergency Room Visit",
        value: ["Injury: $0 deductible", "Illness: $250 deductible, waived if admitted"],
      },
      { label: "Hospitalization Room & Board + Intensive Care", value: "100%" },
      { label: "Emergency Medical Evacuation", value: "$100,000" },
      { label: "Repatriation for Medical Treatment", value: "$50,000" },
      { label: "Emergency Reunion", value: "$30,000" },
      { label: "Terrorism Benefits", value: "$50,000 Maximum Limit" },
      { label: "Political Evacuation & Repatriation", value: "$10,000" },
      { label: "Return of Mortal Remains", value: "$50,000" },
      { label: "Accidental Death & Dismemberment", value: "$25,000" },
      {
        label: "Dental Care",
        value: [
          "Period of Coverage Limit: $350 (Treatment due to Unexpected pain to sound, natural teeth)",
          "Period of Coverage Limit per Injury: $500 (Non-emergency Treatment by a Dental Provider due to an Accident)",
        ],
      },
      { label: "Teladoc Health Services", value: "Included" },
      { label: "DialCare Telemedicine Simplified", value: "Included" },
      {
        label: "Baggage Theft & Loss",
        value: ["$1,500 Maximum Limit", "$250 per item limit"],
      },
      {
        label: "Personal Liability",
        value: [
          "Combined Maximum Limit: $25,000",
          "Injury to third person:",
          "• Per Injury Deductible: $100",
          "Damage to third person's property:",
          "• Per damage Deductible: $100",
        ],
      },
    ],
  },
  premium: {
    description: sharedDescription,
    rows: [
      { label: "Deductible", value: "$100" },
      { label: "Coverage Limit", value: "$500,000" },
      { label: "Coinsurance", value: "100% Coinsurance" },
      { label: "Urgent Care Visit Copayment", value: "$25" },
      { label: "Walk in Clinic Visit Copayment", value: "$10" },
      {
        label: "Emergency Room Visit",
        value: ["Injury: $0 deductible", "Illness: $250 deductible, waived if admitted"],
      },
      { label: "Hospitalization Room & Board + Intensive Care", value: "100%" },
      { label: "Emergency Medical Evacuation", value: "$50,000" },
      { label: "Repatriation for Medical Treatment", value: "$25,000" },
      { label: "Emergency Reunion", value: "$15,000" },
      { label: "Terrorism Benefits", value: "$25,000 Maximum Limit" },
      { label: "Political Evacuation & Repatriation", value: "$10,000" },
      { label: "Return of Mortal Remains", value: "$25,000" },
      { label: "Accidental Death & Dismemberment", value: "$15,000" },
      {
        label: "Dental Care",
        value: [
          "Period of Coverage Limit: $350 (Treatment due to Unexpected pain to sound, natural teeth)",
          "Period of Coverage Limit per Injury: $500 (Non-emergency Treatment by a Dental Provider due to an Accident)",
        ],
      },
      { label: "Teladoc Health Services", value: "Included" },
      { label: "DialCare Telemedicine Simplified", value: "Included" },
      {
        label: "Baggage Theft & Loss",
        value: ["$1,000 Maximum Limit", "$250 per item limit"],
      },
      {
        label: "Personal Liability",
        value: [
          "Combined Maximum Limit: $25,000",
          "Injury to third person:",
          "• Per Injury Deductible: $100",
          "Damage to third person's property:",
          "• Per damage Deductible: $100",
        ],
      },
    ],
  },
  standard: {
    description: sharedDescription,
    rows: [
      { label: "Deductible", value: "$50" },
      { label: "Coverage Limit", value: "$250,000" },
      { label: "Coinsurance", value: "100% Coinsurance" },
      { label: "Urgent Care Visit Copayment", value: "$50" },
      { label: "Walk in Clinic Visit Copayment", value: "$25" },
      {
        label: "Emergency Room Visit",
        value: ["Injury: $50 deductible", "Illness: $250 deductible, waived if admitted"],
      },
      { label: "Hospitalization Room & Board + Intensive Care", value: "100%" },
      { label: "Emergency Medical Evacuation", value: "$25,000" },
      { label: "Repatriation for Medical Treatment", value: "$10,000" },
      { label: "Emergency Reunion", value: "$5,000" },
      { label: "Terrorism Benefits", value: "Not included" },
      { label: "Political Evacuation & Repatriation", value: "$10,000" },
      { label: "Return of Mortal Remains", value: "$15,000" },
      { label: "Accidental Death & Dismemberment", value: "$10,000" },
      { label: "Dental Care", value: "Not included" },
      { label: "Teladoc Health Services", value: "Included" },
      { label: "DialCare Telemedicine Simplified", value: "Included" },
      {
        label: "Baggage Theft & Loss",
        value: ["$500 Maximum Limit", "$100 per item limit"],
      },
      { label: "Personal Liability", value: "Not included" },
    ],
  },
  saver: {
    description: sharedDescription,
    rows: [
      { label: "Deductible", value: "$100" },
      { label: "Coverage Limit", value: "$100,000" },
      { label: "Coinsurance", value: "80% Coinsurance" },
      { label: "Urgent Care Visit Copayment", value: "$50" },
      { label: "Walk in Clinic Visit Copayment", value: "$25" },
      {
        label: "Emergency Room Visit",
        value: ["Injury: $100 deductible", "Illness: $250 deductible, waived if admitted"],
      },
      { label: "Hospitalization Room & Board + Intensive Care", value: "100%" },
      { label: "Emergency Medical Evacuation", value: "$10,000" },
      { label: "Repatriation for Medical Treatment", value: "$5,000" },
      { label: "Emergency Reunion", value: "$5,000" },
      { label: "Terrorism Benefits", value: "Not included" },
      { label: "Political Evacuation & Repatriation", value: "$10,000" },
      { label: "Return of Mortal Remains", value: "$10,000" },
      { label: "Accidental Death & Dismemberment", value: "$5,000" },
      { label: "Dental Care", value: "Not included" },
      { label: "Teladoc Health Services", value: "Included" },
      { label: "DialCare Telemedicine Simplified", value: "Included" },
      { label: "Baggage Theft & Loss", value: "Not included" },
      { label: "Personal Liability", value: "Not included" },
    ],
  },
};

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
