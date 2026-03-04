"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useState, useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

import StepProgress from "./_components/StepProgress";
import FormNavigation from "./_components/FormNavigation";
import Step1BasicInfo from "./_components/Step1BasicInfo";
import Step2Location from "./_components/Step2Location";
import Step3Eligibility from "./_components/Step3Eligibility";
import Step4ProgramDetails from "./_components/Step4ProgramDetails";
import Step5SubjectsFeatures from "./_components/Step5SubjectsFeatures";
import Step6PricingContact from "./_components/Step6PricingContact";
import Step7Media from "./_components/Step7Media";
import Step8Review from "./_components/Step8Review";

interface ProgramFormData {
  // Step 1
  title: string;
  provider: string;
  tagline: string;
  hostInstitution: string;
  slug: string;
  // Step 2
  city: string;
  country: string;
  terms: string[];
  duration: string;
  // Step 3
  educationLevels: string[];
  eligibleNationalities: string[];
  ageRequirement: string;
  // Step 4
  description: string;
  whatsIncluded: string[];
  // Step 5
  subjectAreas: string[];
  highlights: string[];
  // Step 6
  cost: string;
  applicationDeadline: string;
  contactEmail: string;
  contactPhone: string;
  applyUrl: string;
  housingType: string;
  languageOfInstruction: string;
  creditsAvailable: string;
  // Step 7
  coverImage: string;
  photos: string[];
}

const INITIAL_FORM_DATA: ProgramFormData = {
  title: "",
  provider: "",
  tagline: "",
  hostInstitution: "",
  slug: "",
  city: "",
  country: "",
  terms: [],
  duration: "",
  educationLevels: [],
  eligibleNationalities: [],
  ageRequirement: "",
  description: "",
  whatsIncluded: [],
  subjectAreas: [],
  highlights: [],
  cost: "",
  applicationDeadline: "",
  contactEmail: "",
  contactPhone: "",
  applyUrl: "",
  housingType: "",
  languageOfInstruction: "",
  creditsAvailable: "",
  coverImage: "",
  photos: [],
};

const TOTAL_STEPS = 8;

interface ToastState {
  message: string;
  type: "success" | "error";
}

function CreateListingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("id") as Id<"programs"> | null;

  const [currentStep, setCurrentStep] = useState(1);
  const [programId, setProgramId] = useState<Id<"programs"> | null>(editId);
  const [formData, setFormData] = useState<ProgramFormData>(INITIAL_FORM_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  const existingProgram = useQuery(api.programs.getProgram, editId ? { id: editId } : "skip");
  const createProgram = useMutation(api.programs.createProgram);
  const updateProgram = useMutation(api.programs.updateProgram);

  useEffect(() => {
    if (existingProgram) {
      setFormData({
        title: existingProgram.title || "",
        provider: existingProgram.provider || "",
        tagline: existingProgram.tagline || "",
        hostInstitution: existingProgram.hostInstitution || "",
        slug: existingProgram.slug || "",
        city: existingProgram.city || "",
        country: existingProgram.country || "",
        terms: existingProgram.terms || [],
        duration: existingProgram.duration || "",
        educationLevels: existingProgram.educationLevels || [],
        eligibleNationalities: existingProgram.eligibleNationalities || [],
        ageRequirement: existingProgram.ageRequirement || "",
        description: existingProgram.description || "",
        whatsIncluded: existingProgram.whatsIncluded || [],
        subjectAreas: existingProgram.subjectAreas || [],
        highlights: existingProgram.highlights || [],
        cost: existingProgram.cost || "",
        applicationDeadline: existingProgram.applicationDeadline || "",
        contactEmail: existingProgram.contactEmail || "",
        contactPhone: existingProgram.contactPhone || "",
        applyUrl: existingProgram.applyUrl || "",
        housingType: existingProgram.housingType || "",
        languageOfInstruction: existingProgram.languageOfInstruction || "",
        creditsAvailable: existingProgram.creditsAvailable || "",
        coverImage: existingProgram.coverImage || "",
        photos: existingProgram.photos || [],
      });
    }
  }, [existingProgram]);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const updateFormData = useCallback((patch: Partial<ProgramFormData>) => {
    setFormData((prev) => ({ ...prev, ...patch }));
  }, []);

  const handleNext = async () => {
    setIsSubmitting(true);
    try {
      if (currentStep === 1 && !programId) {
        // Create the program record on first step (only if not editing)
        const id = await createProgram({
          title: formData.title,
          provider: formData.provider,
          tagline: formData.tagline || undefined,
          hostInstitution: formData.hostInstitution || undefined,
          slug: formData.slug || undefined,
        });
        setProgramId(id);
      } else if (programId) {
        // Persist step data on subsequent steps (or step 1 update)
        const stepPayloads: Record<number, Partial<ProgramFormData>> = {
          1: {
            title: formData.title,
            provider: formData.provider,
            tagline: formData.tagline || undefined,
            hostInstitution: formData.hostInstitution || undefined,
            slug: formData.slug || undefined,
          },
          2: {
            city: formData.city,
            country: formData.country,
            terms: formData.terms,
            duration: formData.duration || undefined,
          },
          3: {
            educationLevels: formData.educationLevels,
            eligibleNationalities: formData.eligibleNationalities,
            ageRequirement: formData.ageRequirement || undefined,
          },
          4: {
            description: formData.description,
            whatsIncluded: formData.whatsIncluded,
          },
          5: {
            subjectAreas: formData.subjectAreas,
            highlights: formData.highlights,
          },
          6: {
            cost: formData.cost || undefined,
            applicationDeadline: formData.applicationDeadline || undefined,
            contactEmail: formData.contactEmail || undefined,
            contactPhone: formData.contactPhone || undefined,
            applyUrl: formData.applyUrl || undefined,
            housingType: formData.housingType || undefined,
            languageOfInstruction: formData.languageOfInstruction || undefined,
            creditsAvailable: formData.creditsAvailable || undefined,
          },
          7: {
            coverImage: formData.coverImage || undefined,
            photos: formData.photos,
          },
        };

        const payload = stepPayloads[currentStep];
        if (payload) {
          await updateProgram({ id: programId, ...payload });
        }
      }

      setCurrentStep((prev) => Math.min(prev + 1, TOTAL_STEPS));
    } catch (err) {
      console.error("Failed to save step:", err);
      showToast("Failed to save. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handlePublish = async () => {
    if (!programId) return;
    setIsSubmitting(true);
    try {
      await updateProgram({ id: programId, status: "published" });
      router.push(`/programs/${formData.slug}`);
    } catch (err) {
      console.error("Failed to publish:", err);
      showToast("Failed to publish. Please try again.", "error");
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!programId) {
      showToast("No program to save. Please complete step 1 first.", "error");
      return;
    }
    setIsSubmitting(true);
    try {
      await updateProgram({ id: programId, status: "draft" });
      showToast("Draft saved successfully!");
    } catch (err) {
      console.error("Failed to save draft:", err);
      showToast("Failed to save draft. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1BasicInfo
            data={{
              title: formData.title,
              provider: formData.provider,
              tagline: formData.tagline,
              hostInstitution: formData.hostInstitution,
              slug: formData.slug,
            }}
            onChange={updateFormData}
            formData={formData}
          />
        );
      case 2:
        return (
          <Step2Location
            data={{
              city: formData.city,
              country: formData.country,
              terms: formData.terms,
              duration: formData.duration,
            }}
            onChange={updateFormData}
            formData={formData}
          />
        );
      case 3:
        return (
          <Step3Eligibility
            data={{
              educationLevels: formData.educationLevels,
              eligibleNationalities: formData.eligibleNationalities,
              ageRequirement: formData.ageRequirement,
            }}
            onChange={updateFormData}
            formData={formData}
          />
        );
      case 4:
        return (
          <Step4ProgramDetails
            data={{
              description: formData.description,
              whatsIncluded: formData.whatsIncluded,
            }}
            onChange={updateFormData}
            formData={formData}
          />
        );
      case 5:
        return (
          <Step5SubjectsFeatures
            data={{
              subjectAreas: formData.subjectAreas,
              highlights: formData.highlights,
            }}
            onChange={updateFormData}
            formData={formData}
          />
        );
      case 6:
        return (
          <Step6PricingContact
            data={{
              cost: formData.cost,
              applicationDeadline: formData.applicationDeadline,
              contactEmail: formData.contactEmail,
              contactPhone: formData.contactPhone,
              applyUrl: formData.applyUrl,
              housingType: formData.housingType,
              languageOfInstruction: formData.languageOfInstruction,
              creditsAvailable: formData.creditsAvailable,
            }}
            onChange={updateFormData}
            formData={formData}
          />
        );
      case 7:
        return (
          <Step7Media
            data={{
              coverImage: formData.coverImage,
              photos: formData.photos,
            }}
            onChange={updateFormData}
            formData={formData}
          />
        );
      case 8:
        return (
          <Step8Review
            data={formData}
            programId={programId}
            onPublish={handlePublish}
            onSaveDraft={handleSaveDraft}
            isSubmitting={isSubmitting}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              Admin
            </Link>
            <svg
              className="h-4 w-4 text-gray-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm font-medium text-gray-900">
              Create Listing
            </span>
          </div>
          <h1 className="mt-2 text-2xl font-bold text-gray-900">
            {editId ? `Edit: ${formData.title || "Program"}` : "Create Study Abroad Listing"}
          </h1>
          {programId && (
            <p className="mt-0.5 text-xs text-gray-400">
              Draft ID: {programId}
            </p>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {/* Step progress */}
        <div className="mb-8">
          <StepProgress
            currentStep={currentStep}
            onStepClick={(step) => setCurrentStep(step)}
            formData={formData}
          />
        </div>

        {/* Form card */}
        <div className="rounded-xl bg-white shadow-sm border border-gray-200 px-6 py-6 sm:px-8">
          {renderStep()}

          <FormNavigation
            currentStep={currentStep}
            totalSteps={TOTAL_STEPS}
            onBack={handleBack}
            onNext={handleNext}
            onSaveDraft={programId ? handleSaveDraft : undefined}
            onPublish={programId ? handlePublish : undefined}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>

      {/* Toast notification */}
      {toast && (
        <div
          className={[
            "fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 rounded-lg px-4 py-3 shadow-lg text-sm font-medium transition-all",
            toast.type === "success"
              ? "bg-green-600 text-white"
              : "bg-red-600 text-white",
          ].join(" ")}
        >
          {toast.type === "success" ? (
            <svg className="h-4 w-4 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg className="h-4 w-4 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"
                clipRule="evenodd"
              />
            </svg>
          )}
          {toast.message}
        </div>
      )}
    </div>
  );
}

export default function CreateListingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading Content...</div>}>
      <CreateListingContent />
    </Suspense>
  );
}
