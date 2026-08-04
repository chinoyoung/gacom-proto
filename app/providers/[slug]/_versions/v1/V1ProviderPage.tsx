"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Provider, ProviderProgram, ProviderReview } from "../../_components/types";
import StickyProviderHeader from "../../_components/StickyProviderHeader";
import MobileStickyBar from "../../_components/MobileStickyBar";
import V1ProviderHero from "./V1ProviderHero";
import V1ProviderTrustBar from "./V1ProviderTrustBar";
import V1ProviderInPageNav from "./V1ProviderInPageNav";
import V1ProviderAbout from "./V1ProviderAbout";
import V1ProviderInfoCard from "./V1ProviderInfoCard";
import V1ProviderPrograms from "./V1ProviderPrograms";
import V1ProviderMediaGallery from "./V1ProviderMediaGallery";
import V1ProviderReviews from "./V1ProviderReviews";
import V1ProviderInquire from "./V1ProviderInquire";
import V1ProviderFAQ from "./V1ProviderFAQ";
import V1ProviderInterviews from "./V1ProviderInterviews";
import V1ProviderBottomCTA from "./V1ProviderBottomCTA";
import V1ProviderRecognitions from "./V1ProviderRecognitions";
import V1HelpSection from "@/app/programs/[id]/_versions/v1/V1HelpSection";
import V1ProviderArticles from "./V1ProviderArticles";

interface V1ProviderPageProps {
  provider: Provider;
  programs: ProviderProgram[] | undefined;
  reviews: ProviderReview[] | undefined;
  avgRating: number;
}

export default function V1ProviderPage({ provider, programs, reviews, avgRating }: V1ProviderPageProps) {
  const reviewCount = reviews?.length ?? 0;
  const programCount = programs?.length ?? 0;
  const hasGallery = provider.photos.length > 0;
  const hasFAQ = provider.faqs.length > 0;

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

  const navItems = useMemo(
    () =>
      [
        { id: "overview", label: "Overview" },
        reviewCount > 0 && { id: "reviews", label: "Reviews" },
        programCount > 0 && { id: "programs", label: "Programs" },
        hasGallery && { id: "gallery", label: "Gallery" },
        { id: "inquire", label: "Inquire" },
        hasFAQ && { id: "faqs", label: "FAQs" },
        { id: "recognitions", label: "Recognitions" },
      ].filter(Boolean) as { id: string; label: string }[],
    [reviewCount, programCount, hasGallery, hasFAQ]
  );

  return (
    <>
      <StickyProviderHeader
        provider={provider}
        visible={stickyVisible}
        avgRating={avgRating}
        onInquire={scrollToInquire}
      />

      <main className="flex flex-col items-center gap-20 pb-20 text-neutral-800">
        <div className="flex w-full flex-col items-center">
          <div id="program-hero" className="w-full" ref={heroRef}>
            <V1ProviderHero
              provider={provider}
              avgRating={avgRating}
              reviewCount={reviewCount}
              onInquire={scrollToInquire}
              programCount={programCount}
            />
          </div>

          <div className="w-full bg-gradient-to-b from-slate-100 from-50% to-white to-50%">
            <div className="w-full mx-auto max-w-7xl px-4 xl:px-0 py-5">
              <V1ProviderTrustBar
                provider={provider}
                avgRating={avgRating}
                reviewCount={reviewCount}
                programCount={programCount}
              />
            </div>
          </div>
        </div>

        <V1ProviderInPageNav items={navItems} />

        <div className="flex w-full max-w-7xl flex-col gap-20">
          <section id="overview" className="mx-auto w-full max-w-7xl px-4 xl:px-0">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
              <div className="min-w-0 flex-1 space-y-12">
                <V1ProviderAbout provider={provider} />
              </div>
              <div className="w-full shrink-0 lg:sticky lg:top-20 lg:w-[380px] lg:self-start">
                <V1ProviderInfoCard provider={provider} programCount={programCount} onInquire={scrollToInquire} />
              </div>
            </div>
          </section>

          <section id="reviews" className="mx-auto w-full max-w-7xl px-4 xl:px-0 scroll-mt-36">
            <V1ProviderReviews provider={provider} reviews={reviews} avgRating={avgRating} />
          </section>

          {programCount > 0 && (
            <section id="programs" className="mx-auto w-full max-w-7xl">
              <V1ProviderPrograms provider={provider} programs={programs} />
            </section>
          )}

          {hasGallery && (
            <section id="gallery" className="mx-auto w-full max-w-7xl px-4 xl:px-0">
              <V1ProviderMediaGallery provider={provider} />
            </section>
          )}
        </div>

        <div className="w-full bg-slate-100 py-16">
          <section id="inquire" className="mx-auto w-full max-w-7xl px-4 xl:px-0 scroll-mt-36">
            <V1ProviderInquire provider={provider} programs={programs} />
          </section>
        </div>

        <div className="flex w-full max-w-7xl flex-col gap-20">
          {hasFAQ && (
            <section id="faqs" className="mx-auto w-full max-w-7xl px-4 xl:px-0 scroll-mt-36">
              <V1ProviderFAQ provider={provider} />
            </section>
          )}

          <section className="mx-auto w-full max-w-7xl px-4 xl:px-0">
            <V1HelpSection
              heading={`Have questions about ${provider.name}?`}
              description={`Our advisors can help you compare ${provider.name}'s programs and find the right fit.`}
            />
          </section>

          <V1ProviderInterviews providerName={provider.name} />

          <V1ProviderBottomCTA provider={provider} avgRating={avgRating} />

          <V1ProviderArticles />

          <section id="recognitions" className="mx-auto w-full max-w-7xl px-4 xl:px-0">
            <V1ProviderRecognitions provider={provider} />
          </section>
        </div>
      </main>

      <MobileStickyBar provider={provider} onInquire={scrollToInquire} />
    </>
  );
}
