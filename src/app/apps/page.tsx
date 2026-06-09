import Link from "next/link";

const upcomingFeatures = [
  "MacBook deck preview",
  "iPhone control layout",
  "Custom buttons",
  "App shortcuts",
  "Media controls",
  "Volume and brightness sliders",
  "Personalized deck themes",
  "Drag-and-drop layout builder",
];

export default function AppsPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <p className="mb-4 text-sm font-semibold tracking-[0.3em] text-blue-400">
          APPS
        </p>

        <h1 className="max-w-4xl text-4xl font-bold tracking-tight md:text-6xl">
          Build your perfect PhoneDeck interface.
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-white/55">
          Soon, you'll be able to preview the MacBook deck, iPhone control UI,
          customize shortcuts, arrange controls, and personalize your setup.
        </p>

        <div className="mt-14 grid gap-5 md:grid-cols-2">
          {upcomingFeatures.map((feature) => (
            <div
              key={feature}
              className="rounded-[24px] border border-white/10 bg-white/[0.03] p-6"
            >
              <p className="text-lg font-medium">{feature}</p>
              <p className="mt-2 text-sm text-white/40">
                Under development
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 rounded-[32px] border border-white/10 bg-white/[0.03] p-8 md:p-10">
          <p className="text-sm font-semibold tracking-[0.3em] text-white/35">
            COMING SOON
          </p>

          <h2 className="mt-4 text-3xl font-semibold tracking-tight">
            A visual deck builder for your Mac.
          </h2>

          <p className="mt-4 max-w-2xl leading-7 text-white/50">
            Apps will become the place where users can explore PhoneDeck UI,
            customize controls, test layouts, and prepare their personal deck
            before connecting to their Mac.
          </p>

          <Link
            href="/"
            className="mt-8 inline-flex rounded-2xl bg-white px-6 py-3 font-medium text-black transition hover:opacity-90"
          >
            Back Home
          </Link>
        </div>
      </div>
    </main>
  );
}