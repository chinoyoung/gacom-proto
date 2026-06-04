import Link from 'next/link';
import { Globe, ArrowRight, LayoutDashboard, PenTool, Handshake, Smartphone, Palette, Building2, Compass } from 'lucide-react';
import AdminHeader from '@/components/AdminHeader';
import AdminFooter from '@/components/AdminFooter';

interface ModuleItem {
  href: string;
  icon: typeof Globe;
  title: string;
  description: string;
  thumb: string;
}

const PROTOTYPES: ModuleItem[] = [
  {
    href: "/programs",
    icon: Globe,
    title: "Program Directory",
    description: "Modernized search & discovery — browse programs, filter by criteria, and open a detail page.",
    thumb: "/images/prototypes/programs.jpeg",
  },
  {
    href: "/providers",
    icon: Building2,
    title: "Provider Directory",
    description: "Provider profile pages — a provider's full catalog, aggregated reviews, awards, and details.",
    thumb: "/images/prototypes/providers.jpeg",
  },
  {
    href: "/mygoabroad",
    icon: Compass,
    title: "MyGoAbroad",
    description: "The MyGoAbroad landing page. Two variants — toggle v1 (direct copy) and v2 (marketplace redesign).",
    thumb: "/images/prototypes/mygoabroad.jpeg",
  },
  {
    href: "/marketplace/partner",
    icon: Handshake,
    title: "Partner Marketplace",
    description: "Landing page for recruiting ambassadors and program partners. v1 and v2 variants available.",
    thumb: "/images/prototypes/partner.jpeg",
  },
  {
    href: "/marketplace/esim",
    icon: Smartphone,
    title: "eSIM Marketplace",
    description: "Travel eSIM landing page — destinations, plans, and how-it-works.",
    thumb: "/images/prototypes/esim.jpeg",
  },
  {
    href: "/admin/create-listing",
    icon: PenTool,
    title: "Create Listing",
    description: "The 8-step flow for drafting and publishing a program.",
    thumb: "/images/prototypes/create-listing.jpeg",
  },
];

const ADMIN_MODULES: ModuleItem[] = [
  {
    href: "/admin",
    icon: LayoutDashboard,
    title: "Admin",
    description: "Administrative hub for managing listings, applications, and organizational settings.",
    thumb: "/images/prototypes/admin.jpeg",
  },
  {
    href: "/brand",
    icon: Palette,
    title: "Brand Guidelines",
    description: "The design system reference — colors, typography, components, and spacing rules.",
    thumb: "/images/prototypes/brand.jpeg",
  },
];

export default function Home() {
  return (
    <>
      <AdminHeader />
      <div className="min-h-[calc(100vh-5rem)] bg-white">
        {/* Hero Header */}
        <section className="py-10 md:py-16 border-b border-slate-100">
          <div className="max-w-6xl mx-auto px-6">
            <div className="inline-flex items-center space-x-2 bg-slate-50 rounded-full px-3 py-1 mb-6 border border-slate-100">
              <span className="flex h-1.5 w-1.5 rounded-full bg-cobalt-500 animate-pulse"></span>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Internal Prototype</span>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-4">
              Design <span className="text-cobalt-600">Prototypes.</span>
            </h1>
            <p className="text-lg text-slate-500 max-w-2xl font-medium">
              A secure environment for testing the next generation of GoAbroad&apos;s digital infrastructure and core user experiences. Open a module below to review the prototype and leave feedback.
            </p>
          </div>
        </section>

        {/* Module Grid Section */}
        <section className="py-12 bg-slate-50/50">
          <div className="max-w-6xl mx-auto px-6">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-[0.2em] mb-4">Prototypes</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {PROTOTYPES.map((m) => (
                <ModuleCard key={m.href} {...m} />
              ))}
            </div>

            <div className="mt-12">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-[0.2em] mb-4">Admin</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {ADMIN_MODULES.map((m) => (
                  <ModuleCard key={m.href} {...m} />
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
      <AdminFooter />
    </>
  );
}

function ModuleCard({ href, icon: Icon, title, description, thumb }: ModuleItem) {
  return (
    <Link
      href={href}
      className="group flex flex-col bg-white border border-slate-200 rounded-2xl overflow-hidden transition-all duration-200 hover:border-cobalt-400 hover:shadow-lg hover:shadow-slate-200/50 hover:-translate-y-0.5"
    >
      <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden border-b border-slate-100">
        <img
          src={thumb}
          alt={`${title} preview`}
          className="w-full h-full object-cover object-top group-hover:scale-[1.03] transition-transform duration-300"
        />
      </div>
      <div className="flex flex-col flex-1 p-5">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-slate-50 text-slate-400 group-hover:bg-cobalt-50 group-hover:text-cobalt-600 transition-colors shrink-0">
            <Icon className="w-5 h-5" strokeWidth={2.5} />
          </div>
          <h3 className="font-bold text-slate-900 tracking-tight">{title}</h3>
        </div>
        <p className="text-sm text-slate-500 font-medium leading-relaxed">{description}</p>
        <div className="mt-4 flex items-center font-bold text-xs uppercase tracking-widest text-slate-300 group-hover:text-cobalt-600 transition-colors">
          Open <ArrowRight className="w-3.5 h-3.5 ml-2 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
}
