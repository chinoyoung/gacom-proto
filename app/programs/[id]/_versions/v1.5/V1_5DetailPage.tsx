"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

import type { Program } from "../../_components/types";
import ProgramArticles from "../../_components/ProgramArticles";

import { StickyHeader } from "./StickyHeader";
import { StickyBottomNav, NAV_LINKS } from "./StickyBottomNav";
import { HeroSection } from "./HeroSection";
import { DescriptionSection } from "./DescriptionSection";
import { PricingSection } from "./PricingSection";
import { ReviewsSection } from "./ReviewsSection";
import { ProgramDetailsSection } from "./ProgramDetailsSection";
import { buildFaqs, FAQsSection, InterviewsSection, ProgramsSection } from "./SupportSections";
import { InquiryFormSection } from "./InquiryFormSection";

interface V1_5DetailPageProps {
  program: Program;
  reviews: any[] | undefined;
  avgRating: number;
}

export default function V1_5DetailPage({
  program,
  reviews,
  avgRating,
}: V1_5DetailPageProps) {
  const reviewCount = reviews?.length ?? 0;
  const faqs = buildFaqs(program);

  // Query all programs for hero program count
  const allPrograms = useQuery(api.programs.listPrograms, {
    status: "published",
  });
  const programCount = allPrograms?.length ?? 0;

  // Sticky header: show when scrollY > 600, hide near bottom
  const [stickyHeaderVisible, setStickyHeaderVisible] = useState(false);
  // Sticky bottom nav: show when scrollY > 500
  const [bottomNavVisible, setBottomNavVisible] = useState(false);
  // Active hash for bottom nav
  const [activeHash, setActiveHash] = useState("#overview");

  // Section refs for active hash detection
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  const registerSection = useCallback(
    (hash: string) => (el: HTMLElement | null) => {
      sectionRefs.current[hash] = el;
    },
    []
  );

  useEffect(() => {
    function onScroll() {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight;
      const winHeight = window.innerHeight;
      const nearBottom = scrollY + winHeight >= docHeight - 100;

      setStickyHeaderVisible(scrollY > 600 && !nearBottom);
      setBottomNavVisible(scrollY > 500);

      // Determine active section
      let currentHash = "#overview";
      for (const link of NAV_LINKS) {
        const el = sectionRefs.current[link.hash];
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 120) {
            currentHash = link.hash;
          }
        }
      }
      setActiveHash(currentHash);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <main className="flex flex-col text-neutral-800 mb-12">
      {/* Sticky header (fixed top) */}
      <StickyHeader
        program={program}
        avgRating={avgRating}
        visible={stickyHeaderVisible}
      />

      {/* Sticky bottom nav */}
      <StickyBottomNav visible={bottomNavVisible} activeHash={activeHash} />

      {/* Hero (includes breadcrumbs) */}
      <HeroSection
        program={program}
        avgRating={avgRating}
        reviewCount={reviewCount}
        programCount={programCount}
      />

      {/* Description (two-column with sidebar) */}
      <section
        ref={registerSection("#overview")}
        className="w-full mx-auto max-w-7xl mt-4"
      >
        <DescriptionSection program={program} />
      </section>

      {/* Pricing */}
      <section
        id="pricing"
        ref={registerSection("#pricing")}
        className="w-full max-w-7xl mx-auto mt-4 lg:mt-8"
      >
        <PricingSection program={program} />
      </section>

      {/* Reviews */}
      <section
        id="reviews"
        ref={registerSection("#reviews")}
        className="w-full max-w-7xl mx-auto mt-4 lg:mt-8"
      >
        <ReviewsSection
          reviews={reviews}
          avgRating={avgRating}
          provider={program.provider}
        />
      </section>

      {/* Program Details */}
      <section
        id="details"
        ref={registerSection("#details")}
        className="w-full max-w-7xl mx-auto mt-4 lg:mt-8"
      >
        <ProgramDetailsSection program={program} />
      </section>

      {/* FAQs */}
      {faqs.length > 0 && (
        <section
          id="faqs"
          ref={registerSection("#faqs")}
          className="w-full max-w-7xl mx-auto mt-4 lg:mt-8"
        >
          <div className="bg-slate-50 rounded-md py-8">
            <FAQsSection faqs={faqs} />
          </div>
        </section>
      )}

      {/* Interviews */}
      <section
        id="interviews"
        ref={registerSection("#interviews")}
        className="w-full max-w-7xl mx-auto mt-4 lg:mt-8"
      >
        <InterviewsSection />
      </section>

      {/* Inquiry Form */}
      <section
        id="inquiry"
        ref={registerSection("#inquiry")}
        className="w-full max-w-7xl mx-auto mt-4 lg:mt-8"
      >
        <InquiryFormSection program={program} />
      </section>

      {/* Related Programs */}
      <section
        id="programs"
        ref={registerSection("#programs")}
        className="w-full max-w-7xl mx-auto mt-4 lg:mt-8"
      >
        <ProgramsSection currentProgramId={program._id} />
      </section>

      {/* Articles */}
      <section className="w-full max-w-7xl mx-auto mt-4 lg:mt-8 px-4 xl:px-0 [&>section]:mt-0 [&>section]:pt-0 [&>section]:border-t-0">
        <ProgramArticles />
      </section>

      {/* Bottom padding to clear sticky nav */}
      <div className="h-20" />
    </main>
  );
}
