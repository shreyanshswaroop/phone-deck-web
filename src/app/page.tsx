"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  BadgeCheck,
  Camera,
  ChevronDown,
  CircleDot,
  Download,
  FastForward,
  Gauge,
  Grid2X2,
  Mic,
  MonitorSmartphone,
  MousePointer2,
  Music2,
  PanelBottom,
  Play,
  Rewind,
  SlidersHorizontal,
  Sparkles,
  Volume2,
  Zap,
} from "lucide-react";
import Footer from "@/app/components/footer";

const appIcons = [
  { src: "/icons/finder.png", alt: "Finder" },
  { src: "/icons/chrome.png", alt: "Chrome" },
  { src: "/icons/Youtube.png", alt: "YouTube" },
  { src: "/icons/discord.png", alt: "Discord" },
  { src: "/icons/music.png", alt: "Music" },
  { src: "/icons/terminal.png", alt: "Terminal" },
  { src: "/icons/whatsapp.png", alt: "WhatsApp" },
  { src: "/icons/claude.png", alt: "Claude" },
] as const;

const setupCards = [
  {
    title: "Pair once",
    body: "Open Deck Studio, scan your private code, and your iPhone is ready to command the Mac beside it.",
    Icon: MonitorSmartphone,
  },
  {
    title: "Choose your deck",
    body: "Arrange apps, media controls, shortcuts, and system actions into pages that match the way you work.",
    Icon: Grid2X2,
  },
  {
    title: "Tap from your phone",
    body: "Launch, mute, play, pause, switch, and control without leaving your keyboard or breaking focus.",
    Icon: MousePointer2,
  },
] as const;

const featureCards = [
  {
    title: "App Profiles",
    body: "Automatically surface the right actions for work, calls, coding, editing, or gaming.",
    Icon: Sparkles,
  },
  {
    title: "Hidden Dock",
    body: "Keep your Mac clean while your favorite apps stay one tap away on your phone.",
    Icon: PanelBottom,
  },
  {
    title: "Media Controls",
    body: "Control music, video, meetings, capture, and volume from a compact phone surface.",
    Icon: Music2,
  },
  {
    title: "System Actions",
    body: "Trigger brightness, audio, locks, screenshots, and common Mac utilities instantly.",
    Icon: SlidersHorizontal,
  },
] as const;

const faqItems = [
  {
    question: "What is PhoneDeck?",
    answer:
      "PhoneDeck turns your iPhone into a clean control surface for your Mac, with app launchers, media controls, shortcuts, and paired sessions.",
  },
  {
    question: "Does it need extra hardware?",
    answer:
      "No. Your iPhone is the deck, and your Mac runs the companion experience that receives paired commands.",
  },
  {
    question: "Can I customize the deck?",
    answer:
      "Yes. Deck Studio is built for arranging app tiles, controls, and workflows so the interface fits your setup.",
  },
  {
    question: "Is pairing private?",
    answer:
      "PhoneDeck uses a private pair code, so only the controller that joins the active session can send commands.",
  },
] as const;

const revealVariants: Variants = {
  hidden: { opacity: 0, y: 36, filter: "blur(10px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.75, ease: "easeOut" },
  },
};

const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.08,
    },
  },
};

