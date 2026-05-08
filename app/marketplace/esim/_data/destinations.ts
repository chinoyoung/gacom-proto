export interface DataPackage {
  size: string;
  price: number;
}

export interface DurationOption {
  label: string;
  multiplier: number;
}

export type DestinationType = "country" | "region";

export type RegionIconKey = "globe" | "mountain" | "palm" | "landmark";

export interface CoveredCountry {
  name: string;
  /** ISO 3166-1 alpha-2 (lowercase). */
  code: string;
}

export interface Destination {
  slug: string;
  name: string;
  /** ISO 3166-1 alpha-2 (lowercase) for circle-flags, or "eu" for the EU. Undefined for regions without a flag. */
  countryCode?: string;
  /** Lucide icon key used for regions that don't have a flag. */
  regionIcon?: RegionIconKey;
  type: DestinationType;
  coverageNote?: string;
  /** For region plans: the list of countries included in the plan. */
  coveredCountries?: CoveredCountry[];
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
  { size: "50 GB", price: 34.99 },
];

export const REGIONAL_PACKAGES: DataPackage[] = [
  { size: "1 GB", price: 7.99 },
  { size: "3 GB", price: 14.99 },
  { size: "5 GB", price: 19.99 },
  { size: "10 GB", price: 34.99 },
  { size: "20 GB", price: 54.99 },
  { size: "50 GB", price: 99.99 },
];

export const GLOBAL_PACKAGES: DataPackage[] = [
  { size: "1 GB", price: 14.99 },
  { size: "3 GB", price: 24.99 },
  { size: "5 GB", price: 34.99 },
  { size: "10 GB", price: 59.99 },
  { size: "20 GB", price: 99.99 },
  { size: "50 GB", price: 179.99 },
];

// Backwards-compat alias for any code that still imports the old name.
export const DEFAULT_PACKAGES = COUNTRY_PACKAGES;

