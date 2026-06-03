"use client";

import { useState, useEffect, useRef } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

import type { Program } from "../../_components/types";
import StickyProgramHeader from "../../_components/StickyProgramHeader";
import MobileStickyBar from "../../_components/MobileStickyBar";
import WhyChooseProgram from "../../_components/WhyChooseProgram";
import ProgramDetails from "../../_components/ProgramDetails";
import RelatedPrograms from "../../_components/RelatedPrograms";
import ProgramArticles from "../../_components/ProgramArticles";

import TrustBar from "./V5TrustBar";
import { buildFaqs, FAQsSection, InterviewsSection } from "../v1/SupportSections";
import { BottomInquirySection } from "../v1/BottomInquirySection";

import V5Hero from "./V5Hero";
import V5Overview from "./V5Overview";
import V5AnchorCTA from "./V5AnchorCTA";
import V5Highlights from "./V5Highlights";
import V5WhatsIncluded from "./V5WhatsIncluded";
import V5Sidebar from "./V5Sidebar";
import V5MediaGallery from "./V5MediaGallery";
import V5Reviews, { type Review } from "./V5Reviews";
import V5Recognitions from "./V5Recognitions";
import V5HelpSection from "./V5HelpSection";

interface V5DetailPageProps {
  program: Program;
  reviews: Review[] | undefined;
  avgRating: number;
}

export default function V5DetailPage({
  program,
  reviews,
  avgRating,
}: V5DetailPageProps) {
  const reviewCount = reviews?.length ?? 0;
  const faqs = buildFaqs(program);

  const allPrograms = useQuery(api.programs.listPrograms, { status: "published" });
  const programCount = allPrograms?.length ?? 0;

  const [saved, setSaved] = useState(false);
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
          <V5Hero
            program={program}
            avgRating={avgRating}
            reviewCount={reviewCount}
            saved={saved}
            onToggleSave={() => setSaved((v) => !v)}
          />
        </div>

        {/* Trust bar — straddles the hero/content seam (half slate, half white) */}
        <div className="bg-gradient-to-b from-slate-100 from-50% to-white to-50%">
          <div className="w-full mx-auto max-w-7xl px-4 xl:px-0 py-8">
            <TrustBar
              program={program}
              avgRating={avgRating}
              reviewCount={reviewCount}
              programCount={programCount}
            />
          </div>
        </div>

        {/* Two-column layout */}
        <div className="w-full max-w-7xl mx-auto mt-12 px-4 xl:px-0 flex flex-col lg:flex-row gap-8 items-start">
          {/* Left column */}
          <div className="flex-1 min-w-0 space-y-12">
            <V5Overview program={program} />
            <V5AnchorCTA />
            <V5Highlights program={program} />
            <V5WhatsIncluded program={program} />
          </div>

          {/* Right sidebar */}
          <div className="w-full lg:w-[380px] shrink-0 lg:sticky lg:top-20 lg:self-start">
            <V5Sidebar program={program} />
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
          <ProgramDetails program={program} />
        </section>

        {/* Media Gallery */}
        {program.photos.length > 0 && (
          <section className="w-full max-w-7xl mx-auto mt-20 px-4 xl:px-0">
            <V5MediaGallery program={program} />
          </section>
        )}

        {/* Reviews */}
        <section id="reviews" className="w-full max-w-7xl mx-auto mt-20 px-4 xl:px-0">
          <V5Reviews
            reviews={reviews}
            avgRating={avgRating}
            provider={program.provider}
            aiSummary={program.aiSummary}
          />
        </section>

        {/* FAQs */}
        {faqs.length > 0 && (
          <section id="faqs" className="w-full max-w-7xl mx-auto mt-20 px-4 xl:px-0">
            <div className="bg-slate-50 rounded-md py-8 px-4">
              <FAQsSection faqs={faqs} />
            </div>
          </section>
        )}

        {/* Interviews */}
        <section id="interviews" className="w-full max-w-7xl mx-auto mt-20 px-4 xl:px-0">
          <InterviewsSection />
        </section>

        {/* Recognitions */}
        <section id="recognitions" className="w-full max-w-7xl mx-auto mt-20 px-4 xl:px-0">
          <V5Recognitions />
        </section>

        {/* Bottom inquiry — provider callout with form */}
        <BottomInquirySection program={program} />

        {/* Help section */}
        <section className="w-full max-w-7xl mx-auto mt-20 px-4 xl:px-0">
          <V5HelpSection />
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

      <MobileStickyBar program={program} />
    </>
  );
}
