"use client";

import { useParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useDesignVersion } from "@/lib/use-design-version";

import LoadingSkeleton from "./_components/LoadingSkeleton";
import ProgramNotFound from "./_components/ProgramNotFound";
import V1DetailPage from "./_versions/v1/V1DetailPage";
import V2DetailPage from "./_versions/v2/V2DetailPage";
import V3DetailPage from "./_versions/v3/V3DetailPage";
import V4DetailPage from "./_versions/v4/V4DetailPage";
import V5DetailPage from "./_versions/v5/V5DetailPage";
import Reviews2026DetailPage from "./_versions/v6/Reviews2026DetailPage";

export default function ProgramDetailPage() {
  const { version } = useDesignVersion("program-detail");
  const params = useParams();
  const slug = params?.id as string | undefined;

  const program = useQuery(
    api.programs.getBySlug,
    slug ? { slug } : "skip"
  );

  const reviews = useQuery(
    api.reviews.listReviewsByProgram,
    program?._id
      ? { programId: program._id as Id<"programs">, status: "published" }
      : "skip"
  );

  const avgRating =
    reviews && reviews.length > 0
      ? Math.round(
          (reviews.reduce((sum, r) => sum + r.overallRating, 0) /
            reviews.length) *
            100
        ) / 100
      : 0;

  if (program === undefined) {
    return <LoadingSkeleton />;
  }

  if (program === null) {
    return <ProgramNotFound />;
  }

  switch (version) {
    case "v2":
      return <V2DetailPage program={program} reviews={reviews} avgRating={avgRating} />;
    case "v3":
      return <V3DetailPage program={program} reviews={reviews} avgRating={avgRating} />;
    case "v4":
      return <V4DetailPage program={program} reviews={reviews} avgRating={avgRating} />;
    case "v5":
      return <V5DetailPage program={program} reviews={reviews} avgRating={avgRating} />;
    case "v6":
      return <Reviews2026DetailPage program={program} reviews={reviews} avgRating={avgRating} />;
    default:
      return <V1DetailPage program={program} reviews={reviews} avgRating={avgRating} />;
  }
}
