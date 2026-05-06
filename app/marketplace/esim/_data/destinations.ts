export interface DataPackage {
  size: string;
  price: number;
}

export interface DurationOption {
  label: string;
  multiplier: number;
}

export interface Destination {
  slug: string;
  name: string;
  flag: string;
  fromPrice: string;
  fromPriceNumeric: number;
  description: string;
  durations: DurationOption[];
  packages: DataPackage[];
}

export const DURATIONS: DurationOption[] = [
  { label: "30 Days", multiplier: 1 },
  { label: "90 Days", multiplier: 1.5 },
];

export const DEFAULT_PACKAGES: DataPackage[] = [
  { size: "1 GB", price: 4.99 },
  { size: "3 GB", price: 7.99 },
  { size: "5 GB", price: 9.99 },
  { size: "8 GB", price: 12.99 },
  { size: "20 GB", price: 19.99 },
];

export const destinations: Destination[] = [
  {
    slug: "india",
    name: "India",
    flag: "🇮🇳",
    fromPrice: "$4.99",
    fromPriceNumeric: 4.99,
    description:
      "Stay connected across India with reliable 4G/5G coverage. Works with all major Indian carriers.",
    durations: DURATIONS,
    packages: DEFAULT_PACKAGES,
  },
  {
    slug: "kenya",
    name: "Kenya",
    flag: "🇰🇪",
    fromPrice: "$5.49",
    fromPriceNumeric: 5.49,
    description:
      "Reliable mobile data across Kenya, including Nairobi, Mombasa, and safari regions on Safaricom and Airtel networks.",
    durations: DURATIONS,
    packages: DEFAULT_PACKAGES,
  },
  {
    slug: "japan",
    name: "Japan",
    flag: "🇯🇵",
    fromPrice: "$5.99",
    fromPriceNumeric: 5.99,
    description:
      "High-speed 5G coverage across Japan on NTT Docomo and SoftBank. Stay connected from Tokyo to Kyoto.",
    durations: DURATIONS,
    packages: DEFAULT_PACKAGES,
  },
  {
    slug: "bahrain",
    name: "Bahrain",
    flag: "🇧🇭",
    fromPrice: "$4.99",
    fromPriceNumeric: 4.99,
    description:
      "Fast 4G/5G coverage across Bahrain on Batelco and Stc Bahrain networks. Perfect for short and long stays.",
    durations: DURATIONS,
    packages: DEFAULT_PACKAGES,
  },
  {
    slug: "usa",
    name: "USA",
    flag: "🇺🇸",
    fromPrice: "$5.99",
    fromPriceNumeric: 5.99,
    description:
      "Coast-to-coast 5G coverage across the United States on T-Mobile and AT&T networks.",
    durations: DURATIONS,
    packages: DEFAULT_PACKAGES,
  },
  {
    slug: "turkey",
    name: "Turkey",
    flag: "🇹🇷",
    fromPrice: "$4.49",
    fromPriceNumeric: 4.49,
    description:
      "Reliable 4G/5G data across Turkey on Turkcell and Vodafone. Travel from Istanbul to Cappadocia connected.",
    durations: DURATIONS,
    packages: DEFAULT_PACKAGES,
  },
  {
    slug: "australia",
    name: "Australia",
    flag: "🇦🇺",
    fromPrice: "$6.49",
    fromPriceNumeric: 6.49,
    description:
      "Nationwide 4G/5G coverage across Australia on Telstra and Optus. Works in cities and along coastal routes.",
    durations: DURATIONS,
    packages: DEFAULT_PACKAGES,
  },
  {
    slug: "egypt",
    name: "Egypt",
    flag: "🇪🇬",
    fromPrice: "$4.99",
    fromPriceNumeric: 4.99,
    description:
      "Stay connected throughout Egypt on Vodafone Egypt and Orange. Coverage from Cairo to Luxor and the Red Sea.",
    durations: DURATIONS,
    packages: DEFAULT_PACKAGES,
  },
];

export function getDestinationBySlug(slug: string): Destination | undefined {
  return destinations.find((d) => d.slug === slug);
}
