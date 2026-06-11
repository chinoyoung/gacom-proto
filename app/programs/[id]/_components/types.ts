// Shared Review type (matches shape used by V5Reviews and v6)
export type Review = {
  _id: string;
  _creationTime: number;
  reviewTitle?: string;
  reviewerName?: string;
  reviewerCountry?: string;
  body?: string;
  reviewBody?: string;
  photo?: string;
  photos?: string[];
  overallRating?: number;
  academicsRating?: number;
  livingSituationRating?: number;
  culturalImmersionRating?: number;
  programAdministrationRating?: number;
  healthAndSafetyRating?: number;
  communityRating?: number;
  /** Number of "helpful" votes. Present in Convex schema; used by v6. */
  helpfulCount?: number;
  /** Standout highlight quote surfaced by the reviewer. */
  highlight?: string;
  /** Advice the reviewer would give future participants. */
  advice?: string;
  /** Self-reported identity tags (e.g. ["First-gen", "LGBTQ+"]). */
  identityTags?: string[];
  /** URLs of reviewer-uploaded media. */
  media?: string[];
  /** ISO date string or human-readable date (e.g. "March 15, 2025"). Matches Convex schema `date: v.string()`. */
  date?: string;
};

// Shared Program type matching the Convex schema
export interface Program {
  _id: string;
  title: string;
  provider: string;
  hostInstitution?: string;
  status: "draft" | "published";
  city: string;
  country: string;
  terms: string[];
  duration?: string;
  educationLevels: string[];
  eligibleNationalities: string[];
  ageRequirement?: string;
  description: string;
  whatsIncluded: string[];
  subjectAreas: string[];
  highlights: string[];
  cost?: string;
  applicationDeadline?: string;
  contactEmail?: string;
  contactPhone?: string;
  applyUrl?: string;
  housingType?: string;
  languageOfInstruction?: string;
  creditsAvailable?: string;
  providerLogo?: string;
  coverImage?: string;
  photos: string[];
  updatedAt?: number;
  _creationTime: number;

  // Expanded Pricing
  startingPrice?: number;
  isFree?: boolean;
  costVariations?: { label: string; price: number }[];
  paymentTerms?: string[];
  refundPolicy?: string;
  refundPolicyUrl?: string;
  depositFee?: number;

  // Listing Details
  exclusions?: string[];
  optionalInclusions?: string[];
  programTags?: string[];
  yearFounded?: number;

  // AI Review Summary (seeded)
  aiSummary?: {
    text: string;
    generatedAt: number;
    reviewCount: number;
  };

  // Topic tags (denormalized from reviews; seeded for prototype)
  topicTags?: { label: string; count: number }[];
}
