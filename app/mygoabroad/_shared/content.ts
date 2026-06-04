export const MYG_LINKS = {
  signup: "https://www.goabroad.com",
  signin: "https://www.goabroad.com",
  search: "https://www.goabroad.com",
  resources: "https://www.goabroad.com/resources",
};

export const MYG_IMAGES = {
  logo: "https://images.goabroad.com/image/upload/v1/images2/mygoabroad/myg-black-lozenge.webp",
  hero: "https://images.goabroad.com/image/upload/v1/images2/mygoabroad/myg-hero.webp",
  celitech:
    "https://images.goabroad.com/image/upload/v1/images2/myg/marketplace/celitech_logo.webp",
  savePrograms: "/images/mygoabroad/save-programs.svg",
  comparePrograms: "/images/mygoabroad/compare-programs.svg",
  recommendations: "/images/mygoabroad/personalized-recommendations.svg",
  travelInsurance: "/images/mygoabroad/travel-insurance.svg",
  travelResources: "/images/mygoabroad/travel-resources.svg",
  signup: "/images/mygoabroad/signup.svg",
};

export const MYG_HERO = {
  h1: "Your Ultimate Travel Companion",
  body: "Browse, save and compare thousands of travel programs, get all your pre-departure essentials, and finalize your travel plans with MyGoAbroad.",
  primaryCta: "Sign up for free",
  signinPrefix: "Already have an account?",
  signinLink: "Sign in.",
};

export const MYG_INTRO = {
  h2: "Ready to embark on a life-changing journey?",
  body: "Whether you're studying, volunteering, interning, teaching, taking a gap year or just plain traveling, we've got you covered. GoAbroad.com is your search engine for meaningful travel and MyGoAbroad is your personal one-stop-shop for planning your meaningful travel from A to Z.",
};

export const MYG_DISCOVERY = {
  h2: "Find the Perfect Program for You",
  sub: "We've built the best tools to make it easier than ever to find a program that fits your goals, destination, and budget.",
  cta: "Begin Your Search",
  cards: [
    {
      img: MYG_IMAGES.savePrograms,
      alt: "Save Programs",
      title: "Save Programs",
      body: "Save your favorite programs as you browse and revisit them whenever you're ready.",
    },
    {
      img: MYG_IMAGES.comparePrograms,
      alt: "Compare Programs",
      title: "Compare Programs",
      body: "View multiple programs side-by-side to find the one that's right for you.",
    },
    {
      img: MYG_IMAGES.recommendations,
      alt: "Get Personalized Recommendations",
      title: "Get Personalized Recommendations",
      body: "Get program suggestions tailored to your interests and travel goals.",
    },
  ],
};

export const MYG_ESSENTIALS = {
  h2: "Get Everything You Need to Travel with Confidence",
  sub: "Once you've chosen your program, it's time to sort the essentials. From flights to accommodation and beyond, GoAbroad connects you with the best travel resources to make your trip seamless.",
  exploreCta: "Explore Resources",
  insurance: {
    img: MYG_IMAGES.travelInsurance,
    h3: "Find Dependable Coverage for Any Trip",
    h4: "Purchase GoAbroad Travel Insurance",
    body1: "Secure your trip with tailored plans for every destination.",
    body2:
      "Access top-rated global travel health insurance with instant quotes and 24/7 support — so you can explore with peace of mind.",
    partner: "ENVISAGE",
  },
  esim: {
    h3: "Stay Connected Worldwide",
    h4: "Buy a GoAbroad Data Plan",
    body1: "Get lightning-fast 5G/LTE data in 215+ countries.",
    body2:
      "Activate your plan in minutes and skip the roaming fees. Just scan a QR code and you'll be ready to explore.",
    partnerLogo: MYG_IMAGES.celitech,
  },
};

export const MYG_RESOURCES = {
  h2: "Travel Resources",
  body: "Once you've chosen your program abroad, you'll need a few things—like flights, insurance, accommodations, passports & visas, and more. Browse offers and information from our preferred travel resource partners!",
  cta: "Explore Resources",
  img: MYG_IMAGES.travelResources,
};

