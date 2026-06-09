"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import Footer from "@/app/components/footer";

import {
  Camera,
  FastForward,
  Mic,
  Play,
  Rewind,
  Volume2,
} from "lucide-react";
const changingWords = ["build.", "hustle.", "ship.", "code."];

export default function Home() {
  const [wordIndex, setWordIndex] = useState(0);
  const [activeSlide, setActiveSlide] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prevIndex) => (prevIndex + 1) % changingWords.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

useEffect(() => {
  const interval = setInterval(() => {
    setActiveSlide((prev) => (prev + 1) % 3);
  }, 3000);

  return () => clearInterval(interval);
}, []);
  return (
    
    <main className="min-h-screen bg-black text-white">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between border-b border-white/15 px-6">
        <div className="font-bold tracking-wide">PHONEDECK</div>

     <div className="hidden gap-9 text-sm text-white/70 md:flex">
  <a href="#built-for" className="transition hover:text-white">Built For</a>
  <a href="#how-it-works" className="transition hover:text-white">Controls</a>
  <a href="#pairing" className="transition hover:text-white">Pairing</a>

</div>

        <Link
  href="/download"
  className="border border-white px-7 py-3 text-xs font-bold uppercase tracking-[0.16em] text-white transition hover:bg-white hover:text-black"
>
  Download
</Link>
      </nav>

      <section className="mx-auto max-w-7xl px-6 py-24">
        
       <div className="mb-8 flex items-center gap-3">
  <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
  <span className="text-[11px] uppercase tracking-[0.3em] text-white/50">
    Connected
  </span>
</div>
       

        <h1 className="max-w-5xl text-[58px] font-bold uppercase leading-[0.9] tracking-[-0.04em] md:text-[96px]">
  <span className="block">
    THE{" "}
    <span className="bg-gradient-to-r from-[#4DA3FF] via-[#1C69D4] to-[#8EC5FF] bg-clip-text text-transparent">
      DECK
    </span>
  </span>

  <span className="block">
    ALREADY IN YOUR POCKET.
  </span>
</h1>

        <p className="mt-8 max-w-2xl text-lg font-light leading-8 text-white/65">
          A precision phone deck for media, apps, volume, brightness, trackpad
          mode and real-time Mac status.
        </p>

        <div className="mt-10 flex gap-4">
            <Link href="/download"
          className="border border-white bg-white px-8 py-4 text-xs font-bold uppercase tracking-[0.16em] text-black">
            Get PhoneDeck
          </Link> 

          <a href="#apps"  className="border border-white/50 px-8 py-4 text-xs font-bold uppercase tracking-[0.16em] text-white">
            Explore the App
          </a>
        </div>
      </section>

     <section id="how-it-works" className="border-y border-white/7 bg-black px-6 py-24">
  <div className="mx-auto max-w-6xl">
    <div className="relative mx-auto h-[340px] w-full max-w-[760px] rounded-[70px] bg-[#202020] p-[18px] shadow-[0_0_50px_rgba(255,255,255,0.08)]">
      <div className="relative h-full w-full overflow-hidden rounded-[52px] bg-black">
        <div
          className="flex h-full transition-transform duration-700 ease-in-out"
          style={{
            width: "300%",
            transform: `translateX(-${activeSlide * 33.333333}%)`,
          }}
        >
          <div className="flex h-full w-1/3 shrink-0 items-center justify-center">
            <SlideOne />
          </div>

          <div className="flex h-full w-1/3 shrink-0 items-center justify-center">
            <SlideTwo />
          </div>

          <div className="flex h-full w-1/3 shrink-0 items-center justify-center">
            <SlideThree />
          </div>
        </div>

        <div className="absolute right-6 top-1/2 h-24 w-1 -translate-y-1/2 bg-white" />

        <div className="absolute bottom-6 left-6 h-2 w-2 rounded-full bg-[#22c55e] shadow-[0_0_10px_rgba(34,197,94,0.9)]" />

        {/* inside dots */}
        <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-3">
          {[0, 1, 2].map((index) => (
            <button
              key={index}
              type="button"
              onClick={() => setActiveSlide(index)}
              className={`transition-all duration-300 ${
                activeSlide === index
                  ? "h-1.5 w-6 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.6)]"
                  : "h-1.5 w-1.5 rounded-full bg-white/25 hover:bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>
    </div>

    {/* outside dots */}
    <div className="mt-6 flex items-center justify-center gap-3">
      {[0, 1, 2].map((index) => (
        <button
          key={index}
          type="button"
          onClick={() => setActiveSlide(index)}
          className={`transition-all duration-300 ${
            activeSlide === index
              ? "h-2 w-8 rounded-full bg-white shadow-[0_0_12px_rgba(255,255,255,0.45)]"
              : "h-2 w-2 rounded-full bg-white/25 hover:bg-white/50"
          }`}
        />
      ))}
    </div>

    <div className="mt-16">
      <p className="mb-4 text-sm font-bold uppercase tracking-[0.16em] text-white/50">
        PhoneDeck System
      </p>

      <h2 className="max-w-4xl text-5xl font-bold uppercase leading-tight tracking-[-0.03em]">
        One phone. Every Mac control.
      </h2>

      <p className="mt-5 max-w-2xl text-white/60">
        Auto-swiping decks for apps, media and system controls.
      </p>
    </div>
  </div>
</section>

<section id="apps" className="bg-black px-6 py-24 text-white">
  <div className="mx-auto max-w-6xl">
    <p className="mb-4 text-xs font-semibold tracking-[0.35em] text-blue-400">
      APPS
    </p>

    <h2 className="max-w-3xl text-4xl font-bold tracking-tight md:text-6xl">
      Build your perfect control deck.
    </h2>

    <p className="mt-6 max-w-2xl text-lg leading-8 text-white/50">
      Explore upcoming PhoneDeck interfaces, customize layouts, and design
      your ideal Mac control experience.
    </p>

    <div className="mt-16 grid gap-5 md:grid-cols-3">
      <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-8">
        <p className="text-xl font-semibold">Mac Deck UI</p>

        <p className="mt-3 text-white/45">
          Preview and customize your Mac dashboard.
        </p>

        <span className="mt-6 inline-block rounded-full border border-white/10 px-3 py-1 text-xs text-white/40">
          Coming Soon
        </span>
      </div>

      <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-8">
        <p className="text-xl font-semibold">iPhone Controls</p>

        <p className="mt-3 text-white/45">
          Create personalized control layouts for your phone.
        </p>

        <span className="mt-6 inline-block rounded-full border border-white/10 px-3 py-1 text-xs text-white/40">
          Coming Soon
        </span>
      </div>

      <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-8">
        <p className="text-xl font-semibold">Deck Builder</p>

        <p className="mt-3 text-white/45">
          Drag, drop and arrange controls exactly how you want.
        </p>

        <span className="mt-6 inline-block rounded-full border border-white/10 px-3 py-1 text-xs text-white/40">
          Coming Soon
        </span>
      </div>
    </div>
  </div>
</section>
      
      <section id="built-for" className="scroll-mt-20 bg-black px-6 py-24 text-white">
  <div className="mx-auto max-w-6xl">
    <div className="text-center">
      <p className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-white/40">
        Built For
      </p>

      <h2 className="mx-auto max-w-5xl text-center text-5xl font-bold leading-[0.95] tracking-[-0.05em] md:text-7xl lg:text-[54px]">
      <span className="block text-white">
        Built for people
      </span>

      <span className="block text-white/70">
        who actually{" "}

        <AnimatePresence mode="wait">
          <motion.span
            key={changingWords[wordIndex]}
            initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -20, filter: "blur(8px)" }}
            transition={{ duration: 0.35 }}
            className="inline-block text-[#4DA3FF]"
          >
            {changingWords[wordIndex]}
          </motion.span>
        </AnimatePresence>
      </span>
    </h2>

      {/* <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/50">
        PhoneDeck is designed for builders, creators and anyone who wants faster
        Mac control without breaking focus.
      </p> */}
    </div>

    <div className="mt-20 grid gap-6 md:grid-cols-2">
      {[
        ["FOR DEVELOPERS", "Stay inside your flow.", "Launch apps, trigger commands and control your Mac without reaching for the mouse."],
        ["FOR CREATORS", "Control your setup live.", "Switch tools, manage media and keep your content moving from one clean deck."],
        ["FOR STUDENTS", "Move faster while working.", "Open tools, control sound and manage your Mac from your phone during study sessions."],
        ["FOR MINIMALISTS", "No extra hardware needed.", "Your iPhone becomes the control surface already sitting beside your Mac."],
      ].map(([label, title, body]) => (
        <div key={label} className="border border-white/10 bg-[#050505] p-8">
          <p className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-[#1c69d4]">
            {label}
          </p>
          <h3 className="text-3xl font-bold leading-tight tracking-[-0.03em]">
            {title}
          </h3>
          <p className="mt-5 leading-7 text-white/45">{body}</p>
        </div>
      ))}
    </div>
  </div>
</section>
{/* <section
  id="controls"
  className="border-t border-white/10 bg-black px-6 py-32 text-white"
>
  <div className="mx-auto max-w-6xl">
    <div className="text-center">
      <p className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-[#4DA3FF]">
        HOW IT WORKS
      </p>

      <h2 className="text-5xl font-bold tracking-[-0.04em] md:text-7xl">
        Set up in under a minute.
      </h2>

      <p className="mx-auto mt-6 max-w-2xl text-lg text-white/50">
        Download PhoneDeck, connect to your Mac and start controlling
        your setup instantly.
      </p>
    </div>

    <div className="mt-20 overflow-hidden rounded-[32px] border border-white/10">
      <div className="grid md:grid-cols-3">
        <div className="border-b border-white/10 p-10 md:border-b-0 md:border-r">
          <p className="mb-5 text-sm font-bold text-[#4DA3FF]">
            01
          </p>

          <h3 className="text-3xl font-bold">
            Get PhoneDeck
          </h3>

          <p className="mt-5 leading-7 text-white/50">
            Download PhoneDeck on your iPhone and install the Mac helper.
            Setup takes less than a minute.
          </p>
        </div>

        <div className="border-b border-white/10 p-10 md:border-b-0 md:border-r">
          <p className="mb-5 text-sm font-bold text-[#4DA3FF]">
            02
          </p>

          <h3 className="text-3xl font-bold">
            Connect Instantly
          </h3>

          <p className="mt-5 leading-7 text-white/50">
            PhoneDeck automatically discovers your Mac and establishes a secure connection.
          </p>
        </div>

        <div className="p-10">
          <p className="mb-5 text-sm font-bold text-[#4DA3FF]">
            03
          </p>

          <h3 className="text-3xl font-bold">
            Take Control
          </h3>

          <p className="mt-5 leading-7 text-white/50">
            Launch apps, control media, adjust volume, brightness and navigate your Mac.
          </p>
        </div>
      </div>
    </div>
  </div>
</section> */}

      <HowItWorksSection />
    
      <Footer />
    </main>
  );
}

function HowItWorksSection() {
  return (
    <section id="how-it-works" className="bg-black px-6 py-20 text-white">
      <div className="mx-auto max-w-6xl text-center">
        <p className="mb-5 text-xs font-semibold tracking-[0.35em] text-blue-400">
          HOW IT WORKS
        </p>

        <h2 className="text-3xl font-bold tracking-tight md:text-5xl">
          Set up in under a minute.
        </h2>

        <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-white/45">
          Download PhoneDeck, connect to your Mac and start controlling your
          setup instantly.
        </p>

        <div className="mx-auto mt-14 grid max-w-5xl overflow-hidden rounded-[28px] border border-white/10 md:grid-cols-3">
          <StepCard
            number="01"
            title="Get PhoneDeck"
            text="Download PhoneDeck on your iPhone and install the Mac helper. Setup takes less than a minute."
            type="download"
          />

          <StepCard
            number="02"
            title="Connect Instantly"
            text="PhoneDeck automatically discovers your Mac and establishes a secure connection."
            type="connect"
          />

          <StepCard
            number="03"
            title="Take Control"
            text="Launch apps, control media, adjust volume, brightness and navigate your Mac."
            type="control"
          />
        </div>
      </div>
    </section>
  );
}

function StepCard({
  number,
  title,
  text,
  type,
}: {
  number: string;
  title: string;
  text: string;
  type: "download" | "connect" | "control";
}) {
  return (
    <div className="relative flex min-h-[400px] flex-col border-white/10 p-7 text-left md:border-r last:border-r-0">
      <StepVisual type={type} />

      <p className="mb-6 text-xs font-bold tracking-widest text-blue-400">
        {number}
      </p>

      <h3 className="text-2xl font-semibold tracking-tight">{title}</h3>

      <p className="mt-4 max-w-sm text-base leading-7 text-white/45">{text}</p>
    </div>
  );
}

function StepVisual({ type }: { type: "download" | "connect" | "control" }) {
  return (
    <div className="relative mb-10 h-[125px] w-full overflow-hidden rounded-[24px] border border-white/10 bg-[#050505]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(59,130,246,0.16),transparent_45%)]" />

      <div className="absolute inset-0 flex items-center justify-center">
        {type === "download" && <DownloadMockup />}
        {type === "connect" && <ConnectMockup />}
        {type === "control" && <ControlMockup />}
      </div>
    </div>
  );
}

function DownloadMockup() {
  return (
    <div className="grid w-[384px] scale-[0.68] grid-cols-[240px_24px_62px] items-center justify-center gap-6">
      <div className="h-[98px] w-[240px] rounded-[24px] border border-white/10 bg-white/[0.04] p-3">
        <div className="mb-3 flex gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-500" />
          <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-blue-500/30 bg-blue-500/10 p-2">
          <div className="h-8 w-8 rounded-xl bg-blue-500/30 p-2">
            <div className="h-full w-full animate-pulse rounded-lg bg-blue-500" />
          </div>

          <div className="flex-1 space-y-2">
            <div className="h-2 w-20 rounded-full bg-white/35" />
            <div className="h-2 w-12 rounded-full bg-white/20" />
          </div>

          <div className="animate-pulse rounded-xl bg-blue-500 px-3 py-1.5 text-[10px] font-bold">
            GET
          </div>
        </div>
      </div>

      <div className="text-center text-blue-400 animate-pulse">↔</div>

      <div className="mx-auto h-[98px] w-[58px] rounded-[22px] border border-white/10 bg-white/[0.04] p-2">
        <div className="mx-auto mb-2 h-8 w-8 rounded-2xl border border-blue-500/40 bg-blue-500/10 p-2">
          <div className="h-full w-full animate-pulse rounded-xl bg-blue-500" />
        </div>

        <div className="mx-auto h-1.5 w-8 rounded-full bg-white/10" />

        <div className="mx-auto mt-2 rounded-xl bg-blue-500 px-2 py-1 text-center text-[8px] font-bold">
          GET
        </div>
      </div>
    </div>
  );
}

function ConnectMockup() {
  return (
    <div className="grid w-[384px] scale-[0.68] grid-cols-[240px_24px_62px] items-center justify-center gap-6">
      <div className="h-[98px] w-[240px] rounded-[24px] border border-white/10 bg-white/[0.04] p-4">
        <div className="mb-4 flex gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-500" />
          <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-green-500/30 bg-green-500/10 px-4 py-3">
          <span className="relative flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-green-400" />
          </span>

          <span className="text-sm font-medium text-green-400">
            iPhone connected
          </span>
        </div>
      </div>

      <div className="text-center text-green-400 animate-pulse">↔</div>

      <div className="mx-auto h-[98px] w-[62px] rounded-[22px] border border-white/10 bg-white/[0.04] p-3 text-center">
        <div className="mx-auto mb-3 h-3 w-3 rounded-full bg-green-400 shadow-[0_0_16px_rgba(74,222,128,0.8)]" />
        <div className="mx-auto h-1.5 w-10 rounded-full bg-green-400/40" />

        <p className="mt-3 text-[10px] leading-3 text-green-400">
          MacBook
          <br />
          Pro
        </p>
      </div>
    </div>
  );
}

function ControlMockup() {
  return (
    <div className="grid w-[384px] scale-[0.68] grid-cols-[240px_24px_62px] items-center justify-center gap-6">
      <div className="h-[98px] w-[240px] rounded-[24px] border border-white/10 bg-white/[0.04] p-3">
        <div className="mb-3 flex gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-500" />
          <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
        </div>

        <div className="grid grid-cols-4 gap-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className={`h-5 rounded-lg border border-white/10 bg-white/[0.06] ${
                i === 0
                  ? "animate-pulse border-purple-500/40 bg-purple-500/20"
                  : ""
              }`}
            />
          ))}
        </div>
      </div>

      <div className="text-center text-purple-400 animate-pulse">↔</div>

      <div className="mx-auto flex h-[98px] w-[62px] items-center justify-center gap-2 rounded-[22px] border border-white/10 bg-white/[0.04]">
        <div className="relative h-12 w-5 rounded-full bg-white/10">
          <div className="absolute bottom-2 left-1/2 h-5 w-5 -translate-x-1/2 animate-bounce rounded-full bg-purple-500/80" />
        </div>

        <div className="relative h-12 w-5 rounded-full bg-white/10">
          <div className="absolute bottom-3 left-1/2 h-4 w-4 -translate-x-1/2 rounded-full bg-white/20" />
        </div>
      </div>
    </div>
  );
}


function Tile({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-[112px] w-[112px] items-center justify-center rounded-[34px] bg-[#171717] text-4xl shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] ring-1 ring-white/10">
      {children}
    </div>
  );
}

function SlideOne() {
  const appIcons = [
    { id: "chrome", src: "/icons/chrome.png", alt: "Chrome" },
    { id: "youtube", src: "/icons/Youtube.png", alt: "Youtube" },
    { id: "discord", src: "/icons/discord.png", alt: "Discord" },
    { id: "music", src: "/icons/music.png", alt: "Music" },
    { id: "terminal", src: "/icons/terminal.png", alt: "Terminal" },
    { id: "whatsapp", src: "/icons/whatsapp.png", alt: "WhatsApp" },
    { id: "claude", src: "/icons/claude.png", alt: "Claude" },
    { id: "obs", src: "/icons/obs.png", alt: "OBS" },
  ];

  return (
    <div className="grid grid-cols-4 gap-6">
      {appIcons.map((icon) => (
        <div key={icon.id}>
          <Tile>
            <Image
              src={icon.src}
              alt={icon.alt}
              width={150}
              height={150}
              priority
            />
          </Tile>
        </div>
      ))}
    </div>
  );
}

function SlideTwo() {
  const controls = [Play, Mic, Camera, Rewind, FastForward, Volume2];
  const appIcons = [
    { src: "/icons/chrome.png", alt: "Chrome" },
    { src: "/icons/discord.png", alt: "Discord" },
  ];

  return (
    <div className="grid grid-cols-4 gap-6">
      {appIcons.map((icon) => (
        <Tile key={icon.src}>
          <Image
            src={icon.src}
            alt={icon.alt}
            width={150}
            height={150}
            priority
          />
        </Tile>
      ))}

      {controls.map((Icon, i) => (
        <Tile key={i}>
          <Icon className="h-10 w-10 text-white" />
        </Tile>
      ))}
    </div>
  );
}

function SlideThree() {
  const appIcons = [
    { src: "/icons/finder.png", alt: "Finder" },
    { src: "/icons/chrome.png", alt: "Chrome" },
    { src: "/icons/discord.png", alt: "Discord" },
  ];
  const controls = [Play, Mic, Camera, FastForward, Volume2];

  return (
    <div className="grid grid-cols-4 gap-6">
      {appIcons.map((icon) => (
        <Tile key={icon.src}>
          <Image
            src={icon.src}
            alt={icon.alt}
            width={150}
            height={150}
            priority
          />
        </Tile>
      ))}

      {controls.map((Icon, i) => (
        <Tile key={i}>
          <Icon className="h-10 w-10 text-white" />
        </Tile>
      ))}
    </div>
  );
}
