export interface ProviderSocialLink {
  platform: string;
  url: string;
}

export interface ProviderAward {
  name: string;
  result: string;
  year?: string;
}

export interface ProviderFaq {
  question: string;
  answer: string;
}

export interface Provider {
  _id: string;
  _creationTime: number;
  name: string;
  slug: string;
  logo?: string;
  coverImage?: string;
  tagline?: string;
  about?: string;
  whyChoosePoints: string[];
  headquarters?: string;
  yearFounded?: number;
  website?: string;
  socialLinks: ProviderSocialLink[];
  photos: string[];
  awards: ProviderAward[];
  faqs: ProviderFaq[];
  status: "draft" | "published";
}

// A published review annotated with the program it belongs to.
export interface ProviderReview {
  _id: string;
  _creationTime: number;
  reviewerName?: string;
  reviewerCountry?: string;
  reviewTitle?: string;
  body?: string;
  overallRating?: number;
  programTitle?: string;
  programSlug?: string;
}

// Minimal program shape needed by the programs grid (compatible with ProgramCard).
export interface ProviderProgram {
  _id: string;
  title: string;
  provider: string;
  city: string;
  country: string;
  terms: string[];
  coverImage?: string;
  cost?: string;
  subjectAreas: string[];
  slug?: string;
}
