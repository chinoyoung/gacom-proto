# /mygoabroad Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a `/mygoabroad` page in gacom-proto with two design versions — v1 a faithful copy of the gacom-next `/mygoabroad` page, v2 the same content restyled to the `/marketplace/partner` design language.

**Architecture:** A versioned route (`mygoabroad` page id, v1+v2, default v1) using the existing design-version orchestrator pattern. Shared copy + FAQ data live in one `_shared/content.ts`; each version composes 7 section components. Static page — no backend.

**Tech Stack:** Next.js 16 App Router, TypeScript (strict), Tailwind CSS v4, lucide-react.

---

## Testing & git notes (read first)
- No unit-test harness. Verify with `npx tsc --noEmit`, `npm run lint`, and a final visual check (Chrome DevTools MCP).
- The implementing agent must NOT run git commands. "Commit" steps are suggestions for the user.
- Use brand tokens only (`cobalt-*`, `roman-*`, `sun-*`, `fern-*`, `slate-*`, `neutral-*`); no inline hex. The source's `secondary-*` maps to `roman-*` (exact), `primary-*`→`cobalt-*`, `ga-black`→`neutral-900`, `gray-*`→`slate-*`.
- Reference design files to mirror for v2: `app/marketplace/partner/_versions/v1/*` and `_versions/v2/*` (eyebrow labels, section rhythm, card/button styles).

## File structure

| File | Action | Responsibility |
| --- | --- | --- |
| `lib/design-versions.ts` | Modify | Register `mygoabroad` (v1+v2) |
| `components/canvas/ToolbarVersionSwitcher.tsx` | Modify | Map `/mygoabroad` → `mygoabroad` |
| `public/images/mygoabroad/*.svg` | Create (copy) | 6 illustration assets |
| `app/mygoabroad/layout.tsx` | Create | PrototypeShell wrapper |
| `app/mygoabroad/_shared/content.ts` | Create | Copy + FAQ data + image URLs |
| `app/mygoabroad/_versions/v1/*` | Create | v1 sections + page |
| `app/mygoabroad/_versions/v2/*` | Create | v2 sections + page |
| `app/mygoabroad/page.tsx` | Create | Orchestrator (after both versions exist) |

---

### Task 1: Registry, switcher, assets, layout

**Files:** Modify `lib/design-versions.ts`, `components/canvas/ToolbarVersionSwitcher.tsx`; create `public/images/mygoabroad/*` + `app/mygoabroad/layout.tsx`

- [ ] **Step 1: Register the page.** In `lib/design-versions.ts`, add to `PAGE_VERSIONS` (after the `"provider-detail"` entry):

```ts
  "mygoabroad": {
    pageId: "mygoabroad",
    versions: [
      { id: "v1", label: "v1", description: "Direct copy of the live MyGoAbroad page" },
      { id: "v2", label: "v2", description: "Redesigned to match the marketplace design language" },
    ],
    defaultVersion: "v1",
  },
```

- [ ] **Step 2: Map the path.** In `components/canvas/ToolbarVersionSwitcher.tsx` `pageIdForPath`, add (after the providers check):

```ts
  if (pathname === "/mygoabroad") return "mygoabroad";
```

- [ ] **Step 3: Copy the 6 SVG assets.** Run:

```bash
mkdir -p /Users/chinoyoung/Code/gacom-proto/public/images/mygoabroad && cp /Users/chinoyoung/Code/gacom-next/public/images/mygoabroad/save-programs.svg /Users/chinoyoung/Code/gacom-next/public/images/mygoabroad/compare-programs.svg /Users/chinoyoung/Code/gacom-next/public/images/mygoabroad/personalized-recommendations.svg /Users/chinoyoung/Code/gacom-next/public/images/mygoabroad/travel-insurance.svg /Users/chinoyoung/Code/gacom-next/public/images/mygoabroad/travel-resources.svg /Users/chinoyoung/Code/gacom-next/public/images/mygoabroad/signup.svg /Users/chinoyoung/Code/gacom-proto/public/images/mygoabroad/
```
Expected: 6 files now in `gacom-proto/public/images/mygoabroad/`. Verify with `ls`.

- [ ] **Step 4: Create `app/mygoabroad/layout.tsx`:**

```tsx
import { PrototypeShell } from "@/components/canvas/PrototypeShell";

export default function MyGoAbroadLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PrototypeShell>{children}</PrototypeShell>;
}
```

- [ ] **Step 5: Type-check.** `npx tsc --noEmit` — Expected: PASS.