export const MYG_SIGNUP = {
  h2: "Create a MyGoAbroad account now!",
  body: "Join thousands of travelers planning their life-changing journeys. Save programs, compare options, and access exclusive travel resources.",
  primaryCta: "Sign up for free",
  signinPrefix: "Already have an account?",
  signinLink: "Sign in.",
  img: MYG_IMAGES.signup,
};

export interface MyGFaq {
  question: string;
  answer: string;
}

export const MYG_FAQS: MyGFaq[] = [
  {
    question: "What is GoAbroad.com?",
    answer:
      "GoAbroad.com is an established and comprehensive website that has been serving meaningful travelers since 1997. We are a search engine for meaningful travel programs, focusing on 11 directories or program types, including Study Abroad, Internships Abroad, Teach Abroad and Volunteer Abroad. Our mission is to inspire and enable meaningful travel experiences. Browse & Explore our search directories: Study Abroad, Volunteer Abroad, Intern Abroad, Teach Abroad, TEFL Courses, Gap Year, Degrees Abroad, High School Abroad, Language Schools, Adventure Travel, Jobs Abroad.",
  },
  {
    question: "What is MyGoAbroad?",
    answer:
      "MyGoAbroad is a personal account on GoAbroad that enables users to browse, search, save and compare programs, travel resources and more. We are committed to providing users with thoughtful, useful information and products that will take them from dreaming of travel to getting on a plane to having the experience of a lifetime.",
  },
  {
    question: "What is meaningful travel?",
    answer:
      "Wondering how to make your travel meaningful, or what it is in the first place? To us, meaningful travel is participating in something more than just being a tourist. It means immersing yourself in the culture of another country, making meaningful connections with people in the communities you visit, and ideally making a lasting, positive impact on the places you travel. Read: 24 Perspectives & Thoughts on Meaningful Travel.",
  },
  {
    question: "How can I get a travel scholarship, discount or deal for my trip?",
    answer:
      "We're so glad you asked! When you sign up for MyGoAbroad, you'll be able to submit an application for travel scholarships, discounts, and deals on programs abroad (think study abroad, internships abroad, volunteer abroad, teach abroad, TEFL courses, and more!). Based on the details in your application, we'll give you access to instant offers for travel scholarships and deals that meet your interests and eligibility!",
  },
  {
    question: "How do I choose a program abroad?",
    answer:
      `Great question! And while there isn't one singular “right” answer, the best way is to first think about WHAT you want to do and WHERE you want to go (if you need help, browse our homepage or our expert articles!). Then do yourself a favor and search on GoAbroad so you don't miss any of the options out there. Save your favorites in MyGoAbroad, compare side by side, and narrow it down to your perfect program! Read: How to Pick the Right Program Abroad for You. Read: How to Choose Where to Study Abroad.`,
  },
  {
    question: "What's the best way to compare travel programs?",
    answer:
      `The easiest way to compare travel programs is within your MyGoAbroad account! Simply search for programs that meet your needs and interests, save or favorite them, then click “See All & Compare” in your MyGoAbroad account. Voila—you'll be able to see your favorite programs side-by-side for a simple and informative comparison.`,
  },
  {
    question: "How to plan a trip with MyGoAbroad?",
    answer:
      `Start by finding programs that interest you. You can do this by using the search and browse tools on GoAbroad or by requesting program matches from our online advisors. Pro Tip: Head over to “Deals” and apply for a scholarship or deal to see if you can save money on one of your favorite programs (or better yet find a new one that ticks all the boxes!). Next, save your favorite programs to your MyGoAbroad account by clicking on the heart icon. Once you've saved your favorites, head over to “Saved” in your MyGoAbroad account to revisit the programs that you like best. Click “See All & Compare” to select programs to compare side-by-side. Choose which programs you want to apply to or book! Come back to MyGoAbroad to browse, compare, and search for the rest of your travel planning needs—that includes flights, travel insurance, accommodations, and more!`,
  },
];
