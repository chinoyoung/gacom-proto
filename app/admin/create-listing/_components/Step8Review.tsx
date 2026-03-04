"use client";

import { Id } from "@/convex/_generated/dataModel";

interface ProgramFormData {
  title: string;
  provider: string;
  tagline: string;
  hostInstitution: string;
  city: string;
  country: string;
  terms: string[];
  duration: string;
  educationLevels: string[];
  eligibleNationalities: string[];
  ageRequirement: string;
  description: string;
  whatsIncluded: string[];
  subjectAreas: string[];
  highlights: string[];
  cost: string;
  applicationDeadline: string;
  contactEmail: string;
  contactPhone: string;
  applyUrl: string;
  housingType: string;
  languageOfInstruction: string;
  creditsAvailable: string;
  coverImage: string;
  photos: string[];
}

interface Step8ReviewProps {
  data: ProgramFormData;
  programId: Id<"programs"> | null;
  onPublish: () => void;
  onSaveDraft: () => void;
  isSubmitting: boolean;
}

function ReviewSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
          {title}
        </h3>
      </div>
      <div className="px-4 py-3 space-y-2">{children}</div>
    </div>
  );
}

function ReviewField({
  label,
  value,
}: {
  label: string;
  value: string | string[] | undefined;
}) {
  if (!value || (Array.isArray(value) && value.length === 0)) {
    return (
      <div className="flex gap-3">
        <span className="text-sm text-gray-500 w-36 flex-shrink-0">{label}</span>
        <span className="text-sm text-gray-300 italic">Not provided</span>
      </div>
    );
  }

  return (
    <div className="flex gap-3">
      <span className="text-sm text-gray-500 w-36 flex-shrink-0">{label}</span>
      {Array.isArray(value) ? (
        <div className="flex flex-wrap gap-1">
          {value.map((v, i) => (
            <span
              key={i}
              className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700"
            >
              {v}
            </span>
          ))}
        </div>
      ) : (
        <span className="text-sm text-gray-900 break-all">{value}</span>
      )}
    </div>
  );
}

