import type { NavItem, PlacementDim } from "./types";

export const PLACEMENT_LOCATIONS: string[] = [
  "Africa",
  "Antarctica",
  "Asia",
  "Australia & Oceania",
  "Caribbean",
  "Central America",
  "Eastern Europe & Russia",
  "Middle East",
  "North America",
  "South America",
  "Western Europe",
];

export const PLACEMENT_TIMINGS: string[] = [
  "Spring",
  "Summer",
  "Fall",
  "Winter",
  "Short Term",
  "1-3 Months",
  "3-6 Months",
  "6-12 Months",
  "1 Year",
  "Academic Year",
];

export const PLACEMENT_TYPES: string[] = [
  "Architecture",
  "Au Pair",
  "Art",
  "Biology",
  "Business",
  "Chemistry",
  "Economics",
  "Education",
  "Engineering",
  "Environmental Science",
  "History",
  "Journalism",
  "Language",
  "Law",
  "Marketing",
  "Music",
  "Nursing",
  "Physics",
  "Political Science",
  "Psychology",
];

export const PLACEMENT_OPTIONS: Record<PlacementDim, string[]> = {
  location: PLACEMENT_LOCATIONS,
  timing: PLACEMENT_TIMINGS,
  type: PLACEMENT_TYPES,
};

export const PLACEMENT_DIM_LABELS: Record<PlacementDim, string> = {
  location: "Location",
  timing: "Timing",
  type: "Type",
};

export const PROGRAMS: string[] = [
  "6019 - Internships in Spain - Adelante Abroad",
  "7315 - Law Internships in Madrid, Spain",
  "8193 - Semester Study Abroad in Seville, Spain - Adelante Abroad",
  "8194 - Internships in Madrid, Spain",
  "13158 - Volunteer in Oaxaca, Mexico - Adelante Abroad",
];

export const DEFAULT_AD_PRICE = 400;
export const TAX_RATE = 0.08;

export const PROGRAM_NAME = "Volunteer for the Visayans";
export const PROFILE_COMPLETION = 58;
export const PREVIEW_URL = "https://beta.goabroad.com/intern-abroad/";

export const AD_PREVIEW_PROVIDER = "GoEco - Top Volunteer Organization";
export const AD_PREVIEW_DEFAULT_TITLE = "Wildlife Conservation in South Africa";
export const AD_PREVIEW_RATING = 4.8;
export const AD_PREVIEW_REVIEWS = 3206;
export const AD_PREVIEW_DEFAULT_DESCRIPTION =
  "Hands-on conservation work with rescued wildlife, all-inclusive housing and meals.";

export const NAV_ITEMS: NavItem[] = [
  { key: "verified", label: "Verified" },
  { key: "dashboard", label: "Dashboard" },
  { key: "contacts", label: "Contacts" },
  { key: "image", label: "Create Ad" },
  { key: "quotes", label: "Quotes" },
  { key: "articles", label: "Articles" },
  { key: "gift", label: "Promotions" },
  { key: "billing", label: "Billing" },
  { key: "messages", label: "Messages" },
];
