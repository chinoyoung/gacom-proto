export type PlacementArea =
  | "Homepage"
  | "Directory Homepage"
  | "Search Results"
  | "Profile & Program Listings"
  | "Brand Promotions";

export type AdArchetype =
  | "program-card"
  | "simple-photo"
  | "thumb-text"
  | "split-banner"
  | "brand-split"
  | "centered-overlay"
  | "video-split"
  | "cover-photo"
  | "hot-jobs";

export type AdField =
  | "title"
  | "clientLink"
  | "videoLink"
  | "description"
  | "image"
  | "featuredProgram"
  | "programs"
  | "customizeClientLink";

export const AD_FIELD_LABELS: Record<AdField, string> = {
  title: "Title",
  clientLink: "Client Link",
  videoLink: "Video Link",
  description: "Description",
  image: "Image",
  featuredProgram: "Featured Program",
  programs: "Programs",
  customizeClientLink: "Customize Client Link",
};

export interface AdTypeSpec {
  code: string; // "Ad A", "HH", ...
  name: string; // "Homepage Premier Feature"
  area: PlacementArea;
  archetype: AdArchetype;
  titleMax: number | null; // null when title is fully auto-populated
  titleAuto: boolean; // title auto-pulled (org/program name)
  descriptionMax: number | null; // null when no (manual) description field
  imageDesktop: string; // "400 × 300" display string ("Logo" / "Auto" when image-less)
  imageMobile?: string; // when different from desktop
  imageRatio?: string; // "4:3", "1:1", "1.91:1" — for the preview frame
  buttons: string[]; // e.g. ["Visit Website"], ["Visit Website", "View Program"]
  autoFields: string[]; // e.g. ["Provider", "Logo", "Reviews", "Verification"]
  price: number; // flat mock price
  example: string; // cloudinary desktop example URL (reference only)
  tips?: string[];
  fields?: AdField[]; // explicit form field order; falls back to inference when omitted
}

function example(slug: string): string {
  return `https://res.cloudinary.com/gacom/image/upload/ads-specs/ad-${slug}-desktop.png`;
}