export default function Step8Review({
  data,
  programId,
  onPublish,
  onSaveDraft,
  isSubmitting,
}: Step8ReviewProps) {
  const TERM_LABELS: Record<string, string> = {
    fall: "Fall",
    spring: "Spring",
    summer: "Summer",
    academic_year: "Academic Year",
    year_round: "Year-Round",
  };

  const LEVEL_LABELS: Record<string, string> = {
    freshman: "Freshman",
    sophomore: "Sophomore",
    junior: "Junior",
    senior: "Senior",
    graduate: "Graduate",
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Review &amp; Publish</h2>
        <p className="mt-1 text-sm text-gray-500">
          Review all the details below before publishing your listing.
        </p>
      </div>

      {/* Cover image preview */}
      {data.coverImage && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={data.coverImage}
          alt="Cover preview"
          className="w-full h-40 object-cover rounded-lg border border-gray-200"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
      )}

      <div className="space-y-3">
        {/* Basic Info */}
        <ReviewSection title="Basic Information">
          <ReviewField label="Program Title" value={data.title} />
          <ReviewField label="Provider" value={data.provider} />
          <ReviewField label="Tagline" value={data.tagline} />
          <ReviewField label="Host Institution" value={data.hostInstitution} />
        </ReviewSection>

        {/* Location & Terms */}
        <ReviewSection title="Location & Terms">
          <ReviewField label="City" value={data.city} />
          <ReviewField label="Country" value={data.country} />
          <ReviewField
            label="Terms"
            value={data.terms.map((t) => TERM_LABELS[t] ?? t)}
          />
          <ReviewField label="Duration" value={data.duration} />
        </ReviewSection>

        {/* Eligibility */}
        <ReviewSection title="Eligibility">
          <ReviewField
            label="Education Levels"
            value={data.educationLevels.map((l) => LEVEL_LABELS[l] ?? l)}
          />
          <ReviewField
            label="Nationalities"
            value={data.eligibleNationalities}
          />
          <ReviewField label="Age Requirement" value={data.ageRequirement} />
        </ReviewSection>

        {/* Program Details */}
        <ReviewSection title="Program Details">
          <div className="flex gap-3">
            <span className="text-sm text-gray-500 w-36 flex-shrink-0">Description</span>
            {data.description ? (
              <p className="text-sm text-gray-900 whitespace-pre-line line-clamp-4">
                {data.description}
              </p>
            ) : (
              <span className="text-sm text-gray-300 italic">Not provided</span>
            )}
          </div>
          <ReviewField label="What's Included" value={data.whatsIncluded} />
        </ReviewSection>

        {/* Subjects & Features */}
        <ReviewSection title="Subjects & Features">
          <ReviewField label="Subject Areas" value={data.subjectAreas} />
          <ReviewField label="Highlights" value={data.highlights} />
        </ReviewSection>

        {/* Pricing & Contact */}
        <ReviewSection title="Pricing & Contact">
          <ReviewField label="Cost" value={data.cost} />
          <ReviewField label="Deadline" value={data.applicationDeadline} />
          <ReviewField label="Email" value={data.contactEmail} />
          <ReviewField label="Phone" value={data.contactPhone} />
          <ReviewField label="Apply URL" value={data.applyUrl} />
          <ReviewField label="Housing" value={data.housingType} />
          <ReviewField label="Language" value={data.languageOfInstruction} />
          <ReviewField label="Credits" value={data.creditsAvailable} />
        </ReviewSection>

        {/* Media */}
        <ReviewSection title="Media">
          <ReviewField label="Cover Image" value={data.coverImage} />
          <ReviewField
            label="Photos"
            value={
              data.photos.length > 0
                ? `${data.photos.length} photo${data.photos.length !== 1 ? "s" : ""} added`
                : undefined
            }
          />
        </ReviewSection>
      </div>

      {/* Publish notice */}
      <div className="rounded-md border border-amber-200 bg-amber-50 p-4">
        <div className="flex gap-3">
          <svg
            className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 10 5zm0 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"
              clipRule="evenodd"
            />
          </svg>
          <p className="text-sm text-amber-800">
            <span className="font-semibold">Publishing</span> will make this
            listing publicly visible to students browsing the platform. You can
            unpublish it at any time from the admin dashboard.
          </p>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end pt-2">
        <button
          type="button"
          onClick={onSaveDraft}
          disabled={isSubmitting}
          className="w-full sm:w-auto inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-cobalt-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Save as Draft
        </button>
        <button
          type="button"
          onClick={onPublish}
          disabled={isSubmitting || !programId}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-md bg-cobalt-500 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-cobalt-600 focus:outline-none focus:ring-2 focus:ring-cobalt-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? (
            <>
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Publishing...
            </>
          ) : (
            <>
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 2a.75.75 0 0 1 .75.75v5.59l1.95-2.1a.75.75 0 1 1 1.1 1.02l-3.25 3.5a.75.75 0 0 1-1.1 0L6.2 7.26a.75.75 0 1 1 1.1-1.02l1.95 2.1V2.75A.75.75 0 0 1 10 2z" />
                <path d="M5.273 4.5a1.25 1.25 0 0 0-1.205.918l-1.523 5.52c-.006.02-.01.041-.015.062H6a1 1 0 0 1 .894.553l.448.894a1 1 0 0 0 .894.553h3.438a1 1 0 0 0 .86-.49l.606-1.02A1 1 0 0 1 14 11h3.47a1.318 1.318 0 0 0-.015-.062l-1.523-5.52a1.25 1.25 0 0 0-1.205-.918h-.977a.75.75 0 0 1 0-1.5h.977a2.75 2.75 0 0 1 2.651 2.019l1.523 5.52c.066.239.099.485.099.732V15a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-2.229c0-.247.033-.493.099-.732l1.523-5.52A2.75 2.75 0 0 1 5.273 3h.977a.75.75 0 0 1 0 1.5h-.977z" />
              </svg>
              Publish Listing
            </>
          )}
        </button>
      </div>
    </div>
  );
}
