"use client";

import { ChevronRight } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { interviewInitials, interviewAvatarClasses } from "./interview-presentation";

const ROLE_BADGE: Record<"Alumni" | "Staff", string> = {
  Alumni: "bg-cobalt-500 text-white",
  Staff: "bg-fern-600 text-white",
};

export default function V1InterviewsSection({ programId }: { programId: string }) {
  const interviews = useQuery(api.interviews.listInterviewsByProgram, {
    programId: programId as Id<"programs">,
    status: "published",
  });

  // Loading: render nothing to avoid a layout flash.
  if (interviews === undefined) return null;
  // Empty: no published interviews → hide the section entirely.
  if (interviews.length === 0) return null;

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900">Interviews</h2>
      <p className="text-sm text-slate-500 mt-1">Read interviews from alumni or staff</p>

      <div className="mt-6 divide-y divide-slate-200">
        {interviews.map((person, index) => (
          <div
            key={person._id}
            className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6 lg:gap-10 py-8 first:pt-0"
          >
            {/* Left — person card */}
            <div className="bg-slate-50 border border-slate-200 rounded-md p-5">
              <div className="flex items-center gap-4">
                {person.photo ? (
                  <img
                    src={person.photo}
                    alt={person.name}
                    className="w-16 h-16 shrink-0 rounded-full object-cover"
                  />
                ) : (
                  <div
                    className={`w-16 h-16 shrink-0 rounded-full flex items-center justify-center text-lg font-bold ${interviewAvatarClasses(index)}`}
                    aria-hidden="true"
                  >
                    {interviewInitials(person.name)}
                  </div>
                )}
                <div className="min-w-0">
                  <h3 className="font-bold text-slate-900 leading-snug">{person.name}</h3>
                  <p className="text-sm text-slate-500">Participated in {person.year}</p>
                  <span
                    className={`inline-flex mt-1.5 items-center px-3 py-1 rounded-md text-xs font-semibold ${ROLE_BADGE[person.role]}`}
                  >
                    {person.role}
                  </span>
                </div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed mt-4">{person.bio}</p>
            </div>

            {/* Right — quote + link */}
            <div>
              <p className="text-[15px] text-slate-700 leading-relaxed">{person.quote}</p>
              <button
                type="button"
                className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-slate-900 hover:text-cobalt-600 transition-colors cursor-pointer"
              >
                Show Full Interview
                <ChevronRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