- [ ] **Step 6 (user): Commit** — `chore(mygoabroad): register version + assets + layout`

---

### Task 2: Shared content (`_shared/content.ts`)

**Files:** Create `app/mygoabroad/_shared/content.ts`

- [ ] **Step 1: Create the file** with all copy, image URLs, and FAQ data (verbatim from the source):

```ts
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
      "Great question! And while there isn't one singular “right” answer, the best way is to first think about WHAT you want to do and WHERE you want to go (if you need help, browse our homepage or our expert articles!). Then do yourself a favor and search on GoAbroad so you don't miss any of the options out there. Save your favorites in MyGoAbroad, compare side by side, and narrow it down to your perfect program! Read: How to Pick the Right Program Abroad for You. Read: How to Choose Where to Study Abroad.",
  },
  {
    question: "What's the best way to compare travel programs?",
    answer:
      "The easiest way to compare travel programs is within your MyGoAbroad account! Simply search for programs that meet your needs and interests, save or favorite them, then click “See All & Compare” in your MyGoAbroad account. Voila—you'll be able to see your favorite programs side-by-side for a simple and informative comparison.",
  },
  {
    question: "How to plan a trip with MyGoAbroad?",
    answer:
      "Start by finding programs that interest you. You can do this by using the search and browse tools on GoAbroad or by requesting program matches from our online advisors. Pro Tip: Head over to “Deals” and apply for a scholarship or deal to see if you can save money on one of your favorite programs (or better yet find a new one that ticks all the boxes!). Next, save your favorite programs to your MyGoAbroad account by clicking on the heart icon. Once you've saved your favorites, head over to “Saved” in your MyGoAbroad account to revisit the programs that you like best. Click “See All & Compare” to select programs to compare side-by-side. Choose which programs you want to apply to or book! Come back to MyGoAbroad to browse, compare, and search for the rest of your travel planning needs—that includes flights, travel insurance, accommodations, and more!",
  },
];
```

- [ ] **Step 2: Type-check.** `npx tsc --noEmit` — Expected: PASS.

---

### Task 3: v1 — faithful copy (7 sections + page)

**Files:** Create under `app/mygoabroad/_versions/v1/`: `V1Hero.tsx`, `V1Intro.tsx`, `V1ProgramDiscovery.tsx`, `V1TravelEssentials.tsx`, `V1Faq.tsx`, `V1TravelResources.tsx`, `V1Signup.tsx`, `V1MyGoAbroadPage.tsx`

Implementer note: these recreate the gacom-next source faithfully. For any visual nuance, you MAY open the live page `http://localhost:3030/mygoabroad` or read `/Users/chinoyoung/Code/gacom-next/components/mygoabroad/*.tsx`. Use the EXACT code below as the baseline; it's complete and uses brand tokens.

- [ ] **Step 1: `V1Hero.tsx`:**

```tsx
import { MYG_HERO, MYG_IMAGES, MYG_LINKS } from "../../_shared/content";

export default function V1Hero() {
  return (
    <div className="w-full max-w-7xl px-4 md:px-6 lg:px-8 xl:px-0 pt-8 xl:pt-12">
      <div className="bg-slate-100 rounded-2xl p-6 xl:p-12 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="flex flex-col gap-6 items-center text-center lg:items-start lg:text-left">
          <img src={MYG_IMAGES.logo} alt="MyGoAbroad Logo" className="h-11 w-auto" />
          <h1 className="text-4xl md:text-5xl font-semibold text-neutral-900 leading-tight">
            {MYG_HERO.h1}
          </h1>
          <p className="text-base lg:text-lg text-slate-700 max-w-xl">{MYG_HERO.body}</p>
          <div className="flex flex-col gap-3 items-center lg:items-start">
            <a
              href={MYG_LINKS.signup}
              className="inline-flex items-center justify-center h-12 w-48 bg-roman-500 hover:bg-roman-600 text-white font-semibold rounded-md transition-colors"
            >
              {MYG_HERO.primaryCta}
            </a>
            <p className="text-sm text-slate-600">
              {MYG_HERO.signinPrefix}{" "}
              <a href={MYG_LINKS.signin} className="text-cobalt-500 font-semibold hover:underline">
                {MYG_HERO.signinLink}
              </a>
            </p>
          </div>
        </div>
        <div className="h-[300px] lg:h-[500px] rounded-xl overflow-hidden">
          <img
            src={MYG_IMAGES.hero}
            alt="Six people holding a map"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: `V1Intro.tsx`:**

```tsx
import { MYG_INTRO } from "../../_shared/content";

