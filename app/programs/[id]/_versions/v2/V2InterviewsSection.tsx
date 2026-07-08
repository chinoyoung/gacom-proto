import { ChevronRight } from "lucide-react";

type Interview = {
  name: string;
  year: string;
  role: "Alumni" | "Staff";
  bio: string;
  quote: string;
  initials: string;
  avatarColor: string;
  avatar?: string;
};

const ROLE_BADGE: Record<Interview["role"], string> = {
  Alumni: "bg-cobalt-500 text-white",
  Staff: "bg-fern-600 text-white",
};

const INTERVIEWS: Interview[] = [
  {
    name: "Kristianna Williams",
    year: "2017",
    role: "Alumni",
    bio: "Kristianna is from Dayton, Ohio, and she is a senior Sports Science major at Wright State University. Kristianna loves coaching middle school track an...",
    quote:
      "I wanted to get out of my comfort zone and see another culture firsthand. Growing up in a small town in Ohio, I'd never really traveled outside the country, so studying abroad felt like the perfect chance to push myself. From the moment I landed I was immersed in a completely new way of life — the food, the language, the everyday rhythms — and it stretched me in ways I never expected. By the end, I'd made friends from all over the world and come back with a confidence I didn't have before.",
    initials: "KW",
    avatarColor: "bg-cobalt-500/10 text-cobalt-600",
    avatar: "/images/interview1.webp",
  },
  {
    name: "Marissa Baglione",
    year: "2016",
    role: "Alumni",
    bio: "Marissa Baglione is a senior studying communications and media studies in Boston. She just recently landed an internship with Hill Holliday in their M...",
    quote:
      "Studying abroad in college has been at the top of my to-do list since high school. I have a love of travel and discovering new places, so that's definitely what inspired me to apply. What I didn't expect was how much the program would shape my career — interning with a local agency while I was abroad gave me real-world experience I could never have gotten in a classroom. Balancing work, classes, and exploring a new city taught me how to adapt quickly, and I came home with a portfolio and a network that opened doors the moment I got back.",
    initials: "MB",
    avatarColor: "bg-sun-500/10 text-sun-700",
  },
  {
    name: "Daniel Ortega",
    year: "2019",
    role: "Staff",
    bio: "Daniel is a program coordinator based in Barcelona who has supported hundreds of students through their study abroad journey over the past six years...",
    quote:
      "Seeing students grow in confidence over a single semester is the most rewarding part of what I do. Many of them arrive nervous and unsure, sometimes traveling on their own for the very first time, and within weeks they're navigating the city, ordering in a new language, and making friends from around the world. My job is to make sure the logistics never get in the way of that growth — from housing and safety to helping them settle in. By the time they leave, they're not just better students, they're more independent, more curious people, and that's what keeps me doing this year after year.",
    initials: "DO",
    avatarColor: "bg-fern-500/10 text-fern-700",
  },
];

export default function V2InterviewsSection() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900">Interviews</h2>
      <p className="text-sm text-slate-500 mt-1">Read interviews from alumni or staff</p>

      <div className="mt-6 divide-y divide-slate-200">
        {INTERVIEWS.map((person) => (
          <div
            key={person.name}
            className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6 lg:gap-10 py-8 first:pt-0"
          >
            {/* Left — person card */}
            <div className="bg-slate-50 border border-slate-200 rounded-md p-5">
              <div className="flex items-center gap-4">
                {person.avatar ? (
                  <img
                    src={person.avatar}
                    alt={person.name}
                    className="w-16 h-16 shrink-0 rounded-full object-cover"
                  />
                ) : (
                  <div
                    className={`w-16 h-16 shrink-0 rounded-full flex items-center justify-center text-lg font-bold ${person.avatarColor}`}
                    aria-hidden="true"
                  >
                    {person.initials}
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
