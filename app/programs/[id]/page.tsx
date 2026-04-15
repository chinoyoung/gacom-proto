"use client";

import { useParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useDesignVersion } from "@/lib/use-design-version";

import LoadingSkeleton from "./_components/LoadingSkeleton";
import ProgramNotFound from "./_components/ProgramNotFound";
import DefaultDetailPage from "./_components/DefaultDetailPage";
import ModernDetailPage from "./_versions/modern/ModernDetailPage";
import InquiryDetailPage from "./_versions/inquiry/InquiryDetailPage";

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
    case "modern":
      return <ModernDetailPage program={program} reviews={reviews} avgRating={avgRating} />;
    case "inquiry":
      return <InquiryDetailPage program={program} reviews={reviews} avgRating={avgRating} />;
    default:
      return (
        <DefaultDetailPage
          program={program}
          reviews={reviews}
          avgRating={avgRating}
        />
      );
  }
}