const heroItem: Variants = {
  hidden: { opacity: 0, y: 26, scale: 0.98, filter: "blur(8px)" },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.85, ease: "easeOut" },
  },
};

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f7f7f8] text-[#1f1f23]">
      <SiteNav />

      <motion.section
        className="mx-auto flex max-w-5xl flex-col items-center px-5 pb-10 pt-8 text-center sm:pt-10"
        initial="hidden"
        animate="show"
        variants={staggerContainer}
      >
        <motion.h1
          variants={heroItem}
          className="max-w-4xl text-[42px] font-semibold leading-[1.03] tracking-normal text-[#1f1f23] sm:text-[58px] lg:text-[72px]"
        >
          Control your Mac from your iPhone.
        </motion.h1>

        <motion.p
          variants={heroItem}
          className="mt-6 max-w-2xl text-[18px] leading-[1.65] tracking-normal text-[#5d5d64] sm:text-[21px]"
        >
          Launch apps, trigger shortcuts, and manage media from a responsive
          phone deck that stays ready beside your keyboard.
        </motion.p>

        <motion.div
          variants={heroItem}
          className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <Link
            href="/download"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#1d1d1f] px-7 text-[16px] font-medium text-white shadow-[0_10px_22px_rgba(0,0,0,0.16)] transition hover:-translate-y-0.5 hover:bg-black"
          >
            <Download className="h-4 w-4" />
            Download Free
          </Link>

          <Link
            href="/deck-studio"
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#0a7af5] px-7 text-[16px] font-medium text-white shadow-[0_10px_22px_rgba(10,122,245,0.2)] transition hover:-translate-y-0.5 hover:bg-[#0569d6]"
          >
            Open Deck Studio
          </Link>
        </motion.div>

        <motion.p
          variants={heroItem}
          className="mt-6 text-[15px] leading-7 text-[#808087]"
        >
          Private pair code. No extra hardware. Built for macOS workflows.
        </motion.p>
      </motion.section>

      <motion.section
        className="mx-auto max-w-5xl px-5 pb-16"
        initial="hidden"
        animate="show"
        variants={heroItem}
      >
        <HeroDeckCarousel />
      </motion.section>

      <Reveal id="features" className="px-5 py-16">
        <div className="mx-auto max-w-5xl">
          <SectionHeading
            title="Set it up once. Use it every day."
            body="Design your favorite controls once, then reach for them from your phone whenever your workflow needs a fast command."
          />

          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {setupCards.map((card, index) => (
              <SetupCard key={card.title} card={card} index={index} />
            ))}
          </div>
        </div>
      </Reveal>

      <Reveal className="px-5 py-16">
        <div className="mx-auto max-w-5xl">
          <ShowcasePanel />
        </div>
      </Reveal>

      <Reveal className="px-5 py-16">
        <div className="mx-auto max-w-5xl">
          <SectionHeading
            title="Everything you need, hidden until you need it."
            body="PhoneDeck keeps your desk clean and your most-used commands close, with pages for apps, playback, calls, and Mac utilities."
          />

          <div className="mt-12 grid gap-5 md:grid-cols-2">
            <FeatureHero />

            {featureCards.map((card) => (
              <FeatureCard key={card.title} card={card} />
            ))}
          </div>
        </div>
      </Reveal>

      <Reveal id="deck" className="px-5 py-16">
        <div className="mx-auto max-w-5xl">
          <SectionHeading
            title="A deck that feels made for your setup."
            body="Bring your Mac apps, shortcuts, and media controls into one calm phone interface."
          />

          <motion.div
            className="mt-12 overflow-hidden rounded-[30px] border border-black/10 bg-white p-3 shadow-[0_20px_60px_rgba(0,0,0,0.1)]"
            whileHover={{ y: -6, scale: 1.01 }}
            transition={{ type: "spring", stiffness: 160, damping: 22 }}
          >
            <Image
              src="/desktop1.png"
              alt="PhoneDeck desktop control surface"
              width={2988}
              height={1960}
              className="h-auto w-full rounded-[22px] object-cover"
              priority
            />
          </motion.div>
        </div>
      </Reveal>

      <Reveal id="pricing" className="px-5 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-[38px] font-semibold leading-tight tracking-normal text-[#1f1f23] sm:text-[54px]">
            Simple pricing.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-[18px] leading-[1.6] text-[#5d5d64]">
            Start with the free download, pair your phone, and unlock more deck
            space as your setup grows.
          </p>

          <div className="mt-10 grid gap-5 text-left md:grid-cols-2">
            <PriceCard
              title="Starter"
              price="Free"
              body="Pair your iPhone, try core controls, and build a compact personal deck."
              action="Download"
              href="/download"
            />

            <PriceCard
              title="Pro Deck"
              price="Coming soon"
              body="More pages, deeper profiles, richer shortcuts, and advanced Mac control workflows."
              action="Request access"
              href="/request-feature"
              highlighted
            />
          </div>
        </div>
      </Reveal>

      <Reveal id="faq" className="px-5 py-12">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-center text-[32px] font-semibold leading-tight tracking-normal text-[#1f1f23] sm:text-[40px]">
            FAQ
          </h2>

          <div className="mx-auto mt-8 overflow-hidden rounded-[20px] border border-black/10 bg-[#f3f3f5] px-4 py-1 shadow-[0_10px_28px_rgba(0,0,0,0.04)] sm:px-5">
            {faqItems.map((item) => (
              <details
                key={item.question}
                className="group border-b border-black/10 last:border-b-0"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-3.5 text-left text-[15px] font-normal tracking-normal text-[#303035] marker:hidden sm:text-[16px] [&::-webkit-details-marker]:hidden">
                  <span>{item.question}</span>

                  <ChevronDown className="h-3.5 w-3.5 shrink-0 text-[#8a8a91] transition group-open:rotate-180" />
                </summary>

                <p className="-mt-1 max-w-xl pb-3.5 text-[13px] leading-6 text-[#5d5d64] sm:text-[14px]">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </Reveal>

      <Footer />
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
          <a href="#features" className="transition hover:text-[#1f1f23]">
            Features
          </a>

          <a href="#deck" className="transition hover:text-[#1f1f23]">
            Deck
          </a>

          <a href="#pricing" className="transition hover:text-[#1f1f23]">
            Pricing
          </a>

          <a href="#faq" className="transition hover:text-[#1f1f23]">
            FAQ
          </a>

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

function SectionHeading({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <h2 className="text-[34px] font-semibold leading-[1.08] tracking-normal text-[#1f1f23] sm:text-[48px]">
        {title}
      </h2>

      <p className="mx-auto mt-5 max-w-2xl text-[17px] leading-[1.65] text-[#5d5d64] sm:text-[19px]">
        {body}
      </p>
    </div>
  );
}

function HeroDeckCarousel() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isDeckSliding, setIsDeckSliding] = useState(false);
  const hasMountedDeck = useRef(false);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % 3);
    }, 3000);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!hasMountedDeck.current) {
      hasMountedDeck.current = true;
      return;
    }

    setIsDeckSliding(true);

    const timeout = window.setTimeout(() => {
      setIsDeckSliding(false);
    }, 720);

    return () => window.clearTimeout(timeout);
  }, [activeSlide]);

  return (
    <div className="mx-auto w-full">
      <motion.div
        className="relative left-1/2 h-[260px] w-screen max-w-[100vw] -translate-x-1/2 overflow-hidden sm:h-[340px] md:h-[400px]"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {[0, 1, 2].map((index) => (
          <DeckPreviewFrame
            key={index}
            index={index}
            activeSlide={activeSlide}
            isDeckSliding={isDeckSliding}
          >
            {index === 0 && <SlideOne />}
            {index === 1 && <SlideTwo />}
            {index === 2 && <SlideThree />}
          </DeckPreviewFrame>
        ))}
      </motion.div>

      <div className="mt-2 flex items-center justify-center gap-2.5">
        {[0, 1, 2].map((index) => (
          <button
            key={index}
            type="button"
            aria-label={`Show deck ${index + 1}`}
            onClick={() => setActiveSlide(index)}
            className={`cursor-pointer transition-all duration-300 ${
              activeSlide === index
                ? "h-2 w-7 rounded-full bg-[#0a7af5] shadow-[0_0_14px_rgba(10,122,245,0.25)]"
                : "h-2 w-2 rounded-full bg-black/15 hover:bg-black/35"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

function DeckPreviewFrame({
  index,
  activeSlide,
  isDeckSliding,
  children,
}: {
  index: number;
  activeSlide: number;
  isDeckSliding: boolean;
  children: React.ReactNode;
}) {
  const offset = index - activeSlide;
  const isActive = offset === 0;
  const isNeighbor = Math.abs(offset) === 1;
  const shouldShow = isActive || (isDeckSliding && isNeighbor);

  return (
    <div
      className={`absolute left-1/2 top-1/2 aspect-[2.28/1] w-[min(73.8vw,630px)] rounded-[34px] bg-[#242424] p-[12px] transition-[opacity,filter,transform] duration-700 ease-in-out sm:rounded-[46px] sm:p-[15px] md:rounded-[56px] md:p-[18px] ${
        isActive ? "z-20" : "z-10"
      } ${
        shouldShow
          ? isActive
            ? "opacity-100"
            : "opacity-15"
          : "opacity-0"
      } ${isActive ? "blur-0" : "blur-[3px]"}`}
      style={{
        transform: `translate(-50%, -50%) translateX(${offset * 92}%) scale(${
          isActive ? 1 : 0.92
        })`,
        pointerEvents: isActive ? "auto" : "none",
      }}
    >
      <div className="relative h-full w-full overflow-hidden rounded-[25px] bg-black sm:rounded-[34px] md:rounded-[42px]">
        <div className="flex h-full items-center justify-center">
          {children}
        </div>

        <div
          className={`absolute right-5 top-1/2 h-16 w-1 -translate-y-1/2 rounded-full bg-white shadow-[0_0_14px_rgba(255,255,255,0.8)] transition-opacity duration-300 md:right-6 md:h-24 ${
            isDeckSliding ? "opacity-100" : "opacity-0"
          }`}
        />

        <div className="absolute bottom-5 left-5 h-2 w-2 rounded-full bg-[#22c55e] shadow-[0_0_10px_rgba(34,197,94,0.9)] md:bottom-6 md:left-6" />

        <div className="absolute bottom-2 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2.5">
          {[0, 1, 2].map((dot) => (
            <span
              key={dot}
              className={`transition-all duration-300 ${
                activeSlide === dot
                  ? "h-1.5 w-6 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                  : "h-1.5 w-1.5 rounded-full bg-white/25"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function Tile({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      whileHover={{ scale: 1.06 }}
      className="flex h-[clamp(50px,12vw,108px)] w-[clamp(50px,12vw,108px)] items-center justify-center rounded-[clamp(16px,4vw,32px)] bg-[#171717] text-4xl shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_10px_28px_rgba(0,0,0,0.25)] ring-1 ring-white/10"
    >
      {children}
    </motion.div>
  );
}

function SlideOne() {
  const slideIcons = [
    { id: "chrome", src: "/icons/chrome.png", alt: "Chrome" },
    { id: "youtube", src: "/icons/Youtube.png", alt: "YouTube" },
    { id: "discord", src: "/icons/discord.png", alt: "Discord" },
    { id: "music", src: "/icons/music.png", alt: "Music" },
    { id: "terminal", src: "/icons/terminal.png", alt: "Terminal" },
    { id: "whatsapp", src: "/icons/whatsapp.png", alt: "WhatsApp" },
    { id: "claude", src: "/icons/claude.png", alt: "Claude" },
    { id: "obs", src: "/icons/obs.png", alt: "OBS" },
  ];

  return (
    <div className="grid grid-cols-4 gap-[clamp(8px,2.4vw,22px)]">
      {slideIcons.map((icon) => (
        <Tile key={icon.id}>
          <Image
            src={icon.src}
            alt={icon.alt}
            width={150}
            height={150}
            className="h-[82%] w-[82%] object-contain"
            priority
          />
        </Tile>
      ))}
    </div>
  );
}

function SlideTwo() {
  const controls = [
    Play,
    Mic,
    Camera,
    Rewind,
    FastForward,
    Volume2,
  ];

  const slideIcons = [
    { src: "/icons/chrome.png", alt: "Chrome" },
    { src: "/icons/discord.png", alt: "Discord" },
  ];

  return (
    <div className="grid grid-cols-4 gap-[clamp(8px,2.4vw,22px)]">
      {slideIcons.map((icon) => (
        <Tile key={icon.src}>
          <Image
            src={icon.src}
            alt={icon.alt}
            width={150}
            height={150}
            className="h-[82%] w-[82%] object-contain"
            priority
          />
        </Tile>
      ))}

      {controls.map((Icon, index) => (
        <Tile key={index}>
          <Icon className="h-[clamp(24px,6vw,42px)] w-[clamp(24px,6vw,42px)] text-white" />
        </Tile>
      ))}
    </div>
  );
}

function SlideThree() {
  const slideIcons = [
    { src: "/icons/finder.png", alt: "Finder" },
    { src: "/icons/chrome.png", alt: "Chrome" },
    { src: "/icons/discord.png", alt: "Discord" },
  ];

  const controls = [
    Play,
    Mic,
    Camera,
    FastForward,
    Volume2,
  ];

  return (
    <div className="grid grid-cols-4 gap-[clamp(8px,2.4vw,22px)]">
      {slideIcons.map((icon) => (
        <Tile key={icon.src}>
          <Image
            src={icon.src}
            alt={icon.alt}
            width={150}
            height={150}
            className="h-[82%] w-[82%] object-contain"
            priority
          />
        </Tile>
      ))}

      {controls.map((Icon, index) => (
        <Tile key={index}>
          <Icon className="h-[clamp(24px,6vw,42px)] w-[clamp(24px,6vw,42px)] text-white" />
        </Tile>
      ))}
    </div>
  );
}

function SetupCard({
  card,
  index,
}: {
  card: (typeof setupCards)[number];
  index: number;
}) {
  const Icon = card.Icon;

  return (
    <motion.article
      className="group flex min-h-[430px] flex-col overflow-hidden rounded-[24px] border border-black/8 bg-white shadow-[0_18px_48px_rgba(0,0,0,0.075)]"
      variants={revealVariants}
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 180, damping: 22 }}
    >
      <div className="flex h-[210px] items-center justify-center border-b border-black/8 bg-[#f6f6f7] px-5 shadow-[inset_0_-1px_0_rgba(255,255,255,0.7)]">
        {index === 0 ? (
          <PairMockup />
        ) : index === 1 ? (
          <DeckGridMockup />
        ) : (
          <ControlMockup />
        )}
      </div>

      <div className="flex flex-1 flex-col p-7">
        <div className="flex items-center justify-between">
          <span className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#90909a]">
            Step {String(index + 1).padStart(2, "0")}
          </span>

          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#eef5ff] text-[#0676f8] ring-1 ring-[#0676f8]/10">
            <Icon className="h-5 w-5" />
          </span>
        </div>

        <h3 className="mt-8 text-[24px] font-semibold leading-tight tracking-normal text-[#1f1f23]">
          {card.title}
        </h3>

        <p className="mt-3 text-[15px] leading-7 text-[#62626b]">
          {card.body}
        </p>
      </div>
    </motion.article>
  );
}

function PairMockup() {
  return (
    <div className="flex w-full max-w-[320px] items-center justify-center gap-4 rounded-[22px] border border-black/8 bg-white/80 px-5 py-8 shadow-[0_18px_40px_rgba(0,0,0,0.075)]">
      <motion.div
        className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[18px] border border-black/8 bg-white p-3 shadow-[0_12px_26px_rgba(0,0,0,0.1)]"
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <Image
          src="/icons/iphone.png"
          alt=""
          width={96}
          height={96}
          className="h-11 w-11 object-contain"
        />
      </motion.div>

      <motion.div
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#eaf4ff] text-[#0676f8] ring-1 ring-[#0676f8]/10"
        animate={{ scale: [1, 1.08, 1], opacity: [0.78, 1, 0.78] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      >
        <Zap className="h-5 w-5" />
      </motion.div>

      <motion.div
        className="w-36 shrink-0 rounded-[20px] border border-white/10 bg-[#1d1d1f] px-5 py-4 text-left shadow-[0_14px_32px_rgba(0,0,0,0.18)]"
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <p className="whitespace-nowrap text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
          Pair code
        </p>

        <p className="mt-2 whitespace-nowrap font-mono text-[20px] font-semibold tracking-[0.1em] text-white">
          PD-4281
        </p>
      </motion.div>
    </div>
  );
}

function DeckGridMockup() {
  return (
    <div className="grid grid-cols-4 gap-3 rounded-[22px] border border-black/8 bg-white/80 p-6 shadow-[0_18px_40px_rgba(0,0,0,0.075)]">
      {appIcons.map((icon, index) => (
        <motion.div
          key={icon.alt}
          className="flex h-[52px] w-[52px] items-center justify-center rounded-[15px] bg-[#1d1d1f] shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_10px_22px_rgba(0,0,0,0.14)]"
          animate={{ y: [0, index % 2 === 0 ? -4 : 4, 0] }}
          transition={{
            duration: 3.2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: index * 0.08,
          }}
        >
          <Image
            src={icon.src}
            alt=""
            width={44}
            height={44}
            className="h-8 w-8 object-contain"
          />
        </motion.div>
      ))}
    </div>
  );
}

function ControlMockup() {
  return (
    <motion.div
      className="relative h-36 w-full max-w-[286px] rounded-[26px] bg-[#1d1d1f] shadow-[0_22px_44px_rgba(0,0,0,0.22)]"
      animate={{ y: [0, -7, 0] }}
      transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
    >
      <div className="absolute inset-3 rounded-[20px] border border-white/12" />

      <div className="absolute left-6 top-6 flex items-center gap-3">
        <Image
          src="/icons/music.png"
          alt=""
          width={42}
          height={42}
          className="h-8 w-8 object-contain"
        />

        <div>
          <p className="text-[15px] font-medium text-white">Music</p>
          <p className="text-[12px] text-white/38">Now playing</p>
        </div>
      </div>

      <div className="absolute bottom-6 left-6 right-6 flex items-center gap-3">
        <Volume2 className="h-5 w-5 text-[#4da3ff]" />

        <div className="h-2 flex-1 rounded-full bg-white/12">
          <motion.div
            className="h-full rounded-full bg-[#4da3ff]"
            animate={{ width: ["42%", "72%", "58%", "42%"] }}
            transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </div>
    </motion.div>
  );
}
function ShowcaseDeck() {
  const [swapped, setSwapped] = useState(false);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setSwapped((prev) => !prev);
    }, 2000);

    return () => window.clearInterval(interval);
  }, []);

  const chrome = {
    id: "chrome",
    src: "/icons/chrome.png",
    alt: "Chrome",
  };

  const whatsapp = {
    id: "whatsapp",
    src: "/icons/whatsapp.png",
    alt: "WhatsApp",
  };

  const items = swapped
    ? [
        whatsapp,
        { id: "youtube", src: "/icons/Youtube.png", alt: "YouTube" },
        { id: "discord", src: "/icons/discord.png", alt: "Discord" },
        { id: "music", src: "/icons/music.png", alt: "Music" },

        { id: "terminal", src: "/icons/terminal.png", alt: "Terminal" },
        chrome,
        { id: "claude", src: "/icons/claude.png", alt: "Claude" },
        { id: "obs", src: "/icons/obs.png", alt: "OBS" },
      ]
    : [
        chrome,
        { id: "youtube", src: "/icons/Youtube.png", alt: "YouTube" },
        { id: "discord", src: "/icons/discord.png", alt: "Discord" },
        { id: "music", src: "/icons/music.png", alt: "Music" },

        { id: "terminal", src: "/icons/terminal.png", alt: "Terminal" },
        whatsapp,
        { id: "claude", src: "/icons/claude.png", alt: "Claude" },
        { id: "obs", src: "/icons/obs.png", alt: "OBS" },
      ];

  return (
    <div className="grid grid-cols-4 gap-4">
      {items.map((item) => {
        const isMoving =
          item.id === "chrome" || item.id === "whatsapp";

        return (
          <motion.div
            key={item.id}
            layout={isMoving}
            transition={
              isMoving
                ? {
                    layout: {
                      type: "spring",
                      stiffness: 120,
                      damping: 18,
                    },
                  }
                : undefined
            }
            className="flex h-[78px] w-[78px] items-center justify-center rounded-[22px] bg-[#171717] shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_10px_28px_rgba(0,0,0,0.25)] ring-1 ring-white/10"
          >
            <Image
              src={item.src}
              alt={item.alt}
              width={150}
              height={150}
              className="h-[88%] w-[88%] object-contain"
            />
          </motion.div>
        );
      })}
    </div>
  );
}