export const AD_TYPES: AdTypeSpec[] = [
  // Homepage
  {
    code: "Ad E",
    name: "GoAbroad Homepage Video Ad",
    area: "Homepage",
    archetype: "video-split",
    titleMax: 80,
    titleAuto: false,
    descriptionMax: null,
    imageDesktop: "1280 × 720",
    imageRatio: "16:9",
    buttons: ["Visit Website"],
    autoFields: ["Provider", "Thumbnail"],
    price: 1000,
    example: example("e"),
    fields: ["title", "clientLink", "videoLink"],
  },
  {
    code: "Ad HFP",
    name: "Homepage Featured Program",
    area: "Homepage",
    archetype: "program-card",
    titleMax: 70,
    titleAuto: false,
    descriptionMax: null,
    imageDesktop: "400 × 300",
    imageRatio: "4:3",
    buttons: ["Visit Website", "View Program"],
    autoFields: ["Provider", "Logo", "Reviews", "Verification"],
    price: 800,
    example: example("a"),
    fields: ["featuredProgram", "customizeClientLink", "clientLink", "title", "image"],
  },
  {
    code: "Ad A",
    name: "Homepage Premier Feature",
    area: "Homepage",
    archetype: "program-card",
    titleMax: null,
    titleAuto: true,
    descriptionMax: 65,
    imageDesktop: "400 × 300",
    imageRatio: "4:3",
    buttons: ["Visit Website"],
    autoFields: ["Provider", "Logo", "Reviews", "Verification"],
    price: 1200,
    example: example("a"),
    fields: ["clientLink", "description", "image"],
  },

  // Directory Homepage
  {
    code: "Ad F",
    name: "Directory Headline Photo",
    area: "Directory Homepage",
    archetype: "simple-photo",
    titleMax: 70,
    titleAuto: false,
    descriptionMax: null,
    imageDesktop: "240 × 240",
    imageRatio: "1:1",
    buttons: ["Visit Website"],
    autoFields: ["Logo"],
    price: 500,
    example: example("f"),
  },
  {
    code: "Ad G",
    name: "Premier Sponsorship",
    area: "Directory Homepage",
    archetype: "thumb-text",
    titleMax: null,
    titleAuto: true,
    descriptionMax: 65,
    imageDesktop: "100 × 100",
    imageRatio: "1:1",
    buttons: [],
    autoFields: ["Logo"],
    price: 300,
    example: example("g"),
  },
  {
    code: "Ad H",
    name: "Directory Premier Feature",
    area: "Directory Homepage",
    archetype: "simple-photo",
    titleMax: 70,
    titleAuto: false,
    descriptionMax: null,
    imageDesktop: "240 × 240",
    imageRatio: "1:1",
    buttons: ["Visit Website"],
    autoFields: ["Logo"],
    price: 700,
    example: example("h"),
  },
  {
    code: "Ad I",
    name: "Directory Featured Program",
    area: "Directory Homepage",
    archetype: "program-card",
    titleMax: 70,
    titleAuto: false,
    descriptionMax: null,
    imageDesktop: "240 × 150",
    imageRatio: "8:5",
    buttons: ["Visit Website", "View Program"],
    autoFields: ["Provider", "Logo", "Reviews", "Verification"],
    price: 500,
    example: example("i"),
  },
  {
    code: "Ad J",
    name: "Directory Organizational Feature",
    area: "Directory Homepage",
    archetype: "split-banner",
    titleMax: 80,
    titleAuto: false,
    descriptionMax: null,
    imageDesktop: "1000 × 350",
    imageRatio: "1.91:1",
    buttons: ["Visit Website"],
    autoFields: ["Provider", "Logo"],
    price: 900,
    example: example("j"),
  },
  {
    code: "Ad L",
    name: "Directory Video",
    area: "Directory Homepage",
    archetype: "video-split",
    titleMax: 80,
    titleAuto: false,
    descriptionMax: null,
    imageDesktop: "1280 × 720",
    imageRatio: "16:9",
    buttons: ["Visit Website"],
    autoFields: ["Provider", "Thumbnail"],
    price: 900,
    example: example("l"),
  },

  // Search Results
  {
    code: "Ad N",
    name: "Results Feature",
    area: "Search Results",
    archetype: "program-card",
    titleMax: null,
    titleAuto: true,
    descriptionMax: null,
    imageDesktop: "320 × 150",
    imageMobile: "380 × 150",
    imageRatio: "32:15",
    buttons: ["Visit Website", "View Program"],
    autoFields: ["Provider", "Logo", "Reviews", "Verification"],
    price: 500,
    example: example("n"),
  },
  {
    code: "Ad M",
    name: "Results Headline Photo",
    area: "Search Results",
    archetype: "simple-photo",
    titleMax: 70,
    titleAuto: false,
    descriptionMax: null,
    imageDesktop: "240 × 240",
    imageRatio: "1:1",
    buttons: ["Visit Website"],
    autoFields: ["Logo"],
    price: 450,
    example: example("m"),
  },
  {
    code: "Ad O",
    name: "Listing Photo",
    area: "Search Results",
    archetype: "program-card",
    titleMax: null,
    titleAuto: true,
    descriptionMax: null,
    imageDesktop: "320 × 150",
    imageMobile: "380 × 150",
    imageRatio: "32:15",
    buttons: ["Visit Website", "View Program"],
    autoFields: ["Provider", "Reviews", "Verification", "See All Programs"],
    price: 300,
    example: example("o"),
  },
  {
    code: "Ad P",
    name: "Listing Logo",
    area: "Search Results",
    archetype: "program-card",
    titleMax: null,
    titleAuto: true,
    descriptionMax: null,
    imageDesktop: "Logo",
    buttons: ["Visit Website", "View Program"],
    autoFields: ["Provider", "Logo", "Reviews", "Verification"],
    price: 250,
    example: example("p"),
  },
  {
    code: "Ad Q",
    name: "Hot Jobs Listing",
    area: "Search Results",
    archetype: "hot-jobs",
    titleMax: null,
    titleAuto: true,
    descriptionMax: null,
    imageDesktop: "Auto",
    buttons: [],
    autoFields: ["Image"],
    price: 200,
    example: example("q"),
  },
  {
    code: "Ad R",
    name: "Results Page Flyer Ad",
    area: "Search Results",
    archetype: "thumb-text",
    titleMax: null,
    titleAuto: true,
    descriptionMax: 65,
    imageDesktop: "100 × 100",
    imageRatio: "1:1",
    buttons: [],
    autoFields: ["Logo"],
    price: 250,
    example: example("r"),
  },

  // Profile & Program Listings
  {
    code: "Ad T",
    name: "Listing Cover Photo",
    area: "Profile & Program Listings",
    archetype: "cover-photo",
    titleMax: null,
    titleAuto: false,
    descriptionMax: null,
    imageDesktop: "1440 × 500",
    imageMobile: "430 × 320",
    imageRatio: "2.88:1",
    buttons: [],
    autoFields: [],
    price: 800,
    example: example("t"),
    fields: ["image", "programs"],
  },
  {
    code: "Ad D",
    name: "Customized Listing Cover Photo",
    area: "Profile & Program Listings",
    archetype: "cover-photo",
    titleMax: null,
    titleAuto: false,
    descriptionMax: null,
    imageDesktop: "1440 × 500",
    imageMobile: "430 × 320",
    imageRatio: "2.88:1",
    buttons: [],
    autoFields: [],
    price: 900,
    example: example("d"),
    fields: ["image", "programs"],
  },
  {
    code: "Ad K",
    name: "Customized Provider Page Cover Photo",
    area: "Profile & Program Listings",
    archetype: "cover-photo",
    titleMax: null,
    titleAuto: true,
    descriptionMax: null,
    imageDesktop: "1440 × 500",
    imageMobile: "430 × 320",
    imageRatio: "2.88:1",
    buttons: ["Visit Website", "Contact Provider"],
    autoFields: ["Provider", "Logo", "Reviews", "Verification"],
    price: 1200,
    example: example("k"),
    fields: ["image", "programs"],
  },

  // Brand Promotions
  {
    code: "HH",
    name: "Travel Resources Headline Photo",
    area: "Brand Promotions",
    archetype: "brand-split",
    titleMax: 70,
    titleAuto: false,
    descriptionMax: 140,
    imageDesktop: "365 × 350",
    imageMobile: "335 × 430",
    imageRatio: "1.04:1",
    buttons: ["Learn More"],
    autoFields: ["Logo"],
    price: 500,
    example: example("hh"),
  },
  {
    code: "GG",
    name: "Travel Resource Homepage Headline Photo",
    area: "Brand Promotions",
    archetype: "brand-split",
    titleMax: 70,
    titleAuto: false,
    descriptionMax: 140,
    imageDesktop: "365 × 350",
    imageMobile: "335 × 430",
    imageRatio: "1.04:1",
    buttons: ["Learn More"],
    autoFields: ["Logo"],
    price: 600,
    example: example("gg"),
  },
  {
    code: "II",
    name: "Travel Resource Feature",
    area: "Brand Promotions",
    archetype: "centered-overlay",
    titleMax: 70,
    titleAuto: false,
    descriptionMax: null,
    imageDesktop: "410 × 350",
    imageMobile: "380 × 375",
    imageRatio: "1.17:1",
    buttons: ["Learn More"],
    autoFields: ["Logo"],
    price: 500,
    example: example("ii"),
  },
  {
    code: "JJ",
    name: "Travel Resource Listing",
    area: "Brand Promotions",
    archetype: "brand-split",
    titleMax: 70,
    titleAuto: false,
    descriptionMax: 200,
    imageDesktop: "275 × 270",
    imageMobile: "380 × 180",
    imageRatio: "1.02:1",
    buttons: ["Learn More"],
    autoFields: ["Logo", "Provider"],
    price: 300,
    example: example("jj"),
  },
  {
    code: "LL",
    name: "Travel Insurance Listing Feature",
    area: "Brand Promotions",
    archetype: "brand-split",
    titleMax: 70,
    titleAuto: false,
    descriptionMax: 200,
    imageDesktop: "275 × 270",
    imageMobile: "380 × 180",
    imageRatio: "1.02:1",
    buttons: ["Learn More"],
    autoFields: ["Logo", "Provider"],
    price: 350,
    example: example("ll"),
  },
  {
    code: "KK",
    name: "Travel Insurance Headline Photo",
    area: "Brand Promotions",
    archetype: "brand-split",
    titleMax: 70,
    titleAuto: false,
    descriptionMax: 140,
    imageDesktop: "365 × 350",
    imageMobile: "335 × 430",
    imageRatio: "1.04:1",
    buttons: ["Learn More"],
    autoFields: ["Logo"],
    price: 500,
    example: example("kk"),
  },
  {
    code: "MM",
    name: "Scholarship Homepage Headline Photo",
    area: "Brand Promotions",
    archetype: "brand-split",
    titleMax: 70,
    titleAuto: false,
    descriptionMax: 140,
    imageDesktop: "390 × 350",
    imageMobile: "375 × 430",
    imageRatio: "1.11:1",
    buttons: ["Learn More"],
    autoFields: ["Logo"],
    price: 600,
    example: example("mm"),
  },
  {
    code: "NN",
    name: "Embassy Directory Feature",
    area: "Brand Promotions",
    archetype: "centered-overlay",
    titleMax: 70,
    titleAuto: false,
    descriptionMax: null,
    imageDesktop: "380 × 220",
    imageRatio: "1.73:1",
    buttons: ["Learn More"],
    autoFields: ["Logo"],
    price: 500,
    example: example("nn"),
  },
];

