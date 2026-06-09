import {
  Bell,
  Code2,
  Monitor,
  Radio,
  Smartphone,
  Zap,
} from "lucide-react";

const cards = [
  {
    label: "For fast movers",
    title: "Switch apps before the moment breaks.",
    body: "Jump between Chrome, Slack, Terminal and your tools without reaching for your mouse.",
    accent: "text-[#22c55e]",
    icon: Bell,
  },
  {
    label: "For builders",
    title: "Keep your hands on the keyboard.",
    body: "Trigger Mac controls from your phone while staying inside your coding flow.",
    accent: "text-[#f4b400]",
    icon: Code2,
  },
  {
    label: "For minimal setups",
    title: "Less hardware. More control.",
    body: "No extra deck on your desk. Your iPhone becomes the control surface.",
    accent: "text-[#ec4899]",
    icon: Smartphone,
  },
  {
    label: "For creators",
    title: "Control the room while you create.",
    body: "Manage media, browser, recording and system actions in one clean touch layout.",
    accent: "text-[#a855f7]",
    icon: Radio,
  },
];

export default function BuiltForPage() {
  return (
    <main className="min-h-screen bg-black px-6 py-24 text-white">
      <section className="mx-auto max-w-6xl">
        <div className="text-center">
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-white/40">
            Built For
          </p>

          <h1 className="mx-auto max-w-3xl text-5xl font-bold leading-none tracking-[-0.04em] md:text-7xl">
            Made for people who move fast.
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/50">
            PhoneDeck is designed for creators, developers, students and anyone
            who wants faster Mac control without breaking focus.
          </p>
        </div>

        <div className="mt-20 grid gap-6 md:grid-cols-2">
          {cards.map((card) => {
            const Icon = card.icon;

            return (
              <div
                key={card.title}
                className="group border border-white/10 bg-[#050505] p-8 transition hover:border-white/25"
              >
                <div className="mb-12 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#151515] ring-1 ring-white/10">
                  <Icon className={`h-7 w-7 ${card.accent}`} />
                </div>

                <p
                  className={`mb-5 text-xs font-bold uppercase tracking-[0.2em] ${card.accent}`}
                >
                  {card.label}
                </p>

                <h2 className="max-w-md text-3xl font-bold leading-tight tracking-[-0.03em]">
                  {card.title}
                </h2>

                <p className="mt-5 max-w-md leading-7 text-white/45">
                  {card.body}
                </p>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}