function ShowcasePanel() {
  return (
    <motion.div
      className="grid min-h-[400px] overflow-hidden rounded-[34px] bg-[#1d1d1f] p-8 text-white shadow-[0_22px_70px_rgba(0,0,0,0.18)] lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:p-12"
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 170, damping: 22 }}
    >
      <div>
        <BadgeCheck className="h-11 w-11 text-white" />

        <h2 className="mt-8 max-w-md text-[34px] font-semibold leading-[1.08] tracking-normal sm:text-[48px]">
          Ready before you reach for it.
        </h2>

        <p className="mt-5 max-w-lg text-[17px] leading-[1.65] text-white/58 sm:text-[19px]">
          Keep your Mac focused while PhoneDeck holds the shortcuts, apps, and
          playback controls you use all day.
        </p>
      </div>

      <div className="relative mt-16 lg:mt-0">
        <motion.div
          className="relative mx-auto w-full max-w-[430px]"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Deck outer shell */}
          <div className="relative aspect-[2.28/1] w-full rounded-[30px] bg-[#242424] p-[6px] shadow-[0_26px_60px_rgba(0,0,0,0.32)] ring-1 ring-white/5">
            {/* Deck screen */}
            <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-[25px] bg-black">
              <ShowcaseDeck />

              
             {/* Live deck */}
              <div className="absolute left-3 top-2 z-30">
                <span className="inline-flex items-center whitespace-nowrap rounded-full bg-[#3b3b3b]/90 px-3 py-1 text-[11px] font-medium leading-none text-white/70 backdrop-blur-md">
                  Live deck
                </span>
              </div>

              {/* Status */}
              <div className="absolute right-2 top-2 z-30">
                <CircleDot className="h-4 w-4 text-[#4da3ff]" strokeWidth={2.5} />
              </div>

              {/* Connection */}
              <div className="absolute bottom-4 left-4 h-2 w-2 rounded-full bg-[#22c55e] shadow-[0_0_10px_rgba(34,197,94,0.9)]" />

              {/* Pagination */}
              {/* <div className="absolute bottom-2 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-white/25" />
                <span className="h-1.5 w-1.5 rounded-full bg-white/25" />
                <span className="h-1.5 w-6 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
              </div> */}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
