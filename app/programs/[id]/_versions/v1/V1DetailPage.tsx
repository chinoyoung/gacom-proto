"use client";

import { useState, useEffect, useRef } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

import type { Program } from "../../_components/types";
import StickyProgramHeader from "../../_components/StickyProgramHeader";
import MobileStickyBar from "../../_components/MobileStickyBar";
import WhyChooseProgram from "../../_components/WhyChooseProgram";
import V1ProgramDetails from "./V1ProgramDetails";
import RelatedPrograms from "../../_components/RelatedPrograms";
import ProgramArticles from "../../_components/ProgramArticles";

import TrustBar from "./V1TrustBar";
import { buildFaqs } from "../../_components/SupportSections";
import V1InterviewsSection from "./V1InterviewsSection";

import V1Hero from "./V1Hero";
import V1Overview from "./V1Overview";
import V1AnchorCTA from "./V1AnchorCTA";
import V1Highlights from "./V1Highlights";
import V1WhatsIncluded from "./V1WhatsIncluded";
import V1Sidebar from "./V1Sidebar";
import V1MediaGallery from "./V1MediaGallery";
import V1FAQ from "./V1FAQ";
import V1Recognitions from "./V1Recognitions";
import V1HelpSection from "./V1HelpSection";
import type { Review } from "../../_components/types";

import V1ReviewsSection from "./V1ReviewsSection";
import V1ApplyWizardSection from "./V1ApplyWizardSection";
import V1ApplyModal from "./V1ApplyModal";
import V1ApplyInlineSection from "./V1ApplyInlineSection";

interface V1DetailPageProps {
  program: Program;
  reviews: Review[] | undefined;
  avgRating: number;
}

export default function V1DetailPage({
  program,
  reviews,
  avgRating,
}: V1DetailPageProps) {
  const reviewCount = reviews?.length ?? 0;
  const faqs = buildFaqs(program);

  const allPrograms = useQuery(api.programs.listPrograms, { status: "published" });
  const programCount = allPrograms?.length ?? 0;

  const [saved, setSaved] = useState(false);
  const [applyOpen, setApplyOpen] = useState(false);
  const [stickyVisible, setStickyVisible] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setStickyVisible(!entry.isIntersecting);
      },
      { threshold: 0 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [program]);

  return (
    <>
      <StickyProgramHeader
        program={program}
        visible={stickyVisible}
        saved={saved}
        onToggleSave={() => setSaved((v) => !v)}
        avgRating={avgRating}
        reviewCount={reviewCount}
      />

      <main className="pb-20 text-neutral-800">
        {/* Hero — observed to trigger sticky header */}
        <div ref={heroRef}>
          <V1Hero
            program={program}
            avgRating={avgRating}
            reviewCount={reviewCount}
            saved={saved}
            onToggleSave={() => setSaved((v) => !v)}
            onInquire={() => setApplyOpen(true)}
          />
        </div>

        {/* Trust bar — straddles the hero/content seam (half slate, half white) */}
        <div className="bg-gradient-to-b from-slate-100 from-50% to-white to-50%">
          <div className="w-full mx-auto max-w-7xl px-4 xl:px-0 py-5">
            <TrustBar
              program={program}
              avgRating={avgRating}
              reviewCount={reviewCount}
              programCount={programCount}
            />
          </div>
        </div>

        {/* Two-column layout */}
        <div className="w-full max-w-7xl mx-auto mt-8 px-4 xl:px-0 flex flex-col lg:flex-row gap-8 items-start">
          {/* Left column */}
          <div className="flex-1 min-w-0 space-y-12">
            <V1Overview program={program} />
            <V1AnchorCTA />
            <V1Highlights program={program} />
            <V1WhatsIncluded program={program} />
          </div>

          {/* Right sidebar */}
          <div className="w-full lg:w-[380px] shrink-0 lg:sticky lg:top-20 lg:self-start">
            <V1Sidebar program={program} />
          </div>
        </div>

        {/* Why Choose Program */}
        <section className="w-full max-w-7xl mx-auto mt-20 px-4 xl:px-0">
          <WhyChooseProgram
            program={program}
            avgRating={avgRating}
            totalReviews={reviews?.length ?? 0}
          />
        </section>

        {/* Program Details — anchor target */}
        <section id="details" className="w-full max-w-7xl mx-auto mt-20 px-4 xl:px-0">
          <V1ProgramDetails program={program} />
        </section>

        {/* Media Gallery */}
        {program.photos.length > 0 && (
          <section className="w-full max-w-7xl mx-auto mt-20 px-4 xl:px-0">
            <V1MediaGallery program={program} />
          </section>
        )}

        {/* Reviews 2026 — redesigned placeholder */}
        <section id="reviews" className="w-full max-w-7xl mx-auto mt-20 px-4 xl:px-0 scroll-mt-36">
          <V1ReviewsSection
            program={program}
            reviews={reviews}
            avgRating={avgRating}
          />
        </section>

        {/* Apply to this program — inline form (separate instance from the modal) */}
        <section id="apply" className="w-full max-w-7xl mx-auto mt-20 px-4 xl:px-0 scroll-mt-36">
          <V1ApplyInlineSection program={program} />
        </section>

        {/* Apply step by step — one question per step variant */}
        <section id="apply-guided" className="w-full max-w-7xl mx-auto mt-20 px-4 xl:px-0 scroll-mt-36">
          <V1ApplyWizardSection program={program} />
        </section>

        {/* FAQs */}
        <V1FAQ faqs={faqs} />

        {/* Interviews */}
        <section id="interviews" className="w-full max-w-7xl mx-auto mt-20 px-4 xl:px-0">
          <V1InterviewsSection programId={program._id} />
        </section>

        {/* Recognitions */}
        <section id="recognitions" className="w-full max-w-7xl mx-auto mt-20 px-4 xl:px-0">
          <V1Recognitions />
        </section>

        {/* Help section */}
        <section className="w-full max-w-7xl mx-auto mt-20 px-4 xl:px-0">
          <V1HelpSection />
        </section>

        {/* Related Programs */}
        <section className="w-full max-w-7xl mx-auto mt-20 px-4 xl:px-0 [&_section]:mt-0 [&_section]:pt-0 [&_section]:border-t-0">
          <RelatedPrograms
            currentProgramId={program._id}
            subjectAreas={program.subjectAreas ?? []}
          />
        </section>

        {/* Articles */}
        <section className="w-full max-w-7xl mx-auto mt-20 px-4 xl:px-0 [&_section]:mt-0 [&_section]:pt-0 [&_section]:border-t-0">
          <ProgramArticles />
        </section>
      </main>

      <MobileStickyBar program={program} onInquire={() => setApplyOpen(true)} />
      <V1ApplyModal open={applyOpen} onClose={() => setApplyOpen(false)} program={program} />
    </>
  );
}