export const AD_TYPES_BY_AREA: Record<PlacementArea, AdTypeSpec[]> = AD_TYPES.reduce(
  (acc, spec) => {
    acc[spec.area].push(spec);
    return acc;
  },
  {
    Homepage: [],
    "Directory Homepage": [],
    "Search Results": [],
    "Profile & Program Listings": [],
    "Brand Promotions": [],
  } as Record<PlacementArea, AdTypeSpec[]>
);

export function getAdType(name: string): AdTypeSpec | undefined {
  return AD_TYPES.find((spec) => spec.name === name);
}

export function getAdFields(spec: AdTypeSpec): AdField[] {
  if (spec.fields) return spec.fields;
  const f: AdField[] = [];
  if (spec.titleAuto || spec.titleMax != null) f.push("title");
  if (spec.descriptionMax != null) f.push("description");
  f.push("clientLink");
  if (spec.archetype === "video-split") f.push("videoLink");
  else if (spec.imageDesktop.includes("×")) f.push("image");
  return f;
}

// Local example screenshots under public/images/ads-specs, keyed by ad code.
// Ad T and Ad D share one combined example; Ad HFP has none (returns null).
const AD_EXAMPLE_THUMBS: Record<string, string> = {
  "Ad A": "a", "Ad E": "e", "Ad HFP": "i", "Ad F": "f", "Ad G": "g",
  "Ad H": "h", "Ad I": "i", "Ad J": "j", "Ad L": "l", "Ad N": "n",
  "Ad M": "m", "Ad O": "o", "Ad P": "p", "Ad Q": "q", "Ad R": "r",
  "Ad T": "t-d", "Ad D": "t-d", "Ad K": "k",
  HH: "hh", GG: "gg", II: "ii", JJ: "jj", LL: "ll", KK: "kk", MM: "mm", NN: "nn",
};

/** Local example-screenshot path for an ad type, or null when none exists. */
export function adExampleThumb(spec: AdTypeSpec | undefined | null): string | null {
  if (!spec) return null;
  const slug = AD_EXAMPLE_THUMBS[spec.code];
  return slug ? `/images/ads-specs/ad-${slug}.png` : null;
}
