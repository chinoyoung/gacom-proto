import { Star } from "lucide-react";

export default function V5HelpSection() {
  return (
    <div className="bg-slate-50 rounded-lg p-8 md:p-12 text-center">
      <p className="text-xs font-bold uppercase tracking-wide text-cobalt-500 mb-2">
        Still deciding?
      </p>
      <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
        Have questions about this program?
      </h2>
      <p className="text-sm text-slate-600 mt-2 max-w-xl mx-auto">
        Our advisors can help you compare programs and find the right fit.
      </p>
      <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
        <button
          type="button"
          className="h-11 px-6 bg-cobalt-500 text-white rounded-md text-sm font-semibold hover:bg-cobalt-600 transition-colors cursor-pointer"
        >
          Request Program Matches
        </button>
        <button
          type="button"
          className="h-11 px-6 bg-white border border-slate-300 text-slate-700 rounded-md text-sm font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
        >
          Ask for Help
        </button>
      </div>
      <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500">
        <Star className="w-3 h-3 text-sun-500 fill-current" />
        Trusted by 10,000+ students worldwide
      </div>
    </div>
  );
}
