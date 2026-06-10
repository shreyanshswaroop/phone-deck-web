import Link from "next/link";

const pocketDeckDownloadHref =
  process.env.NEXT_PUBLIC_POCKETDECK_DOWNLOAD_URL ||
  "/downloads/PocketDeck-mac-arm64.zip";

export default function DownloadPage() {
  return (
    <main className="min-h-screen bg-black px-6 text-white">
      <section className="mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center py-28 text-center">
        <p className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-[#1c69d4]">
          PhoneDeck
        </p>

        <h1 className="text-5xl font-bold tracking-[-0.04em] md:text-7xl">
          Download PocketDeck.
        </h1>

        <p className="mx-auto mt-8 max-w-xl text-lg leading-8 text-white/50">
          Install the Mac helper, open it from the menu bar, then use Deck
          Studio to customize the controls on your phone.
        </p>

        <div className="mt-12 inline-flex rounded-full border border-white/10 bg-[#111111] px-5 py-3 text-sm text-white/60">
          macOS Apple Silicon
        </div>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href={pocketDeckDownloadHref}
            download
            className="w-full border border-white bg-white px-8 py-4 text-xs font-bold uppercase tracking-[0.16em] text-black transition hover:opacity-90 sm:w-auto"
          >
            Download Mac App
          </a>

          <Link
            href="/"
            className="w-full border border-white/50 px-8 py-4 text-xs font-bold uppercase tracking-[0.16em] text-white transition hover:border-white sm:w-auto"
          >
            Back Home
          </Link>
        </div>

        <p className="mt-8 text-sm text-white/35">
          PocketDeck is currently unsigned while the first release is being
          prepared.
        </p>
      </section>

      <section className="mx-auto max-w-6xl border-t border-white/10 py-24">
        <div className="max-w-2xl">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.35em] text-[#4da3ff]">
            How to use PocketDeck
          </p>
          <h2 className="text-4xl font-bold tracking-[-0.04em] md:text-6xl">
            Set up the Mac helper, then design your deck.
          </h2>
          <p className="mt-6 text-lg leading-8 text-white/50">
            PocketDeck runs quietly in your Mac menu bar. It syncs your
            installed apps to Deck Studio and executes commands from the web
            controller.
          </p>
        </div>

        <div className="mt-14 grid gap-px overflow-hidden border border-white/10 bg-white/10 md:grid-cols-4">
          <SetupStep
            number="01"
            title="Download"
            text="Download the Mac app, unzip it, and move PocketDeck into Applications."
          />
          <SetupStep
            number="02"
            title="Open"
            text="Launch PocketDeck. You should see it running in the menu bar."
          />
          <SetupStep
            number="03"
            title="Customize"
            text="Open Deck Studio and drag your Mac apps into the phone deck."
          />
          <SetupStep
            number="04"
            title="Control"
            text="Open the controller on your phone and tap tiles to control your Mac."
          />
        </div>

        <div className="mt-14 border border-yellow-400/25 bg-yellow-400/7 p-7">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-yellow-300">
            macOS security note
          </p>
          <h3 className="mt-5 text-2xl font-bold tracking-[-0.03em]">
            If macOS says PocketDeck is damaged
          </h3>
          <p className="mt-4 max-w-3xl leading-7 text-white/50">
            Safari adds a quarantine flag to downloaded apps. Until PocketDeck
            is signed and notarized, remove that flag once after moving the app
            to Applications.
          </p>
          <code className="mt-5 block overflow-x-auto border border-white/10 bg-black px-4 py-3 text-sm text-white/75">
            xattr -dr com.apple.quarantine /Applications/PocketDeck.app
          </code>
          <p className="mt-4 text-sm text-white/35">
            Then right-click PocketDeck in Finder and choose Open.
          </p>
        </div>

        <div className="mt-12 flex flex-col gap-4 sm:flex-row">
          <Link
            href="/deck-studio"
            target="_blank"
            rel="noopener noreferrer"
            className="border border-white bg-white px-8 py-4 text-center text-xs font-bold uppercase tracking-[0.16em] text-black transition hover:opacity-90"
          >
            Open Deck Studio
          </Link>

          <Link
            href="/deck"
            target="_blank"
            rel="noopener noreferrer"
            className="border border-white/50 px-8 py-4 text-center text-xs font-bold uppercase tracking-[0.16em] text-white transition hover:border-white"
          >
            Open Controller
          </Link>
        </div>
      </section>
    </main>
  );
}

function SetupStep({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <article className="bg-black p-7 text-left">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#4da3ff]">
        {number}
      </p>
      <h3 className="mt-7 text-2xl font-bold tracking-[-0.03em]">{title}</h3>
      <p className="mt-4 leading-7 text-white/45">{text}</p>
    </article>
  );
}
