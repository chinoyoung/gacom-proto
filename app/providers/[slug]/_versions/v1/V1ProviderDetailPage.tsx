"use client";

import type { Provider, ProviderReview, ProviderProgram } from "../../_components/types";
import V1ProviderHero from "./V1ProviderHero";
import V1ProviderTrustBar from "./V1ProviderTrustBar";
import V1ProviderAbout from "./V1ProviderAbout";
import V1ProviderPrograms from "./V1ProviderPrograms";
import V1ProviderReviews from "./V1ProviderReviews";
import V1ProviderGallery from "./V1ProviderGallery";
import V1ProviderFAQ from "./V1ProviderFAQ";
import V1ProviderAwards from "./V1ProviderAwards";
import V1ProviderInquiry from "./V1ProviderInquiry";

interface Props {
  provider: Provider;
  programs: ProviderProgram[];
  reviews: ProviderReview[];
  avgRating: number;
  reviewCount: number;
}

export default function V1ProviderDetailPage({
  provider,
  programs,
  reviews,
  avgRating,
  reviewCount,
}: Props) {
  const countryCount = new Set(programs.map((p) => p.country).filter(Boolean)).size;

  return (
    <main className="pb-20 text-neutral-800">
      <V1ProviderHero provider={provider} avgRating={avgRating} reviewCount={reviewCount} />

      <div className="max-w-7xl mx-auto px-4 xl:px-0 -mt-6">
        <V1ProviderTrustBar
          programCount={programs.length}
          avgRating={avgRating}
          reviewCount={reviewCount}
          countryCount={countryCount}
          yearFounded={provider.yearFounded}
        />
      </div>

      <section className="max-w-7xl mx-auto mt-16 px-4 xl:px-0">
        <V1ProviderAbout provider={provider} />
      </section>

      <section className="max-w-7xl mx-auto mt-16 px-4 xl:px-0">
        <V1ProviderPrograms providerName={provider.name} programs={programs} />
      </section>

      <section className="max-w-7xl mx-auto mt-16 px-4 xl:px-0">
        <V1ProviderReviews reviews={reviews} avgRating={avgRating} reviewCount={reviewCount} />
      </section>

      <section className="max-w-7xl mx-auto mt-16 px-4 xl:px-0">
        <V1ProviderGallery photos={provider.photos} />
      </section>

      <section className="max-w-7xl mx-auto mt-16 px-4 xl:px-0">
        <V1ProviderFAQ faqs={provider.faqs} />
      </section>

      <section className="max-w-7xl mx-auto mt-16 px-4 xl:px-0">
        <V1ProviderAwards awards={provider.awards} />
      </section>

      <section className="max-w-7xl mx-auto mt-16 px-4 xl:px-0">
        <V1ProviderInquiry provider={provider} />
      </section>
    </main>
  );
}
