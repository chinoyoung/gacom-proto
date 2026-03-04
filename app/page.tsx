import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}

      {/* Hero */}
      <section className="bg-gradient-to-br from-cobalt-600 to-cobalt-700 text-white py-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            Find Your Perfect Study Abroad Program
          </h1>
          <p className="text-cobalt-50 text-lg mb-8">
            Browse programs worldwide or create your own listing.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/programs"
              className="bg-white text-cobalt-600 font-semibold px-8 py-3 rounded-lg hover:bg-cobalt-500 hover:text-white transition-colors"
            >
              Browse Programs
            </Link>
            <Link
              href="/admin/create-listing"
              className="bg-cobalt-500 text-white font-semibold px-8 py-3 rounded-lg border border-cobalt-300 hover:bg-cobalt-300 transition-colors"
            >
              Create a Listing
            </Link>
          </div>
        </div>
      </section>

      {/* Quick links */}
      <section className="max-w-7xl mx-auto py-16 px-4 grid md:grid-cols-2 gap-6">
        <Link
          href="/programs"
          className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow group"
        >
          <div className="text-3xl mb-3">🌍</div>
          <h2 className="text-lg font-semibold text-gray-900 group-hover:text-cobalt-500 transition-colors">
            Browse Programs
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Explore all published study abroad program listings.
          </p>
        </Link>
        <Link
          href="/admin/create-listing"
          className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow group"
        >
          <div className="text-3xl mb-3">✏️</div>
          <h2 className="text-lg font-semibold text-gray-900 group-hover:text-cobalt-500 transition-colors">
            Create a Listing
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Add a new program listing with our step-by-step form.
          </p>
        </Link>
      </section>
    </div>
  );
}
