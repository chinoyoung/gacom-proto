export interface DataPackage {
  size: string;
  price: number;
}

export interface DurationOption {
  label: string;
  multiplier: number;
}

export type DestinationType = "country" | "region";

export interface Destination {
  slug: string;
  name: string;
  flag: string;
  type: DestinationType;
  coverageNote?: string;
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

export const COUNTRY_PACKAGES: DataPackage[] = [
  { size: "1 GB", price: 4.99 },
  { size: "3 GB", price: 7.99 },
  { size: "5 GB", price: 9.99 },
  { size: "8 GB", price: 12.99 },
  { size: "20 GB", price: 19.99 },
];

export const REGIONAL_PACKAGES: DataPackage[] = [
  { size: "1 GB", price: 7.99 },
  { size: "3 GB", price: 14.99 },
  { size: "5 GB", price: 19.99 },
  { size: "10 GB", price: 34.99 },
  { size: "20 GB", price: 54.99 },
];

export const GLOBAL_PACKAGES: DataPackage[] = [
  { size: "1 GB", price: 14.99 },
  { size: "3 GB", price: 24.99 },
  { size: "5 GB", price: 34.99 },
  { size: "10 GB", price: 59.99 },
  { size: "20 GB", price: 99.99 },
];

// Backwards-compat alias for any code that still imports the old name.
export const DEFAULT_PACKAGES = COUNTRY_PACKAGES;

function country(
  slug: string,
  name: string,
  flag: string,
  fromPrice: string,
  fromPriceNumeric: number,
  description: string,
): Destination {
  return {
    slug,
    name,
    flag,
    type: "country",
    fromPrice,
    fromPriceNumeric,
    description,
    durations: DURATIONS,
    packages: COUNTRY_PACKAGES,
  };
}

function region(
  slug: string,
  name: string,
  flag: string,
  coverageNote: string,
  fromPrice: string,
  fromPriceNumeric: number,
  description: string,
  packages: DataPackage[] = REGIONAL_PACKAGES,
): Destination {
  return {
    slug,
    name,
    flag,
    type: "region",
    coverageNote,
    fromPrice,
    fromPriceNumeric,
    description,
    durations: DURATIONS,
    packages,
  };
}

export const destinations: Destination[] = [
  // Regions
  region(
    "europe",
    "Europe",
    "🇪🇺",
    "35 countries",
    "$12.99",
    12.99,
    "One eSIM for travel across 35 European countries. Perfect for multi-country trips and rail journeys through the EU and beyond.",
  ),
  region(
    "balkans",
    "Balkans",
    "🏔️",
    "13 countries",
    "$11.99",
    11.99,
    "Coverage across the Balkan peninsula — Croatia, Serbia, Albania, Bosnia, Montenegro, Greece, and more.",
  ),
  region(
    "sea-oceania",
    "Southeast Asia & Oceania",
    "🌏",
    "8 countries",
    "$13.99",
    13.99,
    "Stay connected across Southeast Asia and Oceania. Ideal for backpackers and island-hoppers from Bali to Sydney.",
  ),
  region(
    "apac",
    "Asia Pacific",
    "🌏",
    "14 countries",
    "$14.99",
    14.99,
    "Single eSIM for travel across the Asia Pacific region — covering East Asia, Southeast Asia, and Oceania.",
  ),
  region(
    "caribbean",
    "Caribbean",
    "🏝️",
    "15 countries",
    "$13.99",
    13.99,
    "Island-hop the Caribbean with one eSIM. Coverage across 15 Caribbean nations and territories.",
  ),
  region(
    "north-america",
    "North America",
    "🌎",
    "3 countries",
    "$11.99",
    11.99,
    "One eSIM for the USA, Canada, and Mexico. Great for cross-border road trips across North America.",
  ),
  region(
    "latin-america",
    "Latin America",
    "🌎",
    "17 countries",
    "$14.99",
    14.99,
    "Travel across Central and South America on a single eSIM. Coverage from Mexico down to Argentina.",
  ),
  region(
    "africa",
    "Africa",
    "🌍",
    "11 countries",
    "$14.99",
    14.99,
    "Reliable mobile data across 11 African countries — covering safari destinations, North Africa, and major cities.",
  ),
  region(
    "mena",
    "Middle East & North Africa",
    "🕌",
    "10 countries",
    "$13.99",
    13.99,
    "Stay connected across the MENA region — covering the Gulf, the Levant, and North Africa with one eSIM.",
  ),
  region(
    "gcc",
    "Gulf (GCC)",
    "🕌",
    "6 countries",
    "$11.99",
    11.99,
    "Coverage across all six Gulf Cooperation Council countries — UAE, Saudi Arabia, Bahrain, Kuwait, Oman, and Qatar.",
  ),
  region(
    "global",
    "Global",
    "🌐",
    "120+ destinations",
    "$24.99",
    24.99,
    "One eSIM for the world. Coverage in 120+ countries on every continent — the ultimate plan for frequent flyers.",
    GLOBAL_PACKAGES,
  ),

  // Countries — Europe
  country("italy", "Italy", "🇮🇹", "$5.49", 5.49, "Fast 4G/5G coverage across Italy on TIM and Vodafone. Travel from Rome to the Amalfi Coast connected."),
  country("france", "France", "🇫🇷", "$5.49", 5.49, "Reliable mobile data across France on Orange and SFR. Coverage from Paris to Provence and the French Riviera."),
  country("spain", "Spain", "🇪🇸", "$5.49", 5.49, "Nationwide 4G/5G across Spain on Movistar and Vodafone. Stay connected from Barcelona to the Balearics."),
  country("germany", "Germany", "🇩🇪", "$5.99", 5.99, "High-speed 5G coverage across Germany on Deutsche Telekom and Vodafone networks."),
  country("united-kingdom", "United Kingdom", "🇬🇧", "$5.99", 5.99, "Coast-to-coast 4G/5G across the UK on EE and Three. Coverage in England, Scotland, Wales, and Northern Ireland."),
  country("portugal", "Portugal", "🇵🇹", "$5.49", 5.49, "Reliable data across Portugal on MEO and Vodafone Portugal. From Lisbon to the Algarve and the Azores."),
  country("netherlands", "Netherlands", "🇳🇱", "$5.99", 5.99, "Fast 5G coverage across the Netherlands on KPN and Vodafone. Perfect for short city breaks and longer stays."),
  country("switzerland", "Switzerland", "🇨🇭", "$6.99", 6.99, "Premium 4G/5G coverage across Switzerland on Swisscom and Sunrise. Reliable in the Alps and major cities."),
  country("greece", "Greece", "🇬🇷", "$5.49", 5.49, "Reliable 4G/5G across Greece on Cosmote and Vodafone. Stay connected from Athens to Santorini and Mykonos."),
  country("ireland", "Ireland", "🇮🇪", "$5.99", 5.99, "Fast mobile data across Ireland on Vodafone and Three. Coverage in Dublin, Galway, and along the Wild Atlantic Way."),

  // Countries — Asia
  country("japan", "Japan", "🇯🇵", "$5.99", 5.99, "High-speed 5G coverage across Japan on NTT Docomo and SoftBank. Stay connected from Tokyo to Kyoto."),
  country("south-korea", "South Korea", "🇰🇷", "$5.99", 5.99, "Lightning-fast 5G across South Korea on KT and SK Telecom. Built for one of the world's fastest mobile networks."),
  country("singapore", "Singapore", "🇸🇬", "$5.49", 5.49, "Fast 4G/5G across Singapore on Singtel and StarHub. Perfect for short business trips and Southeast Asia stopovers."),
  country("thailand", "Thailand", "🇹🇭", "$4.99", 4.99, "Reliable 4G/5G across Thailand on AIS and TrueMove. Coverage from Bangkok to Phuket and Chiang Mai."),
  country("vietnam", "Vietnam", "🇻🇳", "$4.99", 4.99, "Stay connected across Vietnam on Viettel and Vinaphone. From Hanoi to Ho Chi Minh City and Halong Bay."),
  country("indonesia", "Indonesia", "🇮🇩", "$5.49", 5.49, "Mobile data across Indonesia on Telkomsel and Indosat. Coverage in Bali, Jakarta, and across the archipelago."),
  country("philippines", "Philippines", "🇵🇭", "$5.49", 5.49, "Reliable 4G/5G across the Philippines on Globe and Smart. From Manila to Palawan and Cebu."),
  country("malaysia", "Malaysia", "🇲🇾", "$4.99", 4.99, "Fast mobile data across Malaysia on Maxis and Celcom. Coverage in KL, Penang, and Borneo."),
  country("china", "China", "🇨🇳", "$6.49", 6.49, "Mobile data across China on China Mobile and China Unicom. Includes Hong Kong and Macau coverage."),
  country("india", "India", "🇮🇳", "$4.99", 4.99, "Stay connected across India with reliable 4G/5G coverage. Works with all major Indian carriers."),

  // Countries — Middle East
  country("uae", "United Arab Emirates", "🇦🇪", "$5.99", 5.99, "Fast 5G across the UAE on Etisalat and du. Coverage in Dubai, Abu Dhabi, and across the Emirates."),
  country("saudi-arabia", "Saudi Arabia", "🇸🇦", "$5.99", 5.99, "Reliable 4G/5G across Saudi Arabia on STC and Mobily. From Riyadh to Jeddah and the Red Sea coast."),
  country("israel", "Israel", "🇮🇱", "$5.99", 5.99, "Fast mobile data across Israel on Cellcom and Partner. Coverage in Tel Aviv, Jerusalem, and beyond."),
  country("qatar", "Qatar", "🇶🇦", "$5.49", 5.49, "Reliable 4G/5G across Qatar on Ooredoo and Vodafone. Perfect for stopovers and longer stays in Doha."),
  country("bahrain", "Bahrain", "🇧🇭", "$4.99", 4.99, "Fast 4G/5G coverage across Bahrain on Batelco and Stc Bahrain networks. Perfect for short and long stays."),
  country("turkey", "Turkey", "🇹🇷", "$4.49", 4.49, "Reliable 4G/5G data across Turkey on Turkcell and Vodafone. Travel from Istanbul to Cappadocia connected."),

  // Countries — Americas
  country("usa", "United States", "🇺🇸", "$5.99", 5.99, "Coast-to-coast 5G coverage across the United States on T-Mobile and AT&T networks."),
  country("canada", "Canada", "🇨🇦", "$5.99", 5.99, "Nationwide 4G/5G across Canada on Bell and Rogers. Coverage from Toronto to Vancouver and the Rockies."),
  country("mexico", "Mexico", "🇲🇽", "$4.99", 4.99, "Reliable mobile data across Mexico on Telcel and Movistar. From Mexico City to Cancún and Oaxaca."),
  country("brazil", "Brazil", "🇧🇷", "$5.49", 5.49, "Stay connected across Brazil on Vivo and Claro. Coverage in Rio, São Paulo, and along the Atlantic coast."),
  country("argentina", "Argentina", "🇦🇷", "$5.49", 5.49, "Reliable 4G/5G across Argentina on Movistar and Personal. From Buenos Aires to Patagonia."),
  country("colombia", "Colombia", "🇨🇴", "$5.49", 5.49, "Fast mobile data across Colombia on Claro and Tigo. Coverage in Bogotá, Medellín, and Cartagena."),

  // Countries — Africa
  country("morocco", "Morocco", "🇲🇦", "$5.49", 5.49, "Reliable 4G/5G across Morocco on Maroc Telecom and Orange. From Marrakech to Casablanca and the Sahara."),
  country("egypt", "Egypt", "🇪🇬", "$4.99", 4.99, "Stay connected throughout Egypt on Vodafone Egypt and Orange. Coverage from Cairo to Luxor and the Red Sea."),
  country("south-africa", "South Africa", "🇿🇦", "$5.49", 5.49, "Reliable mobile data across South Africa on Vodacom and MTN. Coverage from Cape Town to Kruger and Johannesburg."),
  country("kenya", "Kenya", "🇰🇪", "$5.49", 5.49, "Reliable mobile data across Kenya, including Nairobi, Mombasa, and safari regions on Safaricom and Airtel networks."),
  country("nigeria", "Nigeria", "🇳🇬", "$5.49", 5.49, "Mobile data across Nigeria on MTN and Glo. Coverage in Lagos, Abuja, and across the country."),

  // Countries — Oceania
  country("australia", "Australia", "🇦🇺", "$6.49", 6.49, "Nationwide 4G/5G coverage across Australia on Telstra and Optus. Works in cities and along coastal routes."),
  country("new-zealand", "New Zealand", "🇳🇿", "$6.49", 6.49, "Fast mobile data across New Zealand on Spark and Vodafone NZ. Coverage on both islands and remote regions."),
];

const POPULAR_COUNTRY_SLUGS = [
  "japan",
  "italy",
  "france",
  "spain",
  "united-kingdom",
  "thailand",
  "usa",
  "mexico",
] as const;

export const popularDestinations: Destination[] = POPULAR_COUNTRY_SLUGS
  .map((slug) => destinations.find((d) => d.slug === slug))
  .filter((d): d is Destination => d !== undefined);

export const regionDestinations: Destination[] = destinations.filter((d) => d.type === "region");
export const countryDestinations: Destination[] = destinations.filter((d) => d.type === "country");

export function getDestinationBySlug(slug: string): Destination | undefined {
  return destinations.find((d) => d.slug === slug);
}
