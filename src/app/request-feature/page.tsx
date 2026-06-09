import Link from "next/link";

export default function RequestFeaturePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-6 text-white">
      <div className="max-w-2xl text-center">
        <div className="mb-8 inline-flex rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-white/60">
          🚀 Coming Soon
        </div>

        <h1 className="text-5xl font-bold tracking-tight md:text-7xl">
          Feature Requests
        </h1>

        <p className="mx-auto mt-8 max-w-xl text-lg leading-8 text-white/50">
          We are building a dedicated feature request portal where you can
          suggest ideas, vote on upcoming features, and help shape the future
          of PhoneDeck.
        </p>

        <div className="mt-12 flex items-center justify-center gap-4">
          <Link
            href="/"
            className="rounded-2xl bg-white px-6 py-3 font-medium text-black transition hover:opacity-90"
          >
            Back Home
          </Link>

          <Link
            href="/contact"
            className="rounded-2xl border border-white/10 px-6 py-3 text-white/70 transition hover:bg-white/5 hover:text-white"
          >
            Contact Us
          </Link>
        </div>

        <p className="mt-12 text-sm text-white/30">
          Expected launch in a future PhoneDeck update.
        </p>
      </div>
    </main>
  );
}