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
}
