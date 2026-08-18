"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle2,
  Download,
  MonitorDown,
  PanelTop,
  ShieldCheck,
  Smartphone,
  Sparkles,
} from "lucide-react";

const pocketDeckDownloadHref =
  process.env.NEXT_PUBLIC_POCKETDECK_DOWNLOAD_URL ||
  "/downloads/PocketDeck-mac-arm64.zip";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28, filter: "blur(8px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.06 } },
};

const steps = [
  {
    number: "01",
    title: "Download",
    text: "Download the Mac helper, unzip it, and move PocketDeck into Applications.",
    Icon: MonitorDown,
  },
  {
    number: "02",
    title: "Open",
    text: "Launch PocketDeck and keep it running quietly from the menu bar.",
    Icon: PanelTop,
  },
  {
    number: "03",
    title: "Customize",
    text: "Use Deck Studio to arrange apps, shortcuts, and controls for your phone.",
    Icon: Sparkles,
  },
  {
    number: "04",
    title: "Control",
    text: "Open the controller on your phone and tap tiles to control your Mac.",
    Icon: Smartphone,
  },
] as const;

export default function DownloadPage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f7f7f8] text-[#1f1f23]">
      <SiteNav />

      <Reveal className="px-5 pb-20 pt-14 sm:pt-20">
        <section className="mx-auto max-w-5xl text-center">
          <p className="text-[13px] font-semibold uppercase tracking-[0.36em] text-[#0a7af5]">
            PhoneDeck
          </p>
          <h1 className="mx-auto mt-8 max-w-4xl text-[48px] font-semibold leading-[1.02] tracking-normal sm:text-[72px] lg:text-[90px]">
            Download PocketDeck for Mac.
          </h1>
          <p className="mx-auto mt-8 max-w-3xl text-[19px] leading-[1.6] text-[#5d5d64] sm:text-[23px]">
            Install the Mac helper, open it from the menu bar, then design the
            controls you want on your iPhone.
          </p>

          <div className="mt-10 flex justify-center">
            <span className="inline-flex min-h-12 items-center gap-3 rounded-full bg-white px-6 text-[16px] font-medium text-[#5d5d64] shadow-[0_12px_30px_rgba(0,0,0,0.1)] ring-1 ring-black/5">
              <CheckCircle2 className="h-5 w-5 text-[#0a7af5]" />
              macOS Apple Silicon
            </span>
          </div>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href={pocketDeckDownloadHref}
              download
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#1d1d1f] px-7 text-[16px] font-medium text-white shadow-[0_10px_22px_rgba(0,0,0,0.16)] transition hover:-translate-y-0.5 hover:bg-black"
            >
              <Download className="h-4 w-4" />
              Download Mac App
            </a>
            <Link
              href="/"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-7 text-[16px] font-medium text-[#1f1f23] shadow-[0_10px_22px_rgba(0,0,0,0.08)] ring-1 ring-black/5 transition hover:-translate-y-0.5 hover:bg-[#fbfbfc]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back Home
            </Link>
          </div>

          <p className="mt-8 text-[16px] text-[#8a8a91]">
            PocketDeck is currently unsigned while the first release is being
            prepared.
          </p>
        </section>
      </Reveal>

      <Reveal className="px-5 py-16">
        <section className="mx-auto max-w-5xl">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-[34px] font-semibold leading-[1.08] tracking-normal sm:text-[48px]">
              Set up the Mac helper, then design your deck.
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-[17px] leading-[1.65] text-[#5d5d64] sm:text-[19px]">
              PocketDeck runs in your Mac menu bar, syncs your installed apps,
              and executes commands from your phone controller.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => (
              <SetupStep key={step.number} step={step} />
            ))}
          </div>
        </section>
      </Reveal>

      <Reveal className="px-5 py-16">
        <section className="mx-auto grid max-w-5xl gap-6 rounded-[32px] bg-white p-7 shadow-[0_20px_60px_rgba(0,0,0,0.08)] ring-1 ring-black/5 lg:grid-cols-[0.65fr_1fr] lg:items-center lg:p-10">
          <div className="flex h-16 w-16 items-center justify-center rounded-[20px] bg-[#fff7df] text-[#a46a00]">
            <ShieldCheck className="h-8 w-8" />
          </div>

          <div>
            <p className="text-[13px] font-semibold uppercase tracking-[0.24em] text-[#a46a00]">
              macOS security note
            </p>
            <h3 className="mt-4 text-[28px] font-semibold tracking-normal">
              If macOS says PocketDeck is damaged
            </h3>
            <p className="mt-4 max-w-3xl text-[16px] leading-7 text-[#5d5d64]">
              Safari can add a quarantine flag to downloaded apps. Until
              PocketDeck is signed and notarized, remove that flag once after
              moving the app to Applications.
            </p>
            <code className="mt-5 block overflow-x-auto rounded-2xl bg-[#f2f2f4] px-4 py-3 text-sm text-[#3a3a40] ring-1 ring-black/5">
              xattr -dr com.apple.quarantine /Applications/PocketDeck.app
            </code>
            <p className="mt-4 text-[14px] text-[#8a8a91]">
              Then right-click PocketDeck in Finder and choose Open.
            </p>
          </div>
        </section>
      </Reveal>

      <Reveal className="px-5 py-20 text-center">
        <section className="mx-auto max-w-3xl">
          <h2 className="text-[40px] font-semibold leading-tight sm:text-[58px]">
            Ready to build your phone deck?
          </h2>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/deck-studio"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#0a7af5] px-7 text-[16px] font-medium text-white shadow-[0_10px_22px_rgba(10,122,245,0.2)] transition hover:-translate-y-0.5 hover:bg-[#0569d6]"
            >
              Open Deck Studio
            </Link>

            <Link
              href="/deck"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-7 text-[16px] font-medium text-[#1f1f23] shadow-[0_10px_22px_rgba(0,0,0,0.08)] ring-1 ring-black/5 transition hover:-translate-y-0.5 hover:bg-[#fbfbfc]"
            >
              Open Controller
            </Link>
          </div>
        </section>
      </Reveal>
    </main>
  );
}

