import Link from "next/link";

export default function ProviderNotFound() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-24 text-center">
      <h1 className="text-2xl font-bold text-slate-900">Provider not found</h1>
      <p className="text-sm text-slate-500 mt-2">
        We couldn&apos;t find that provider. It may have been removed.
      </p>
      <Link
        href="/providers"
        className="mt-6 inline-flex items-center justify-center h-10 px-5 bg-cobalt-500 text-white text-sm font-semibold rounded-md hover:bg-cobalt-600 transition-colors"
      >
        Browse all providers
      </Link>
    </div>
  );
}
