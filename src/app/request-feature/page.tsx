import Link from "next/link";
import { ArrowLeft, Lightbulb, MessageSquarePlus, Sparkles } from "lucide-react";
import Footer from "@/app/components/footer";
import SecondaryNav from "@/app/components/SecondaryNav";

const featureIdeas = [
  "Vote on upcoming controls",
  "Request app integrations",
  "Share workflow ideas",
  "Track planned releases",
] as const;

export default function RequestFeaturePage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f7f7f8] text-[#1f1f23]">
      <SecondaryNav />

      <section className="mx-auto max-w-5xl px-5 pb-20 pt-14 text-center sm:pt-20">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[22px] bg-[#eaf4ff] text-[#0676f8]">
          <Lightbulb className="h-8 w-8" />
        </div>
        <p className="mt-8 text-[13px] font-semibold uppercase tracking-[0.36em] text-[#0a7af5]">
          Feature Requests
        </p>
        <h1 className="mx-auto mt-5 max-w-4xl text-[48px] font-semibold leading-[1.02] tracking-normal sm:text-[72px]">
          Help shape PocketDeck.
        </h1>
        <p className="mx-auto mt-7 max-w-2xl text-[19px] leading-[1.6] text-[#5d5d64] sm:text-[21px]">
          We are building a dedicated request portal where you can suggest
          ideas, vote on upcoming features, and guide what comes next.
        </p>

        <div className="mx-auto mt-12 grid max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featureIdeas.map((idea) => (
            <div
              key={idea}
              className="rounded-[22px] bg-white p-5 text-left shadow-[0_16px_40px_rgba(0,0,0,0.07)] ring-1 ring-black/5"
            >
              <Sparkles className="h-5 w-5 text-[#0a7af5]" />
              <p className="mt-4 text-[16px] font-semibold tracking-normal">
                {idea}
              </p>
              <p className="mt-2 text-[14px] leading-6 text-[#77777f]">
                Coming soon
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/contact"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#1d1d1f] px-7 text-[16px] font-medium text-white shadow-[0_10px_22px_rgba(0,0,0,0.16)] transition hover:-translate-y-0.5 hover:bg-black"
          >
            <MessageSquarePlus className="h-4 w-4" />
            Contact Us
          </Link>
          <Link
            href="/"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-7 text-[16px] font-medium text-[#1f1f23] shadow-[0_10px_22px_rgba(0,0,0,0.08)] ring-1 ring-black/5 transition hover:-translate-y-0.5 hover:bg-[#fbfbfc]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back Home
          </Link>
        </div>

        <p className="mt-10 text-[15px] text-[#8a8a91]">
          Expected launch in a future PocketDeck update.
        </p>
      </section>

      <Footer />
    </main>
  );
}