function FeatureHero() {
  return (
    <motion.article
      className="min-h-[260px] rounded-[28px] bg-[#1d1d1f] p-8 text-white shadow-[0_18px_55px_rgba(0,0,0,0.15)] md:col-span-2"
      variants={revealVariants}
      whileHover={{ y: -8, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 180, damping: 22 }}
    >
      <div className="grid gap-8 md:grid-cols-[0.45fr_1fr] md:items-center">
        <Gauge className="h-14 w-14 text-white" />

        <div>
          <h3 className="text-[30px] font-semibold leading-tight tracking-normal sm:text-[38px]">
            Fast controls, calm screen.
          </h3>

          <p className="mt-4 max-w-2xl text-[17px] leading-7 text-white/58">
            Put high-frequency Mac actions on your phone and keep your desktop
            reserved for the work itself.
          </p>
        </div>
      </div>
    </motion.article>
  );
}

function FeatureCard({
  card,
}: {
  card: (typeof featureCards)[number];
}) {
  const Icon = card.Icon;

  return (
    <motion.article
      className="min-h-[230px] rounded-[28px] border border-black/10 bg-white p-7 shadow-[0_18px_55px_rgba(0,0,0,0.08)]"
      variants={revealVariants}
      whileHover={{ y: -8, scale: 1.015 }}
      transition={{ type: "spring", stiffness: 180, damping: 22 }}
    >
      <Icon className="h-9 w-9 text-[#0676f8]" />

      <h3 className="mt-7 text-[25px] font-semibold tracking-normal text-[#1f1f23]">
        {card.title}
      </h3>

      <p className="mt-3 text-[16px] leading-7 text-[#5d5d64]">
        {card.body}
      </p>
    </motion.article>
  );
}

