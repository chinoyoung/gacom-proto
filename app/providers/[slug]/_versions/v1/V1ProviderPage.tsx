"use client";

import { useState, useEffect, useRef } from "react";
import type { Provider, ProviderProgram, ProviderReview } from "../../_components/types";
import StickyProviderHeader from "../../_components/StickyProviderHeader";
import MobileStickyBar from "../../_components/MobileStickyBar";
import V1ProviderHero from "./V1ProviderHero";
import V1ProviderTrustBar from "./V1ProviderTrustBar";
import V1ProviderAbout from "./V1ProviderAbout";
import V1WhyChooseProvider from "./V1WhyChooseProvider";
import V1ProviderInfoCard from "./V1ProviderInfoCard";
import V1ProviderPrograms from "./V1ProviderPrograms";
import V1ProviderMediaGallery from "./V1ProviderMediaGallery";
import V1ProviderReviews from "./V1ProviderReviews";
import V1ProviderInquire from "./V1ProviderInquire";
import V1ProviderFAQ from "./V1ProviderFAQ";
import V1ProviderRecognitions from "./V1ProviderRecognitions";
import V1HelpSection from "@/app/programs/[id]/_versions/v1/V1HelpSection";
import ProgramArticles from "@/app/programs/[id]/_components/ProgramArticles";

interface V1ProviderPageProps {
  provider: Provider;
  programs: ProviderProgram[] | undefined;
  reviews: ProviderReview[] | undefined;
  avgRating: number;
}

export default function V1ProviderPage({ provider, programs, reviews, avgRating }: V1ProviderPageProps) {
  const reviewCount = reviews?.length ?? 0;
  const programCount = programs?.length ?? 0;

  const [saved, setSaved] = useState(false);
  const [stickyVisible, setStickyVisible] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  const scrollToInquire = () =>
    document.getElementById("inquire")?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setStickyVisible(!entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [provider]);

  return (
    <>
      <StickyProviderHeader
        provider={provider}
        visible={stickyVisible}
        avgRating={avgRating}
        reviewCount={reviewCount}
        onInquire={scrollToInquire}
      />

      <main className="pb-20 text-neutral-800">
        <div ref={heroRef}>
          <V1ProviderHero
            provider={provider}
            avgRating={avgRating}
            reviewCount={reviewCount}
            saved={saved}
            onToggleSave={() => setSaved((v) => !v)}
            onInquire={scrollToInquire}
            programCount={programCount}
          />
        </div>

        <div className="bg-gradient-to-b from-slate-100 from-50% to-white to-50%">
          <div className="w-full mx-auto max-w-7xl px-4 xl:px-0 py-5">
            <V1ProviderTrustBar
              provider={provider}
              avgRating={avgRating}
              reviewCount={reviewCount}
              programCount={programCount}
            />
          </div>
        </div>

        {/* Two-column: about + info card */}
        <div className="w-full max-w-7xl mx-auto mt-8 px-4 xl:px-0 flex flex-col lg:flex-row gap-8 items-start">
          <div className="flex-1 min-w-0 space-y-12">
            <V1ProviderAbout provider={provider} />
            <V1WhyChooseProvider provider={provider} />
          </div>
          <div className="w-full lg:w-[380px] shrink-0 lg:sticky lg:top-20 lg:self-start">
            <V1ProviderInfoCard provider={provider} programCount={programCount} onInquire={scrollToInquire} />
          </div>
        </div>

        <V1ProviderPrograms provider={provider} programs={programs} />

        {provider.photos.length > 0 && (
          <section className="w-full max-w-7xl mx-auto mt-20 px-4 xl:px-0">
            <V1ProviderMediaGallery provider={provider} />
          </section>
        )}

        <section id="reviews" className="w-full max-w-7xl mx-auto mt-20 px-4 xl:px-0 scroll-mt-36">
          <V1ProviderReviews provider={provider} reviews={reviews} avgRating={avgRating} />
        </section>

        {/* Inquire */}
        <div className="mt-20 bg-slate-100 py-16">
          <section id="inquire" className="w-full max-w-7xl mx-auto px-4 xl:px-0 scroll-mt-36">
            <V1ProviderInquire provider={provider} programs={programs} />
          </section>
        </div>

        {/* FAQs */}
        <V1ProviderFAQ provider={provider} />

        {/* Recognitions */}
        <section className="w-full max-w-7xl mx-auto mt-20 px-4 xl:px-0">
          <V1ProviderRecognitions provider={provider} />
        </section>

        {/* Help */}
        <section className="w-full max-w-7xl mx-auto mt-20 px-4 xl:px-0">
          <V1HelpSection />
        </section>

        {/* Articles */}
        <section className="w-full max-w-7xl mx-auto mt-20 px-4 xl:px-0 [&_section]:mt-0 [&_section]:pt-0 [&_section]:border-t-0">
          <ProgramArticles />
        </section>
      </main>

      <MobileStickyBar provider={provider} onInquire={scrollToInquire} />
    </>
  );
}