function SiteNav() {
  return (
    <motion.header
      className="relative z-30 bg-[#f7f7f8] px-5 py-4 sm:py-5"
      initial={{ opacity: 0, y: -20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, ease: "easeOut", delay: 0.08 }}
    >
      <nav className="relative mx-auto flex max-w-5xl items-center justify-center">
        <Link
          href="/"
          className="absolute left-0 text-[18px] font-semibold tracking-normal text-[#1f1f23] transition hover:text-black"
        >
          pocketdeck
        </Link>

        <div className="flex items-center justify-center gap-8 text-[16px] font-medium text-[#686879]">
          <Link href="/" className="transition hover:text-[#1f1f23]">
            Home
          </Link>
          <Link href="/#features" className="transition hover:text-[#1f1f23]">
            Features
          </Link>
          <Link href="/#deck" className="transition hover:text-[#1f1f23]">
            Deck
          </Link>
          <Link href="/apps" className="transition hover:text-[#1f1f23]">
            Apps
          </Link>
        </div>

        <div className="absolute right-0">
          <Link
            href="/download"
            className="inline-flex min-h-10 items-center justify-center rounded-full bg-white px-6 text-[15px] font-semibold text-black shadow-[0_12px_30px_rgba(0,0,0,0.11)] ring-1 ring-black/5 transition hover:-translate-y-0.5 hover:bg-[#fbfbfc]"
          >
            Download
          </Link>
        </div>
      </nav>
    </motion.header>
  );
}

function SetupStep({ step }: { step: (typeof steps)[number] }) {
  const Icon = step.Icon;

  return (
    <motion.article
      className="min-h-[260px] rounded-[28px] border border-black/10 bg-white p-6 shadow-[0_18px_55px_rgba(0,0,0,0.08)]"
      variants={fadeUp}
      whileHover={{ y: -8, scale: 1.015 }}
      transition={{ type: "spring", stiffness: 180, damping: 22 }}
    >
      <Icon className="h-8 w-8 text-[#0a7af5]" />
      <p className="mt-7 text-[12px] font-semibold uppercase tracking-[0.2em] text-[#8a8a91]">
        {step.number}
      </p>
      <h3 className="mt-4 text-[24px] font-semibold tracking-normal">
        {step.title}
      </h3>
      <p className="mt-3 text-[16px] leading-7 text-[#5d5d64]">{step.text}</p>
    </motion.article>
  );
}

function Reveal({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.18 }}
      variants={stagger}
    >
      <motion.div variants={fadeUp}>{children}</motion.div>
    </motion.div>
  );
}
