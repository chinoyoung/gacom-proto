import { ArrowRight } from "lucide-react";
import { MYG_DISCOVERY, MYG_LINKS } from "../../_shared/content";
import V2ProgramCard from "./V2ProgramCard";
import V2ArticleCard from "./V2ArticleCard";

const SAMPLE_PROGRAMS = [
  {
    title: "Immersive Spanish Language & Culture Program in Barcelona",
    providerName: "Global Learning Institute",
    rating: 4.8,
    reviewsCount: 142,
    description:
      "Live with a local host family, take daily language classes, and explore Barcelona's vibrant neighborhoods on a fully-supported four-week program.",
    verified: true,
    featured: false,
  },
  {
    title: "Marine Conservation Volunteer Expedition in Costa Rica",
    providerName: "EcoVolunteer Network",
    rating: 4.9,
    reviewsCount: 87,
    description:
      "Join marine biologists on the Pacific coast to monitor sea turtle nesting, restore coral reefs, and help protect one of the world's richest ecosystems.",
    verified: false,
    featured: true,
  },
  {
    title: "Teach English Abroad — Community Schools in Vietnam",
    providerName: "Bridge Education Group",
    rating: 4.6,
    reviewsCount: 211,
    description:
      "Spend a semester teaching conversational English in rural Vietnamese classrooms, with housing, in-country orientation, and ongoing support included.",
    verified: true,
    featured: false,
  },
];

const SAMPLE_ARTICLES = [
  {
    title: "10 Things Nobody Tells You Before Studying Abroad in Europe",
    author: "Sarah Kimura",
    date: "3 days ago",
    topic: "Study Abroad",
  },
  {
    title: "How to Choose the Right Volunteer Program for Your Skills",
    author: "Marco Delgado",
    date: "1 week ago",
    topic: "Volunteer Abroad",
  },
  {
    title: "The Real Cost of Teaching English Abroad in Southeast Asia",
    author: "Priya Nair",
    date: "2 weeks ago",
    topic: "Teach Abroad",
  },
];

export default function V2ProgramDiscovery() {
  return (
    <section
      id="discover"
      aria-labelledby="v2-discovery-heading"
      className="scroll-mt-24 bg-slate-50 px-4 sm:px-6 md:px-12 lg:px-20 py-16 md:py-24"
    >
      <div className="max-w-7xl mx-auto flex flex-col gap-10">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-cobalt-500 mb-2">
            Program discovery
          </p>
          <h2
            id="v2-discovery-heading"
            className="text-3xl font-bold tracking-tight text-neutral-800"
          >
            {MYG_DISCOVERY.h2}
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed mt-3">{MYG_DISCOVERY.sub}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {MYG_DISCOVERY.cards.map((card) => (
            <div
              key={card.title}
              className="bg-white rounded-xl p-6 border border-slate-200 flex flex-col gap-5"
            >
              <div className="w-full h-40 flex items-center justify-center">
                <img src={card.img} alt={card.alt} className="h-full w-auto object-contain" />
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-lg font-semibold text-neutral-800">{card.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{card.body}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Programs you might love */}
        <div className="flex flex-col gap-6">
          <p className="text-sm font-semibold uppercase tracking-widest text-cobalt-500">
            Programs you might love
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {SAMPLE_PROGRAMS.map((program) => (
              <V2ProgramCard key={program.title} {...program} />
            ))}
          </div>
        </div>

        {/* Travel tips & guides */}
        <div className="flex flex-col gap-6">
          <p className="text-sm font-semibold uppercase tracking-widest text-cobalt-500">
            Travel tips &amp; guides
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {SAMPLE_ARTICLES.map((article) => (
              <V2ArticleCard key={article.title} {...article} />
            ))}
          </div>
        </div>

        <a
          href={MYG_LINKS.search}
          className="inline-flex items-center gap-2 self-center bg-cobalt-500 text-white font-semibold px-7 py-3 rounded-lg hover:bg-cobalt-600 transition-colors text-sm cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500"
        >
          {MYG_DISCOVERY.cta}
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
