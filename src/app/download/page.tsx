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
          PhoneDeck is currently in active development. We ere polishing the
          experience, improving performance, and preparing the first public
          release.
        </p>

        <div className="mt-12 inline-flex rounded-full border border-white/10 bg-[#111111] px-5 py-3 text-sm text-white/60">
          🚧 Under Development
        </div>

        <p className="mt-10 text-sm text-white/35">
          Join the waitlist to be among the first users when PhoneDeck launches.
        </p>
      </div>
    </main>
  );
}