export default function V1Intro() {
  return (
    <div className="flex flex-col items-center text-center gap-4 max-w-3xl">
      <h2 className="text-3xl font-bold tracking-tight text-slate-900">{MYG_INTRO.h2}</h2>
      <p className="text-base md:text-lg leading-relaxed text-slate-600">{MYG_INTRO.body}</p>
    </div>
  );
}
```

- [ ] **Step 3: `V1ProgramDiscovery.tsx`:**

```tsx
import { FiArrowRight } from "react-icons/fi";
import { MYG_DISCOVERY, MYG_LINKS } from "../../_shared/content";

export default function V1ProgramDiscovery() {
  return (
    <div className="flex flex-col items-center gap-8 w-full">
      <div className="flex flex-col items-center text-center gap-3 max-w-3xl">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">{MYG_DISCOVERY.h2}</h2>
        <p className="text-base md:text-lg leading-relaxed text-slate-600">{MYG_DISCOVERY.sub}</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full">
        {MYG_DISCOVERY.cards.map((card) => (
          <div
            key={card.title}
            className="rounded-xl border border-slate-100 bg-white p-6 md:p-8 shadow-sm flex flex-col items-center text-center gap-4"
          >
            <div className="relative h-40 w-full flex items-center justify-center">
              <img src={card.img} alt={card.alt} className="h-full w-auto object-contain" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">{card.title}</h3>
            <p className="text-sm text-slate-600">{card.body}</p>
          </div>
        ))}
      </div>
      <a
        href={MYG_LINKS.search}
        className="inline-flex items-center gap-2 bg-roman-500 hover:bg-roman-600 text-sm font-bold text-white px-5 py-2.5 rounded-md transition-colors"
      >
        {MYG_DISCOVERY.cta}
        <FiArrowRight className="w-4 h-4" aria-hidden="true" />
      </a>
    </div>
  );
}
```

(Note: `react-icons` is already a dependency in this repo — the source uses `FiArrowRight`. If `npx tsc` reports it missing, substitute lucide-react's `ArrowRight` with the same classes.)

- [ ] **Step 4: `V1TravelEssentials.tsx`:**

```tsx
import { FiArrowRight } from "react-icons/fi";
import { MYG_ESSENTIALS, MYG_LINKS } from "../../_shared/content";

