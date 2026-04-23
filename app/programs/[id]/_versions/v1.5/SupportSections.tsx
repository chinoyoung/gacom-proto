"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ChevronRight, Heart, Quote } from "lucide-react";
import type { Program } from "../../_components/types";

export function buildFaqs(program: Program): { question: string; answer: string }[] {
  const faqs: { question: string; answer: string }[] = [];

  faqs.push({
    question: "What is the cost of this program?",
    answer: program.cost
      ? `The program costs ${program.cost}.`
      : "Please contact the provider for pricing details.",
  });

  if (program.terms.length > 0) {
    faqs.push({
      question: "When is this program available?",
      answer: `This program is available during: ${program.terms.join(", ")}. ${program.duration ? `Duration: ${program.duration}.` : ""}`,
    });
  }

  if (program.housingType) {
    faqs.push({
      question: "What type of housing is provided?",
      answer: `Housing type: ${program.housingType}.`,
    });
  }

  if (program.creditsAvailable) {
    faqs.push({
      question: "Can I earn academic credits?",
      answer: `Yes, ${program.creditsAvailable} credits are available through this program.`,
    });
  }

  if (program.languageOfInstruction) {
    faqs.push({
      question: "What language is the program taught in?",
      answer: `The program is taught in ${program.languageOfInstruction}.`,
    });
  }

  if (program.applicationDeadline) {
    faqs.push({
      question: "When is the application deadline?",
      answer: `The application deadline is ${program.applicationDeadline}.`,
    });
  }

  return faqs;
}

export function FAQsSection({ faqs }: { faqs: { question: string; answer: string }[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) => {
    setOpenIndex((prev) => (prev === i ? null : i));
  };

  return (
    <div className="flex flex-col px-4 md:px-8 w-full">
      <h2 className="flex items-center text-2xl font-bold gap-2">
        Frequently Asked Questions
      </h2>
      <div className="flex flex-col">
        {faqs.map((faq, i) => {
          const open = openIndex === i;
          return (
            <div key={i} className="border-b border-gray-200 py-4 flex flex-col gap-2">
              <button
                onClick={() => toggle(i)}
                className="text-base text-left text-cobalt-500 cursor-pointer w-full"
              >
                <h3 className="flex gap-2 items-center justify-between">
                  {faq.question}
                  <ChevronRight
                    className={`${
                      open ? "-rotate-90" : "rotate-90"
                    } text-neutral-500 w-4 h-4 shrink-0 transition-transform`}
                  />
                </h3>
              </button>
              {open && (
                <p className="text-sm whitespace-pre-wrap">{faq.answer}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

const MOCK_INTERVIEWS = [
  {
    name: "Maria Santos",
    role: "Alumna, Summer 2025",
    avatar: "https://i.pravatar.cc/80?img=47",
    excerpt:
      "Living with my host family completely transformed how I understood the culture. I came home fluent — but more importantly, with a second family.",
  },
  {
    name: "James Okafor",
    role: "Alumnus, Spring 2025",
    avatar: "https://i.pravatar.cc/80?img=12",
    excerpt:
      "The weekend excursions were the highlight. Our program director planned everything down to the smallest detail and it made all the difference.",
  },
  {
    name: "Dr. Elena Rossi",
    role: "Program Director",
    avatar: "https://i.pravatar.cc/80?img=32",
    excerpt:
      "We design every cohort experience around student growth — not tourism. After ten years, we still tailor the program for each new group.",
  },
];

export function InterviewsSection() {
  return (
    <div className="flex flex-col px-4 xl:px-0 gap-4">
      <div>
        <h2 className="flex items-center text-2xl font-bold gap-2">Interviews</h2>
        <p className="text-sm">Read interviews from alumni and staff</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {MOCK_INTERVIEWS.map((interview, i) => (
          <div
            key={i}
            className="bg-slate-50 border border-gray-200 rounded-md p-5 flex flex-col gap-3"
          >
            <Quote className="w-5 h-5 text-cobalt-500" />
            <p className="text-sm text-neutral-700 leading-relaxed">
              &ldquo;{interview.excerpt}&rdquo;
            </p>
            <div className="flex items-center gap-3 mt-auto pt-3 border-t border-gray-200">
              <img
                src={interview.avatar}
                alt={interview.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="text-sm font-bold">{interview.name}</p>
                <p className="text-xs text-neutral-500">{interview.role}</p>
              </div>
            </div>
            <button className="text-xs text-cobalt-500 font-bold flex items-center gap-1 cursor-pointer hover:underline">
              Read full interview
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ProgramsSection({ currentProgramId }: { currentProgramId: string }) {
  const allPrograms = useQuery(api.programs.listPrograms, {
    status: "published",
  });

  const programs = (allPrograms ?? [])
    .filter((p: any) => p._id !== currentProgramId)
    .slice(0, 3);

  return (
    <div className="flex flex-col px-4 xl:px-0 gap-4">
      <div className="w-full flex flex-col gap-4 md:flex-row md:justify-between items-center">
        <div className="w-full">
          <h2 className="flex items-center text-2xl font-bold gap-2">
            Related Programs
          </h2>
          <p className="text-sm">Browse programs you might like</p>
        </div>
      </div>
      <div className="flex flex-col gap-6 w-full md:grid lg:grid-cols-3 sm:grid-cols-2">
        {programs.map((prog: any) => (
          <div key={prog._id} className="flex flex-col">
            {/* Image with save button */}
            <div className="relative w-full h-[175px] rounded-t-md overflow-hidden bg-cobalt-200">
              {prog.coverImage && (
                <img
                  src={prog.coverImage}
                  className="w-full h-full object-cover rounded-t-md"
                  alt={prog.title}
                />
              )}
              <div className="absolute top-2 right-2 flex items-center px-2.5 py-1.5 gap-2 opacity-90 rounded-md bg-white cursor-pointer">
                <Heart className="w-3 h-3 text-neutral-500" />
                <p className="text-xs font-bold text-neutral-700">Save</p>
              </div>
            </div>
            {/* Content */}
            <div className="p-4 rounded-b-md bg-slate-50 flex flex-col border border-gray-200 shadow-md lg:h-[240px]">
              <p className="text-base font-bold">{prog.title}</p>
              <p className="text-sm mt-2 mb-4 line-clamp-2 text-neutral-600">
                {prog.description}
              </p>
              <div className="flex gap-2 mt-auto">
                <button className="py-2.5 px-4 bg-cobalt-500 text-white text-sm font-bold rounded-md w-full cursor-pointer">
                  Visit Website
                </button>
                <Link
                  href={`/programs/${prog.slug ?? prog._id}`}
                  className="text-center py-2.5 px-4 border-neutral-400 border text-neutral-500 text-sm font-bold rounded-md w-full"
                >
                  View Program
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
      {allPrograms !== undefined && programs.length === 0 && (
        <p className="text-sm text-slate-400 py-6">No other programs found.</p>
      )}
    </div>
  );
}
