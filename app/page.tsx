import Link from 'next/link';
import { Globe, ArrowRight, LayoutDashboard, PenTool, Handshake, Smartphone, Palette } from 'lucide-react';
import AdminHeader from '@/components/AdminHeader';
import AdminFooter from '@/components/AdminFooter';

export default function Home() {
  return (
    <>
      <AdminHeader />
      <div className="min-h-[calc(100vh-5rem)] bg-white">
      {/* Hero Header */}
      <section className="py-10 md:py-16 border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-6">
          <div className="inline-flex items-center space-x-2 bg-slate-50 rounded-full px-3 py-1 mb-6 border border-slate-100">
            <span className="flex h-1.5 w-1.5 rounded-full bg-cobalt-500 animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Internal Prototype</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-4">
            Design <span className="text-cobalt-600">Prototypes.</span>
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl font-medium">
            A secure environment for testing the next generation of GoAbroad's digital infrastructure and core user experiences. Open a module below to review the prototype and leave feedback.
          </p>
        </div>
      </section>

      {/* Module List Section */}
      <section className="py-12 bg-slate-50/50">
        <div className="max-w-5xl mx-auto px-6">
          {/* Prototypes */}
          <div>
            <div className="space-y-4">
              <ModuleListItem
                href="/programs"
                icon={Globe}
                title="Program Directory"
                description="The modernized search and discovery experience. Browse programs, filter by criteria, and open a detail page. Feedback wanted on the search/filter UX and listing presentation."
                isPrimary
              />
              <ModuleListItem
                href="/admin/create-listing"
                icon={PenTool}
                title="Create Listing"
                description="The new 8-step flow for drafting and publishing a program. Walk through the steps and submit a test listing. Feedback wanted on step pacing and field labeling."
              />
              <ModuleListItem
                href="/marketplace/partner"
                icon={Handshake}
                title="Partner Marketplace"
                description="Landing page for recruiting ambassadors and program partners. Feedback wanted on messaging hierarchy and the call-to-action."
              />
              <ModuleListItem
                href="/marketplace/esim"
                icon={Smartphone}
                title="eSIM Marketplace"
                description="Travel eSIM landing page — destinations, plans, and how-it-works. Two design variants available; toggle via the version switcher to compare v1 and v2."
              />
              <ModuleListItem
                href="/brand"
                icon={Palette}
                title="Brand Guidelines"
                description="The design system reference — colors, typography, components, and spacing rules. Source of truth for visual decisions across prototypes."
              />
            </div>
          </div>

          {/* Admin */}
          <div className="mt-10">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-[0.2em] mb-4">Admin</h3>
            <div className="space-y-4">
              <ModuleListItem
                href="/admin"
                icon={LayoutDashboard}
                title="Admin"
                description="Administrative hub for managing listings, applications, and organizational settings. Browse the dashboards and review the IA."
              />
            </div>
          </div>
        </div>
      </section>

      </div>
      <AdminFooter />
    </>
  );
}

function ModuleListItem({
  href,
  icon: Icon,
  title,
  description,
  isPrimary = false,
}: {
  href: string,
  icon: any,
  title: string,
  description: string,
  isPrimary?: boolean,
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col md:flex-row md:items-center justify-between p-6 bg-white border border-slate-200 rounded-2xl transition-all duration-200 hover:border-cobalt-400 hover:shadow-lg hover:shadow-slate-200/50 hover:-translate-y-0.5"
    >
      <div className="flex items-center space-x-6">
        <div className={`w-12 h-12 flex items-center justify-center rounded-xl transition-colors
          ${isPrimary ? 'bg-cobalt-600 text-white' : 'bg-slate-50 text-slate-400 group-hover:bg-cobalt-50 group-hover:text-cobalt-600'}
        `}>
          <Icon className="w-5 h-5" strokeWidth={2.5} />
        </div>
        <div>
          <h3 className="font-bold text-slate-900 tracking-tight mb-0.5">{title}</h3>
          <p className="text-sm text-slate-500 font-medium leading-relaxed">
            {description}
          </p>
        </div>
      </div>

      <div className="mt-4 md:mt-0 flex items-center font-bold text-xs uppercase tracking-widest text-slate-300 group-hover:text-cobalt-600 transition-colors">
        Open <ArrowRight className="w-3.5 h-3.5 ml-2 group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  );
}
