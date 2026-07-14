"use client";

import { useParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useDesignVersion } from "@/lib/use-design-version";

import type { Provider, ProviderProgram, ProviderReview } from "./_components/types";
import LoadingSkeleton from "./_components/LoadingSkeleton";
import ProviderNotFound from "./_components/ProviderNotFound";
import V1ProviderPage from "./_versions/v1/V1ProviderPage";

export default function ProviderDetailPage() {
  const { version } = useDesignVersion("provider-detail");
  const params = useParams();
  const slug = params?.slug as string | undefined;

  const provider = useQuery(
    api.providers.getProviderBySlug,
    slug ? { slug } : "skip"
  ) as Provider | null | undefined;

  const programs = useQuery(
    api.providers.listProgramsByProvider,
    provider ? { providerName: provider.name, status: "published" } : "skip"
  ) as ProviderProgram[] | undefined;

  const reviews = useQuery(
    api.providers.listReviewsByProvider,
    provider ? { providerName: provider.name } : "skip"
  ) as ProviderReview[] | undefined;

  const avgRating =
    reviews && reviews.length > 0
      ? Math.round(
          (reviews.reduce((sum, r) => sum + (r.overallRating ?? 0), 0) /
            reviews.length) *
            100
        ) / 100
      : 0;

  if (provider === undefined) return <LoadingSkeleton />;
  if (provider === null) return <ProviderNotFound />;

  switch (version) {
    default:
      return (
        <V1ProviderPage
          provider={provider}
          programs={programs}
          reviews={reviews}
          avgRating={avgRating}
        />
      );
  }
}