function country(
  slug: string,
  name: string,
  countryCode: string,
  fromPrice: string,
  fromPriceNumeric: number,
  description: string,
): Destination {
  return {
    slug,
    name,
    countryCode,
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
  icon: { countryCode?: string; regionIcon?: RegionIconKey },
  coverageNote: string,
  fromPrice: string,
  fromPriceNumeric: number,
  description: string,
  coveredCountries?: CoveredCountry[],
  packages: DataPackage[] = REGIONAL_PACKAGES,
): Destination {
  return {
    slug,
    name,
    countryCode: icon.countryCode,
    regionIcon: icon.regionIcon,
    type: "region",
    coverageNote,
    coveredCountries,
    fromPrice,
    fromPriceNumeric,
    description,
    durations: DURATIONS,
    packages,
  };
}

const EUROPE_COUNTRIES: CoveredCountry[] = [
  { name: "Albania", code: "al" },
  { name: "Andorra", code: "ad" },
  { name: "Austria", code: "at" },
  { name: "Belgium", code: "be" },
  { name: "Bosnia and Herzegovina", code: "ba" },
  { name: "Bulgaria", code: "bg" },
  { name: "Croatia", code: "hr" },
  { name: "Cyprus", code: "cy" },
  { name: "Czech Republic", code: "cz" },
  { name: "Denmark", code: "dk" },
  { name: "Estonia", code: "ee" },
  { name: "Finland", code: "fi" },
  { name: "France", code: "fr" },
  { name: "Germany", code: "de" },
  { name: "Greece", code: "gr" },
  { name: "Hungary", code: "hu" },
  { name: "Iceland", code: "is" },
  { name: "Ireland", code: "ie" },
  { name: "Italy", code: "it" },
  { name: "Latvia", code: "lv" },
  { name: "Liechtenstein", code: "li" },
  { name: "Lithuania", code: "lt" },
  { name: "Luxembourg", code: "lu" },
  { name: "Malta", code: "mt" },
  { name: "Netherlands", code: "nl" },
  { name: "Norway", code: "no" },
  { name: "Poland", code: "pl" },
  { name: "Portugal", code: "pt" },
  { name: "Romania", code: "ro" },
  { name: "Serbia", code: "rs" },
  { name: "Slovakia", code: "sk" },
  { name: "Slovenia", code: "si" },
  { name: "Spain", code: "es" },
  { name: "Sweden", code: "se" },
  { name: "Switzerland", code: "ch" },
  { name: "United Kingdom", code: "gb" },
];

const BALKANS_COUNTRIES: CoveredCountry[] = [
  { name: "Albania", code: "al" },
  { name: "Bosnia and Herzegovina", code: "ba" },
  { name: "Bulgaria", code: "bg" },
  { name: "Croatia", code: "hr" },
  { name: "Greece", code: "gr" },
  { name: "Kosovo", code: "xk" },
  { name: "Moldova", code: "md" },
  { name: "Montenegro", code: "me" },
  { name: "North Macedonia", code: "mk" },
  { name: "Romania", code: "ro" },
  { name: "Serbia", code: "rs" },
  { name: "Slovenia", code: "si" },
  { name: "Turkey", code: "tr" },
];

const SEA_OCEANIA_COUNTRIES: CoveredCountry[] = [
  { name: "Australia", code: "au" },
  { name: "Indonesia", code: "id" },
  { name: "Malaysia", code: "my" },
  { name: "New Zealand", code: "nz" },
  { name: "Philippines", code: "ph" },
  { name: "Singapore", code: "sg" },
  { name: "Thailand", code: "th" },
  { name: "Vietnam", code: "vn" },
];

const APAC_COUNTRIES: CoveredCountry[] = [
  { name: "Australia", code: "au" },
  { name: "China", code: "cn" },
  { name: "Hong Kong", code: "hk" },
  { name: "India", code: "in" },
  { name: "Indonesia", code: "id" },
  { name: "Japan", code: "jp" },
  { name: "Malaysia", code: "my" },
  { name: "New Zealand", code: "nz" },
  { name: "Philippines", code: "ph" },
  { name: "Singapore", code: "sg" },
  { name: "South Korea", code: "kr" },
  { name: "Taiwan", code: "tw" },
  { name: "Thailand", code: "th" },
  { name: "Vietnam", code: "vn" },
];

const CARIBBEAN_COUNTRIES: CoveredCountry[] = [
  { name: "Antigua and Barbuda", code: "ag" },
  { name: "Aruba", code: "aw" },
  { name: "Bahamas", code: "bs" },
  { name: "Barbados", code: "bb" },
  { name: "British Virgin Islands", code: "vg" },
  { name: "Cayman Islands", code: "ky" },
  { name: "Cuba", code: "cu" },
  { name: "Curaçao", code: "cw" },
  { name: "Dominica", code: "dm" },
  { name: "Dominican Republic", code: "do" },
  { name: "Grenada", code: "gd" },
  { name: "Haiti", code: "ht" },
  { name: "Jamaica", code: "jm" },
  { name: "Saint Lucia", code: "lc" },
  { name: "Trinidad and Tobago", code: "tt" },
];

const NORTH_AMERICA_COUNTRIES: CoveredCountry[] = [
  { name: "Canada", code: "ca" },
  { name: "Mexico", code: "mx" },
  { name: "United States", code: "us" },
];

const LATIN_AMERICA_COUNTRIES: CoveredCountry[] = [
  { name: "Argentina", code: "ar" },
  { name: "Bolivia", code: "bo" },
  { name: "Brazil", code: "br" },
  { name: "Chile", code: "cl" },
  { name: "Colombia", code: "co" },
  { name: "Costa Rica", code: "cr" },
  { name: "Ecuador", code: "ec" },
  { name: "El Salvador", code: "sv" },
  { name: "Guatemala", code: "gt" },
  { name: "Honduras", code: "hn" },
  { name: "Mexico", code: "mx" },
  { name: "Nicaragua", code: "ni" },
  { name: "Panama", code: "pa" },
  { name: "Paraguay", code: "py" },
  { name: "Peru", code: "pe" },
  { name: "Uruguay", code: "uy" },
  { name: "Venezuela", code: "ve" },
];

const AFRICA_COUNTRIES: CoveredCountry[] = [
  { name: "Egypt", code: "eg" },
  { name: "Ghana", code: "gh" },
  { name: "Kenya", code: "ke" },
  { name: "Morocco", code: "ma" },
  { name: "Nigeria", code: "ng" },
  { name: "Senegal", code: "sn" },
  { name: "South Africa", code: "za" },
  { name: "Tanzania", code: "tz" },
  { name: "Tunisia", code: "tn" },
  { name: "Uganda", code: "ug" },
  { name: "Zambia", code: "zm" },
];

const MENA_COUNTRIES: CoveredCountry[] = [
  { name: "Bahrain", code: "bh" },
  { name: "Egypt", code: "eg" },
  { name: "Israel", code: "il" },
  { name: "Jordan", code: "jo" },
  { name: "Kuwait", code: "kw" },
  { name: "Morocco", code: "ma" },
  { name: "Oman", code: "om" },
  { name: "Qatar", code: "qa" },
  { name: "Saudi Arabia", code: "sa" },
  { name: "United Arab Emirates", code: "ae" },
];

const GCC_COUNTRIES: CoveredCountry[] = [
  { name: "Bahrain", code: "bh" },
  { name: "Kuwait", code: "kw" },
  { name: "Oman", code: "om" },
  { name: "Qatar", code: "qa" },
  { name: "Saudi Arabia", code: "sa" },
  { name: "United Arab Emirates", code: "ae" },
];

export const destinations: Destination[] = [
  // Regions
  region(
    "europe",
    "Europe",
    { countryCode: "eu" },
    "36 countries",
    "$12.99",
    12.99,
    "One eSIM for travel across 36 European countries. Perfect for multi-country trips and rail journeys through the EU and beyond.",
    EUROPE_COUNTRIES,
  ),
  region(
    "balkans",
    "Balkans",
    { regionIcon: "mountain" },
    "13 countries",
    "$11.99",
    11.99,
    "Coverage across the Balkan peninsula — Croatia, Serbia, Albania, Bosnia, Montenegro, Greece, and more.",
    BALKANS_COUNTRIES,
  ),
  region(
    "sea-oceania",
    "Southeast Asia & Oceania",
    { regionIcon: "globe" },
    "8 countries",
    "$13.99",
    13.99,
    "Stay connected across Southeast Asia and Oceania. Ideal for backpackers and island-hoppers from Bali to Sydney.",
    SEA_OCEANIA_COUNTRIES,
  ),
  region(
    "apac",
    "Asia Pacific",
    { regionIcon: "globe" },
    "14 countries",
    "$14.99",
    14.99,
    "Single eSIM for travel across the Asia Pacific region — covering East Asia, Southeast Asia, and Oceania.",
    APAC_COUNTRIES,
  ),
  region(
    "caribbean",
    "Caribbean",
    { regionIcon: "palm" },
    "15 countries",
    "$13.99",
    13.99,
    "Island-hop the Caribbean with one eSIM. Coverage across 15 Caribbean nations and territories.",
    CARIBBEAN_COUNTRIES,
  ),
  region(
    "north-america",
    "North America",
    { regionIcon: "globe" },
    "3 countries",
    "$11.99",
    11.99,
    "One eSIM for the USA, Canada, and Mexico. Great for cross-border road trips across North America.",
    NORTH_AMERICA_COUNTRIES,
  ),
  region(
    "latin-america",
    "Latin America",
    { regionIcon: "globe" },
    "17 countries",
    "$14.99",
    14.99,
    "Travel across Central and South America on a single eSIM. Coverage from Mexico down to Argentina.",
    LATIN_AMERICA_COUNTRIES,
  ),
  region(
    "africa",
    "Africa",
    { regionIcon: "globe" },
    "11 countries",
    "$14.99",
    14.99,
    "Reliable mobile data across 11 African countries — covering safari destinations, North Africa, and major cities.",
    AFRICA_COUNTRIES,
  ),
  region(
    "mena",
    "Middle East & North Africa",
    { regionIcon: "landmark" },
    "10 countries",
    "$13.99",
    13.99,
    "Stay connected across the MENA region — covering the Gulf, the Levant, and North Africa with one eSIM.",
    MENA_COUNTRIES,
  ),
  region(
    "gcc",
    "Gulf (GCC)",
    { regionIcon: "landmark" },
    "6 countries",
    "$11.99",
    11.99,
    "Coverage across all six Gulf Cooperation Council countries — UAE, Saudi Arabia, Bahrain, Kuwait, Oman, and Qatar.",
    GCC_COUNTRIES,
  ),
  region(
    "global",
    "Global",
    { regionIcon: "globe" },
    "120+ destinations",
    "$24.99",
    24.99,
    "One eSIM for the world. Coverage in 120+ countries on every continent — the ultimate plan for frequent flyers.",
    undefined,
    GLOBAL_PACKAGES,
  ),

  // Countries — Europe
  country("italy", "Italy", "it", "$5.49", 5.49, "Fast 4G/5G coverage across Italy on TIM and Vodafone. Travel from Rome to the Amalfi Coast connected."),
  country("france", "France", "fr", "$5.49", 5.49, "Reliable mobile data across France on Orange and SFR. Coverage from Paris to Provence and the French Riviera."),
  country("spain", "Spain", "es", "$5.49", 5.49, "Nationwide 4G/5G across Spain on Movistar and Vodafone. Stay connected from Barcelona to the Balearics."),
  country("germany", "Germany", "de", "$5.99", 5.99, "High-speed 5G coverage across Germany on Deutsche Telekom and Vodafone networks."),
  country("united-kingdom", "United Kingdom", "gb", "$5.99", 5.99, "Coast-to-coast 4G/5G across the UK on EE and Three. Coverage in England, Scotland, Wales, and Northern Ireland."),
  country("portugal", "Portugal", "pt", "$5.49", 5.49, "Reliable data across Portugal on MEO and Vodafone Portugal. From Lisbon to the Algarve and the Azores."),
  country("netherlands", "Netherlands", "nl", "$5.99", 5.99, "Fast 5G coverage across the Netherlands on KPN and Vodafone. Perfect for short city breaks and longer stays."),
  country("switzerland", "Switzerland", "ch", "$6.99", 6.99, "Premium 4G/5G coverage across Switzerland on Swisscom and Sunrise. Reliable in the Alps and major cities."),
  country("greece", "Greece", "gr", "$5.49", 5.49, "Reliable 4G/5G across Greece on Cosmote and Vodafone. Stay connected from Athens to Santorini and Mykonos."),
  country("ireland", "Ireland", "ie", "$5.99", 5.99, "Fast mobile data across Ireland on Vodafone and Three. Coverage in Dublin, Galway, and along the Wild Atlantic Way."),

  // Countries — Asia
  country("japan", "Japan", "jp", "$5.99", 5.99, "High-speed 5G coverage across Japan on NTT Docomo and SoftBank. Stay connected from Tokyo to Kyoto."),
  country("south-korea", "South Korea", "kr", "$5.99", 5.99, "Lightning-fast 5G across South Korea on KT and SK Telecom. Built for one of the world's fastest mobile networks."),
  country("singapore", "Singapore", "sg", "$5.49", 5.49, "Fast 4G/5G across Singapore on Singtel and StarHub. Perfect for short business trips and Southeast Asia stopovers."),
  country("thailand", "Thailand", "th", "$4.99", 4.99, "Reliable 4G/5G across Thailand on AIS and TrueMove. Coverage from Bangkok to Phuket and Chiang Mai."),
  country("vietnam", "Vietnam", "vn", "$4.99", 4.99, "Stay connected across Vietnam on Viettel and Vinaphone. From Hanoi to Ho Chi Minh City and Halong Bay."),
  country("indonesia", "Indonesia", "id", "$5.49", 5.49, "Mobile data across Indonesia on Telkomsel and Indosat. Coverage in Bali, Jakarta, and across the archipelago."),
  country("philippines", "Philippines", "ph", "$5.49", 5.49, "Reliable 4G/5G across the Philippines on Globe and Smart. From Manila to Palawan and Cebu."),
  country("malaysia", "Malaysia", "my", "$4.99", 4.99, "Fast mobile data across Malaysia on Maxis and Celcom. Coverage in KL, Penang, and Borneo."),
  country("china", "China", "cn", "$6.49", 6.49, "Mobile data across China on China Mobile and China Unicom. Includes Hong Kong and Macau coverage."),
  country("india", "India", "in", "$4.99", 4.99, "Stay connected across India with reliable 4G/5G coverage. Works with all major Indian carriers."),

  // Countries — Middle East
  country("uae", "United Arab Emirates", "ae", "$5.99", 5.99, "Fast 5G across the UAE on Etisalat and du. Coverage in Dubai, Abu Dhabi, and across the Emirates."),
  country("saudi-arabia", "Saudi Arabia", "sa", "$5.99", 5.99, "Reliable 4G/5G across Saudi Arabia on STC and Mobily. From Riyadh to Jeddah and the Red Sea coast."),
  country("israel", "Israel", "il", "$5.99", 5.99, "Fast mobile data across Israel on Cellcom and Partner. Coverage in Tel Aviv, Jerusalem, and beyond."),
  country("qatar", "Qatar", "qa", "$5.49", 5.49, "Reliable 4G/5G across Qatar on Ooredoo and Vodafone. Perfect for stopovers and longer stays in Doha."),
  country("bahrain", "Bahrain", "bh", "$4.99", 4.99, "Fast 4G/5G coverage across Bahrain on Batelco and Stc Bahrain networks. Perfect for short and long stays."),
  country("turkey", "Turkey", "tr", "$4.49", 4.49, "Reliable 4G/5G data across Turkey on Turkcell and Vodafone. Travel from Istanbul to Cappadocia connected."),

  // Countries — Americas
  country("usa", "United States", "us", "$5.99", 5.99, "Coast-to-coast 5G coverage across the United States on T-Mobile and AT&T networks."),
  country("canada", "Canada", "ca", "$5.99", 5.99, "Nationwide 4G/5G across Canada on Bell and Rogers. Coverage from Toronto to Vancouver and the Rockies."),
  country("mexico", "Mexico", "mx", "$4.99", 4.99, "Reliable mobile data across Mexico on Telcel and Movistar. From Mexico City to Cancún and Oaxaca."),
  country("brazil", "Brazil", "br", "$5.49", 5.49, "Stay connected across Brazil on Vivo and Claro. Coverage in Rio, São Paulo, and along the Atlantic coast."),
  country("argentina", "Argentina", "ar", "$5.49", 5.49, "Reliable 4G/5G across Argentina on Movistar and Personal. From Buenos Aires to Patagonia."),
  country("colombia", "Colombia", "co", "$5.49", 5.49, "Fast mobile data across Colombia on Claro and Tigo. Coverage in Bogotá, Medellín, and Cartagena."),

  // Countries — Africa
  country("morocco", "Morocco", "ma", "$5.49", 5.49, "Reliable 4G/5G across Morocco on Maroc Telecom and Orange. From Marrakech to Casablanca and the Sahara."),
  country("egypt", "Egypt", "eg", "$4.99", 4.99, "Stay connected throughout Egypt on Vodafone Egypt and Orange. Coverage from Cairo to Luxor and the Red Sea."),
  country("south-africa", "South Africa", "za", "$5.49", 5.49, "Reliable mobile data across South Africa on Vodacom and MTN. Coverage from Cape Town to Kruger and Johannesburg."),
  country("kenya", "Kenya", "ke", "$5.49", 5.49, "Reliable mobile data across Kenya, including Nairobi, Mombasa, and safari regions on Safaricom and Airtel networks."),
  country("nigeria", "Nigeria", "ng", "$5.49", 5.49, "Mobile data across Nigeria on MTN and Glo. Coverage in Lagos, Abuja, and across the country."),

  // Countries — Oceania
  country("australia", "Australia", "au", "$6.49", 6.49, "Nationwide 4G/5G coverage across Australia on Telstra and Optus. Works in cities and along coastal routes."),
  country("new-zealand", "New Zealand", "nz", "$6.49", 6.49, "Fast mobile data across New Zealand on Spark and Vodafone NZ. Coverage on both islands and remote regions."),
];

const POPULAR_SLUGS = [
  "japan",
  "italy",
  "france",
  "spain",
  "europe",
  "thailand",
  "usa",
  "mexico",
] as const;

export const popularDestinations: Destination[] = POPULAR_SLUGS
  .map((slug) => destinations.find((d) => d.slug === slug))
  .filter((d): d is Destination => d !== undefined);

export const regionDestinations: Destination[] = destinations.filter((d) => d.type === "region");
export const countryDestinations: Destination[] = destinations.filter((d) => d.type === "country");

export function getDestinationBySlug(slug: string): Destination | undefined {
  return destinations.find((d) => d.slug === slug);
}