function PriceCard({
  title,
  price,
  body,
  action,
  href,
  highlighted,
}: {
  title: string;
  price: string;
  body: string;
  action: string;
  href: string;
  highlighted?: boolean;
}) {
  return (
    <motion.article
      className={`rounded-[28px] border p-6 shadow-[0_18px_55px_rgba(0,0,0,0.08)] ${
        highlighted
          ? "border-[#0a7af5] bg-[#0a7af5] text-white"
          : "border-black/10 bg-white text-[#1f1f23]"
      }`}
      variants={revealVariants}
      whileHover={{ y: -8, scale: 1.015 }}
      transition={{ type: "spring", stiffness: 180, damping: 22 }}
    >
      <h3 className="text-[22px] font-semibold tracking-normal">
        {title}
      </h3>

      <p className="mt-3 text-[30px] font-semibold tracking-normal">
        {price}
      </p>

      <p
        className={`mt-4 min-h-24 text-[16px] leading-7 ${
          highlighted ? "text-white/76" : "text-[#5d5d64]"
        }`}
      >
        {body}
      </p>

      <Link
        href={href}
        className={`mt-6 inline-flex min-h-11 items-center rounded-full px-6 text-[15px] font-medium ${
          highlighted
            ? "bg-white text-[#0a7af5]"
            : "bg-[#1d1d1f] text-white"
        }`}
      >
        {action}
      </Link>
    </motion.article>
  );
}

function Reveal({
  children,
  className,
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <motion.section
      id={id}
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.18 }}
      variants={staggerContainer}
    >
      <motion.div variants={revealVariants}>
        {children}
      </motion.div>
    </motion.section>
  );
}
