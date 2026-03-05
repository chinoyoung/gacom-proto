import Link from 'next/link';
import { Globe, ArrowRight, LayoutDashboard, PenTool, FileText } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-5rem)] bg-white">
      {/* Hero Header */}
      <section className="py-16 border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-6">
          <div className="inline-flex items-center space-x-2 bg-slate-50 rounded-full px-3 py-1 mb-6 border border-slate-100">
            <span className="flex h-1.5 w-1.5 rounded-full bg-cobalt-500 animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Internal Prototype</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-4">
            Design <span className="text-cobalt-600">Prototypes.</span>
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl font-medium">
            A secure environment for testing the next generation of GoAbroad's digital infrastructure and core user experiences.
          </p>
        </div>
      </section>

      {/* Module List Section */}
      <section className="py-12 bg-slate-50/50">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-8">Available Modules</h2>

          <div className="space-y-4">

            {/* Primary Module: Program Directory */}
            <ModuleListItem
              href="/programs"
              icon={Globe}
              title="Program Directory"
              description="A modernized search and discovery engine for global study abroad programs."
              tag="Beta"
              isPrimary
            />

            {/* Other Modules in List Format */}
            <ModuleListItem
              href="/admin"
              icon={LayoutDashboard}
              title="Partner Dashboard"
              description="Administrative hub for managing listings, applications, and organizational settings."
              tag="Admin Only"
            />

            <ModuleListItem
              href="/admin/create-listing"
              icon={PenTool}
              title="Listing Creation Flow"
              description="Multi-step interactive interface for drafting and publishing new program listings."
            />

            <ModuleListItem
              href="#"
              icon={FileText}
              title="Articles & Content"
              description="Editorial management system for travel guides and participant resources."
              isDraft
            />

          </div>
        </div>
      </section>

      {/* Footer Branding */}
      <section className="py-12 border-t border-slate-100 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center">
                <span className="font-bold text-xs text-slate-400">GA</span>
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">
                Restricted Engineering Environment
              </p>
            </div>
            <p className="text-xs text-slate-300 font-medium italic">
              Property of GoAbroad.com
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

function ModuleListItem({
  href,
  icon: Icon,
  title,
  description,
  tag,
  isPrimary = false,
  isDraft = false
}: {
  href: string,
  icon: any,
  title: string,
  description: string,
  tag?: string,
  isPrimary?: boolean,
  isDraft?: boolean
}) {
  return (
    <Link
      href={isDraft ? "#" : href}
      className={`group flex flex-col md:flex-row md:items-center justify-between p-6 bg-white border rounded-2xl transition-all duration-200 
        ${isDraft ? 'opacity-60 cursor-not-allowed border-slate-100 grayscale' : 'border-slate-200 hover:border-cobalt-400 hover:shadow-lg hover:shadow-slate-200/50 hover:-translate-y-0.5'}
      `}
    >
      <div className="flex items-center space-x-6">
        <div className={`w-12 h-12 flex items-center justify-center rounded-xl transition-colors
          ${isPrimary ? 'bg-cobalt-600 text-white' : 'bg-slate-50 text-slate-400 group-hover:bg-cobalt-50 group-hover:text-cobalt-600'}
        `}>
          <Icon className="w-5 h-5" strokeWidth={2.5} />
        </div>
        <div>
          <div className="flex items-center space-x-3 mb-0.5">
            <h3 className="font-bold text-slate-900 tracking-tight">{title}</h3>
            {tag && (
              <span className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded border 
                ${isPrimary ? 'bg-cobalt-50 text-white border-cobalt-100' : 'bg-slate-50 text-slate-500 border-slate-100'}
              `}>
                {tag}
              </span>
            )}
            {isDraft && (
              <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-400 border border-slate-200 italic">
                Coming Soon
              </span>
            )}
          </div>
          <p className="text-sm text-slate-500 font-medium leading-relaxed">
            {description}
          </p>
        </div>
      </div>

      {!isDraft && (
        <div className="mt-4 md:mt-0 flex items-center font-bold text-xs uppercase tracking-widest text-slate-300 group-hover:text-cobalt-600 transition-colors">
          Open <ArrowRight className="w-3.5 h-3.5 ml-2 group-hover:translate-x-1 transition-transform" />
        </div>
      )}
    </Link>
  );
}
