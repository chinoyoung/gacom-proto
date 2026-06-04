export default function LoadingSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 xl:px-0 py-10 animate-pulse">
      <div className="h-8 w-64 bg-slate-100 rounded mb-4" />
      <div className="h-40 bg-slate-100 rounded-md mb-8" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-64 bg-slate-100 rounded-lg" />
        ))}
      </div>
    </div>
  );
}