export default function V1TravelEssentials() {
  const { insurance, esim } = MYG_ESSENTIALS;
  return (
    <div className="flex flex-col gap-10 w-full">
      <div className="flex flex-col items-center text-center gap-3 max-w-3xl self-center">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">{MYG_ESSENTIALS.h2}</h2>
        <p className="text-base md:text-lg leading-relaxed text-slate-600">{MYG_ESSENTIALS.sub}</p>
        <a
          href={MYG_LINKS.resources}
          className="inline-flex items-center gap-2 text-sm font-bold text-roman-500 hover:text-roman-600"
        >
          {MYG_ESSENTIALS.exploreCta}
          <FiArrowRight className="w-4 h-4" aria-hidden="true" />
        </a>
      </div>

      {/* Insurance: image left, text right */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center border-t border-slate-100 pt-10">
        <div className="relative h-64 w-full flex items-center justify-center">
          <img src={insurance.img} alt="Travel Insurance" className="h-full w-auto object-contain" />
        </div>
        <div className="flex flex-col gap-3">
          <h3 className="text-2xl md:text-3xl font-bold text-slate-900">{insurance.h3}</h3>
          <h4 className="text-lg font-semibold text-slate-700">{insurance.h4}</h4>
          <p className="text-base text-slate-600 leading-relaxed">{insurance.body1}</p>
          <p className="text-base text-slate-600 leading-relaxed">{insurance.body2}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="w-6 h-6 rounded-full bg-slate-900" aria-hidden="true" />
            <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Trusted partner: {insurance.partner}
            </span>
          </div>
        </div>
      </div>

      {/* eSIM: text left, static form mock right */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center border-t border-slate-100 pt-10">
        <div className="flex flex-col gap-3">
          <h3 className="text-2xl md:text-3xl font-bold text-slate-900">{esim.h3}</h3>
          <h4 className="text-lg font-semibold text-slate-700">{esim.h4}</h4>
          <p className="text-base text-slate-600 leading-relaxed">{esim.body1}</p>
          <p className="text-base text-slate-600 leading-relaxed">{esim.body2}</p>
          <img src={esim.partnerLogo} alt="celitech logo" className="h-6 w-auto mt-2 object-contain" />
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6 flex flex-col gap-4 shadow-sm">
          <p className="text-sm font-semibold text-slate-700">Find a data plan</p>
          <div className="flex flex-col gap-1">
            <label htmlFor="myg-esim-country" className="text-xs font-medium text-slate-500">
              Destination
            </label>
            <div
              id="myg-esim-country"
              className="h-11 px-3 rounded-md border border-slate-200 bg-slate-50 flex items-center text-sm text-slate-400"
            >
              Select a country
            </div>
          </div>
          <div className="flex items-center justify-between rounded-md bg-slate-50 px-3 py-2">
            <span className="text-sm text-slate-500">Total</span>
            <span className="text-base font-bold text-slate-900">$0.00</span>
          </div>
          <button
            type="button"
            className="inline-flex items-center justify-center h-11 bg-cobalt-500 hover:bg-cobalt-600 text-white text-sm font-semibold rounded-md transition-colors cursor-pointer"
          >
            Buy Data Plan
          </button>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 5: `V1Faq.tsx`:**

```tsx
"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { MYG_FAQS } from "../../_shared/content";

export default function V1Faq() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="mb-2">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          Frequently Asked Questions
        </h2>
      </div>
      {MYG_FAQS.map((faq, idx) => {
        const isOpen = openIdx === idx;
        return (
          <div key={faq.question} className="rounded-lg border border-slate-200 bg-white px-6">
            <button
              type="button"
              onClick={() => setOpenIdx(isOpen ? null : idx)}
              aria-expanded={isOpen}
              className="w-full flex items-center justify-between gap-4 py-5 text-left font-bold text-slate-800 cursor-pointer"
            >
              <span>{faq.question}</span>
              <ChevronDown
                className={`w-5 h-5 shrink-0 text-slate-400 transition-transform duration-200 ${
                  isOpen ? "rotate-180" : ""
                }`}
                aria-hidden="true"
              />
            </button>
            {isOpen && (
              <p className="pb-5 text-slate-700 leading-relaxed whitespace-pre-wrap">{faq.answer}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 6: `V1TravelResources.tsx`:**

```tsx
import { FiArrowRight } from "react-icons/fi";
import { MYG_RESOURCES, MYG_LINKS } from "../../_shared/content";

export default function V1TravelResources() {
  return (
    <div className="w-full bg-slate-100 py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 lg:px-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left order-first lg:order-last">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-6">{MYG_RESOURCES.h2}</h2>
          <p className="text-lg text-slate-600 max-w-lg mb-8">{MYG_RESOURCES.body}</p>
          <a
            href={MYG_LINKS.resources}
            className="inline-flex items-center gap-2 bg-roman-500 hover:bg-roman-600 rounded-md px-5 py-2.5 h-10 text-sm font-bold text-white transition-colors"
          >
            {MYG_RESOURCES.cta}
            <FiArrowRight className="w-4 h-4" aria-hidden="true" />
          </a>
        </div>
        <div className="relative h-52 lg:h-80 flex items-center justify-center order-last lg:order-first">
          <img src={MYG_RESOURCES.img} alt="Travel Resources" className="h-full w-auto object-contain" />
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 7: `V1Signup.tsx`:**

```tsx
import { MYG_SIGNUP, MYG_LINKS } from "../../_shared/content";

export default function V1Signup() {
  return (
    <div className="w-full bg-slate-50 py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 lg:px-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="relative h-64 lg:h-80 flex items-center justify-center order-first">
          <img src={MYG_SIGNUP.img} alt="Sign Up" className="h-full w-auto object-contain" />
        </div>
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left order-last">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-6">{MYG_SIGNUP.h2}</h2>
          <p className="text-lg text-slate-600 max-w-md mb-8">{MYG_SIGNUP.body}</p>
          <a
            href={MYG_LINKS.signup}
            className="inline-flex items-center justify-center h-12 w-48 bg-roman-500 hover:bg-roman-600 text-white font-semibold rounded-md transition-colors"
          >
            {MYG_SIGNUP.primaryCta}
          </a>
          <p className="text-sm text-slate-600 mt-3">
            {MYG_SIGNUP.signinPrefix}{" "}
            <a href={MYG_LINKS.signin} className="text-cobalt-600 font-semibold hover:underline">
              {MYG_SIGNUP.signinLink}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 8: `V1MyGoAbroadPage.tsx`:**

```tsx
import V1Hero from "./V1Hero";
import V1Intro from "./V1Intro";
import V1ProgramDiscovery from "./V1ProgramDiscovery";
import V1TravelEssentials from "./V1TravelEssentials";
import V1Faq from "./V1Faq";
import V1TravelResources from "./V1TravelResources";
import V1Signup from "./V1Signup";

export default function V1MyGoAbroadPage() {
  return (
    <div className="flex w-full flex-col items-center">
      <V1Hero />
      <div className="flex w-full max-w-7xl flex-col items-center justify-center gap-12 xl:gap-24 px-4 py-12 xl:py-24 md:px-6 lg:px-8 xl:px-0">
        <V1Intro />
        <V1ProgramDiscovery />
        <V1TravelEssentials />
        <V1Faq />
      </div>
      <V1TravelResources />
      <V1Signup />
    </div>
  );
}
```

- [ ] **Step 9: Type-check + lint.** `npx tsc --noEmit` (PASS) then `npm run lint` (no new errors beyond acceptable `<img>` warnings). If `react-icons/fi` is unavailable, replace the 3 `FiArrowRight` imports/usages with lucide-react `ArrowRight` (same `className`).

- [ ] **Step 10 (user): Commit** — `feat(mygoabroad): v1 faithful copy`

---

### Task 4: v2 — marketplace design language (7 sections + page)

**Files:** Create under `app/mygoabroad/_versions/v2/`: `V2Hero.tsx`, `V2Intro.tsx`, `V2ProgramDiscovery.tsx`, `V2TravelEssentials.tsx`, `V2Faq.tsx`, `V2TravelResources.tsx`, `V2Signup.tsx`, `V2MyGoAbroadPage.tsx`

Implementer note: same content (`_shared/content.ts`), restyled to match `app/marketplace/partner/_versions/v2/*`. Mirror those patterns: eyebrow labels, `max-w-7xl mx-auto px-4 sm:px-6 md:px-12 lg:px-20`, `py-16 md:py-24` rhythm, bordered `bg-slate-50` cards, cobalt primary / cobalt-700 or sun-50 closing band. Use the EXACT code below.

- [ ] **Step 1: `V2Hero.tsx`:**

```tsx
import { ArrowRight } from "lucide-react";
import { MYG_HERO, MYG_IMAGES, MYG_LINKS } from "../../_shared/content";

export default function V2Hero() {
  return (
    <section className="bg-slate-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 lg:px-20 py-16 md:py-24 flex flex-col md:flex-row md:items-center gap-12">
        <div className="flex-1 flex flex-col gap-6">
          <img src={MYG_IMAGES.logo} alt="MyGoAbroad Logo" className="h-10 w-auto self-start" />
          <p className="text-xs font-semibold uppercase tracking-widest text-cobalt-500">
            Your travel companion
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 leading-tight tracking-tight">
            {MYG_HERO.h1}
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-xl">{MYG_HERO.body}</p>
          <div className="flex flex-wrap items-center gap-4">
            <a
              href={MYG_LINKS.signup}
              className="inline-flex items-center gap-2 bg-cobalt-500 hover:bg-cobalt-600 text-white font-semibold px-7 py-3 rounded-lg transition-colors"
            >
              {MYG_HERO.primaryCta}
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </a>
            <a
              href={MYG_LINKS.signin}
              className="inline-flex items-center bg-white border border-slate-200 text-neutral-800 font-semibold px-7 py-3 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Sign in
            </a>
          </div>
        </div>
        <div className="flex-1">
          <img
            src={MYG_IMAGES.hero}
            alt="Six people holding a map"
            className="w-full h-64 md:h-[380px] object-cover rounded-xl"
          />
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: `V2Intro.tsx`:**

```tsx
import { MYG_INTRO } from "../../_shared/content";

export default function V2Intro() {
  return (
    <section className="bg-white px-4 sm:px-6 md:px-12 lg:px-20 py-16 md:py-24">
      <div className="max-w-3xl mx-auto text-center flex flex-col gap-4">
        <h2 className="text-3xl font-bold text-neutral-800 leading-tight tracking-tight">
          {MYG_INTRO.h2}
        </h2>
        <p className="text-lg text-slate-600 leading-relaxed">{MYG_INTRO.body}</p>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: `V2ProgramDiscovery.tsx`:**

```tsx
import { ArrowRight } from "lucide-react";
import { MYG_DISCOVERY, MYG_LINKS } from "../../_shared/content";

export default function V2ProgramDiscovery() {
  return (
    <section className="bg-slate-50 px-4 sm:px-6 md:px-12 lg:px-20 py-16 md:py-24">
      <div className="max-w-7xl mx-auto flex flex-col gap-10">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-wide text-cobalt-500 mb-2">
            Program discovery
          </p>
          <h2 className="text-3xl font-bold text-neutral-800 leading-tight tracking-tight">
            {MYG_DISCOVERY.h2}
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed mt-3">{MYG_DISCOVERY.sub}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {MYG_DISCOVERY.cards.map((card) => (
            <div
              key={card.title}
              className="flex flex-col gap-5 p-6 rounded-lg border border-slate-100 bg-white"
            >
              <div className="w-full h-40 flex items-center justify-center">
                <img src={card.img} alt={card.alt} className="h-full w-auto object-contain" />
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-lg font-semibold text-neutral-800">{card.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{card.body}</p>
              </div>
            </div>
          ))}
        </div>
        <a
          href={MYG_LINKS.search}
          className="inline-flex items-center gap-2 self-start bg-cobalt-500 hover:bg-cobalt-600 text-white font-semibold px-7 py-3 rounded-lg transition-colors"
        >
          {MYG_DISCOVERY.cta}
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: `V2TravelEssentials.tsx`:**

```tsx
import { ArrowRight } from "lucide-react";
import { MYG_ESSENTIALS, MYG_LINKS } from "../../_shared/content";

export default function V2TravelEssentials() {
  const { insurance, esim } = MYG_ESSENTIALS;
  return (
    <section className="bg-white px-4 sm:px-6 md:px-12 lg:px-20 py-16 md:py-24">
      <div className="max-w-7xl mx-auto flex flex-col gap-12">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-wide text-cobalt-500 mb-2">
            Travel essentials
          </p>
          <h2 className="text-3xl font-bold text-neutral-800 leading-tight tracking-tight">
            {MYG_ESSENTIALS.h2}
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed mt-3">{MYG_ESSENTIALS.sub}</p>
          <a
            href={MYG_LINKS.resources}
            className="inline-flex items-center gap-2 mt-4 text-sm font-semibold text-cobalt-500 hover:text-cobalt-600"
          >
            {MYG_ESSENTIALS.exploreCta}
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </a>
        </div>

        {/* Insurance card: illustration left, text right */}
        <div className="bg-slate-50 rounded-lg border border-slate-100 overflow-hidden flex flex-col md:flex-row">
          <div className="md:w-2/5 shrink-0 p-6 flex items-center justify-center">
            <img src={insurance.img} alt="Travel Insurance" className="h-48 w-auto object-contain" />
          </div>
          <div className="flex-1 p-8 md:p-10 flex flex-col gap-3">
            <h3 className="text-2xl font-bold text-neutral-900">{insurance.h3}</h3>
            <h4 className="text-base font-semibold text-slate-700">{insurance.h4}</h4>
            <p className="text-base text-slate-600 leading-relaxed">{insurance.body1}</p>
            <p className="text-base text-slate-600 leading-relaxed">{insurance.body2}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-6 h-6 rounded-full bg-slate-900" aria-hidden="true" />
              <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
                Trusted partner: {insurance.partner}
              </span>
            </div>
          </div>
        </div>

        {/* eSIM card: text left, static mock right */}
        <div className="bg-slate-50 rounded-lg border border-slate-100 overflow-hidden flex flex-col md:flex-row-reverse">
          <div className="md:w-2/5 shrink-0 p-6 flex items-center justify-center">
            <div className="w-full rounded-xl border border-slate-200 bg-white p-6 flex flex-col gap-4">
              <p className="text-sm font-semibold text-slate-700">Find a data plan</p>
              <div className="h-11 px-3 rounded-md border border-slate-200 bg-slate-50 flex items-center text-sm text-slate-400">
                Select a country
              </div>
              <button
                type="button"
                className="inline-flex items-center justify-center h-11 bg-cobalt-500 hover:bg-cobalt-600 text-white text-sm font-semibold rounded-md transition-colors cursor-pointer"
              >
                Buy Data Plan
              </button>
            </div>
          </div>
          <div className="flex-1 p-8 md:p-10 flex flex-col gap-3">
            <h3 className="text-2xl font-bold text-neutral-900">{esim.h3}</h3>
            <h4 className="text-base font-semibold text-slate-700">{esim.h4}</h4>
            <p className="text-base text-slate-600 leading-relaxed">{esim.body1}</p>
            <p className="text-base text-slate-600 leading-relaxed">{esim.body2}</p>
            <img src={esim.partnerLogo} alt="celitech logo" className="h-6 w-auto mt-1 object-contain self-start" />
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 5: `V2Faq.tsx`:**

```tsx
"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { MYG_FAQS } from "../../_shared/content";

export default function V2Faq() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section className="bg-slate-50 px-4 sm:px-6 md:px-12 lg:px-20 py-16 md:py-24">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-10 md:gap-20">
        <div className="flex-1 max-w-xs">
          <p className="text-xs font-semibold uppercase tracking-widest text-cobalt-500 mb-3">FAQ</p>
          <h2 className="text-2xl md:text-3xl font-bold text-neutral-800 leading-tight tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-base text-slate-600 leading-relaxed mt-4">
            Everything you need to know about GoAbroad and MyGoAbroad.
          </p>
        </div>
        <div className="flex-1">
          <div className="divide-y divide-slate-200">
            {MYG_FAQS.map((faq, idx) => {
              const isOpen = openIdx === idx;
              return (
                <div key={faq.question}>
                  <button
                    type="button"
                    onClick={() => setOpenIdx(isOpen ? null : idx)}
                    aria-expanded={isOpen}
                    className="w-full flex items-center justify-between gap-4 py-4 text-left text-sm font-semibold text-neutral-800 hover:text-cobalt-600 transition-colors cursor-pointer"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={`w-5 h-5 shrink-0 text-slate-400 transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                      aria-hidden="true"
                    />
                  </button>
                  {isOpen && (
                    <p className="pb-4 text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                      {faq.answer}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 6: `V2TravelResources.tsx`:**

```tsx
import { ArrowRight } from "lucide-react";
import { MYG_RESOURCES, MYG_LINKS } from "../../_shared/content";

export default function V2TravelResources() {
  return (
    <section className="bg-white px-4 sm:px-6 md:px-12 lg:px-20 py-16 md:py-24">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="flex flex-col order-first lg:order-last">
          <p className="text-xs font-semibold uppercase tracking-wide text-cobalt-500 mb-2">
            Partners
          </p>
          <h2 className="text-3xl font-bold text-neutral-800 leading-tight tracking-tight mb-4">
            {MYG_RESOURCES.h2}
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed max-w-lg mb-8">{MYG_RESOURCES.body}</p>
          <a
            href={MYG_LINKS.resources}
            className="inline-flex items-center gap-2 self-start bg-cobalt-500 hover:bg-cobalt-600 text-white font-semibold px-7 py-3 rounded-lg transition-colors"
          >
            {MYG_RESOURCES.cta}
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </a>
        </div>
        <div className="relative h-52 lg:h-80 flex items-center justify-center order-last lg:order-first">
          <img src={MYG_RESOURCES.img} alt="Travel Resources" className="h-full w-auto object-contain" />
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 7: `V2Signup.tsx`** (closing GetStarted-style band, sun-50):

```tsx
import { ArrowRight } from "lucide-react";
import { MYG_SIGNUP, MYG_LINKS } from "../../_shared/content";

export default function V2Signup() {
  return (
    <section className="bg-sun-50 px-4 sm:px-6 md:px-12 lg:px-20 py-24 md:py-36">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="relative h-64 lg:h-80 flex items-center justify-center order-first">
          <img src={MYG_SIGNUP.img} alt="Sign Up" className="h-full w-auto object-contain" />
        </div>
        <div className="flex flex-col order-last">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 leading-tight tracking-tight mb-4">
            {MYG_SIGNUP.h2}
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed max-w-md mb-8">{MYG_SIGNUP.body}</p>
          <div className="flex flex-wrap items-center gap-4">
            <a
              href={MYG_LINKS.signup}
              className="inline-flex items-center gap-2 bg-cobalt-500 hover:bg-cobalt-600 text-white font-semibold px-7 py-3 rounded-lg transition-colors"
            >
              {MYG_SIGNUP.primaryCta}
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </a>
            <a href={MYG_LINKS.signin} className="text-cobalt-600 font-semibold hover:underline">
              Sign in
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 8: `V2MyGoAbroadPage.tsx`:**

```tsx
import V2Hero from "./V2Hero";
import V2Intro from "./V2Intro";
import V2ProgramDiscovery from "./V2ProgramDiscovery";
import V2TravelEssentials from "./V2TravelEssentials";
import V2Faq from "./V2Faq";
import V2TravelResources from "./V2TravelResources";
import V2Signup from "./V2Signup";

export default function V2MyGoAbroadPage() {
  return (
    <div className="w-full">
      <V2Hero />
      <V2Intro />
      <V2ProgramDiscovery />
      <V2TravelEssentials />
      <V2Faq />
      <V2TravelResources />
      <V2Signup />
    </div>
  );
}
```

- [ ] **Step 9: Type-check + lint.** `npx tsc --noEmit` (PASS) and `npm run lint` (no new errors beyond acceptable `<img>` warnings).

- [ ] **Step 10 (user): Commit** — `feat(mygoabroad): v2 marketplace-styled redesign`

---

### Task 5: Orchestrator

**Files:** Create `app/mygoabroad/page.tsx`

- [ ] **Step 1: Create the orchestrator** (mirrors `app/marketplace/partner/page.tsx`):

```tsx
"use client";

import { Suspense } from "react";
import { useDesignVersion } from "@/lib/use-design-version";
import V1MyGoAbroadPage from "./_versions/v1/V1MyGoAbroadPage";
import V2MyGoAbroadPage from "./_versions/v2/V2MyGoAbroadPage";

function MyGoAbroadPageContent() {
  const { version } = useDesignVersion("mygoabroad");

  switch (version) {
    case "v2":
      return <V2MyGoAbroadPage />;
    default:
      return <V1MyGoAbroadPage />;
  }
}

export default function MyGoAbroadPage() {
  return (
    <Suspense>
      <MyGoAbroadPageContent />
    </Suspense>
  );
}
```

- [ ] **Step 2: Type-check + lint.** `npx tsc --noEmit` (PASS), `npm run lint` (clean).

- [ ] **Step 3 (user): Commit** — `feat(mygoabroad): orchestrator wiring`

---

### Task 6: Final verification (build + visual)

- [ ] **Step 1:** `npx tsc --noEmit` — Expected: PASS.
- [ ] **Step 2:** `npm run lint` — Expected: no new errors in `app/mygoabroad/**` (img-element warnings acceptable, consistent with repo).
- [ ] **Step 3: Visual (Chrome DevTools MCP).** With dev server running:
  - `/mygoabroad` (v1) — confirm all 7 sections render and closely match the source at `localhost:3030/mygoabroad`: hero (logo, photo, roman CTA), intro, 3 discovery cards + "Begin Your Search", insurance + eSIM mock blocks, FAQ accordion (7), slate Travel Resources band, slate-50 signup band. Confirm the 6 SVGs and the 3 CDN images load.
  - `/mygoabroad?v=v2` — confirm the marketplace-styled redesign: eyebrow labels, section-rhythm backgrounds, bordered cards, sun-50 closing band; same copy/FAQ.
  - Confirm the version switcher (v1 | v2) appears on the page.
  - Mobile (~390px): sections stack, grids collapse, images scale.

---

## Self-review

**Spec coverage:**
- Versioned route `mygoabroad` v1+v2 default v1 → Task 1 (registry) + Task 5 (orchestrator). ✓
- Switcher path mapping → Task 1. ✓
- 6 SVG assets copied; CDN images via `<img>` → Task 1 + content.ts (Task 2). ✓
- Shared copy + 7 FAQs in `content.ts` → Task 2. ✓
- 7 sections, both versions → Tasks 3 (v1) + 4 (v2). ✓
- Static eSIM/insurance mocks; non-functional external CTA links → Tasks 3/4 (no forms, `<a href>` to MYG_LINKS). ✓
- v1 token mapping (secondary→roman etc.); v2 marketplace patterns → Tasks 3/4 styling. ✓
- PrototypeShell layout → Task 1. ✓
- Verification → Task 6. ✓

**Placeholder scan:** No TBD/TODO; all section code complete. The `react-icons/fi` fallback (→ lucide `ArrowRight`) is an explicit, actionable instruction, not a placeholder.

**Type consistency:** `content.ts` export names (`MYG_HERO`, `MYG_INTRO`, `MYG_DISCOVERY`, `MYG_ESSENTIALS`, `MYG_RESOURCES`, `MYG_SIGNUP`, `MYG_FAQS`, `MYG_IMAGES`, `MYG_LINKS`) are used identically across v1/v2 components. Orchestrator imports `V1MyGoAbroadPage`/`V2MyGoAbroadPage` matching the files created in Tasks 3/4. `MyGFaq` shape (`question`/`answer`) consistent in both FAQ components.

**Interim state:** Task 5's orchestrator imports both version pages; it's created last (after Tasks 3+4), so no missing-import interim error. Tasks 3 and 4 are independently type-checkable (they only depend on `content.ts` from Task 2).
