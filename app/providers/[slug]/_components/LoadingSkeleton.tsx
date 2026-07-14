"use client";

export default function LoadingSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="bg-slate-100">
        <div className="max-w-7xl mx-auto px-4 xl:px-0 pt-6 pb-8">
          <div className="h-4 bg-slate-200 rounded w-56 mb-6" />
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1 space-y-4">
              <div className="h-9 bg-slate-200 rounded w-2/3" />
              <div className="h-16 w-16 bg-slate-200 rounded-md" />
              <div className="h-4 bg-slate-100 rounded w-1/2" />
              <div className="h-10 bg-slate-200 rounded w-40" />
            </div>
            <div className="w-full lg:w-[560px] h-[300px] bg-slate-200 rounded-md" />
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 xl:px-0 mt-8 flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-3">
              <div className="h-7 bg-slate-200 rounded w-48" />
              <div className="h-4 bg-slate-100 rounded w-full" />
              <div className="h-4 bg-slate-100 rounded w-[92%]" />
            </div>
          ))}
        </div>
        <div className="w-full lg:w-[380px] h-96 bg-slate-50 border border-slate-100 rounded-lg" />
      </div>
    </div>
  );
}
