import Link from "next/link";

export default function DownloadPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-6 text-white">
      <div className="max-w-2xl text-center">
        <p className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-[#1c69d4]">
          PhoneDeck
        </p>

        <h1 className="text-5xl font-bold tracking-[-0.04em] md:text-7xl">
          Coming Soon.
        </h1>

        <p className="mx-auto mt-8 max-w-xl text-lg leading-8 text-white/50">
          PhoneDeck is currently in active development. We are polishing the
          experience, improving performance, and preparing the first public
          release.
        </p>

        <div className="mt-12 inline-flex rounded-full border border-white/10 bg-[#111111] px-5 py-3 text-sm text-white/60">
          Under Development
        </div>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/deck"
            className="w-full border border-white bg-white px-8 py-4 text-xs font-bold uppercase tracking-[0.16em] text-black transition hover:opacity-90 sm:w-auto"
          >
            Open Web Deck
          </Link>

          <Link
            href="/"
            className="w-full border border-white/50 px-8 py-4 text-xs font-bold uppercase tracking-[0.16em] text-white transition hover:border-white sm:w-auto"
          >
            Back Home
          </Link>
        </div>

        <p className="mt-8 text-sm text-white/35">
          Use the web deck while the native application is being prepared.
        </p>
      </div>
    </main>
  );
}
