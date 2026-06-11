"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Footer from "@/app/components/footer";

import {
  Camera,
  FastForward,
  Mic,
  Palette,
  Smartphone,
  Code2,
  Gamepad2,
  Play,
  Rewind,
  Volume2,
} from "lucide-react";
const changingWords = ["build.", "hustle.", "ship.", "code."];

const builtForCards = [
  {
    label: "FOR DEVELOPERS",
    title: "Stay inside your flow.",
    body: "Launch apps, trigger commands and control your Mac without reaching for the mouse.",
    accent: "#4DA3FF",
    visual: "code",
    Icon: Code2,
  },
  {
    label: "FOR CREATORS",
    title: "Control your setup live.",
    body: "Switch tools, manage media and keep your content moving from one clean deck.",
    accent: "#ff4fd8",
    visual: "creator",
    Icon: Palette,
  },
  {
      label: "FOR GAMERS",
    title: "Stay locked into the game.",
    body: "Open Discord, mute audio, capture clips and switch tools without leaving the match.",
    accent: "#5865F2",
    visual: "gaming",
    Icon: Gamepad2,
  },
  {
    label: "FOR MINIMALISTS",
    title: "No extra hardware needed.",
    body: "Your iPhone becomes the control surface already sitting beside your Mac.",
    accent: "#f59e0b",
    visual: "minimal",
    Icon: Smartphone,
  },
] as const;

export default function Home() {
  const [wordIndex, setWordIndex] = useState(0);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isDeckSliding, setIsDeckSliding] = useState(false);
  const hasMountedDeck = useRef(false);
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
    
    <main className="min-h-screen overflow-x-hidden bg-black text-white">
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

        <div className="mt-10 flex flex-wrap gap-4">
            <Link
          href="/download"
          className="border border-white bg-white px-8 py-4 text-xs font-bold uppercase tracking-[0.16em] text-black">
            Get PhoneDeck
          </Link> 

          <Link
            href="/deck-studio"
            target="_blank"
            rel="noopener noreferrer"
            className="border border-white bg-white px-8 py-4 text-xs font-bold uppercase tracking-[0.16em] text-black"
          >
            Deck Studio
          </Link>

          <a href="#apps"  className="border border-white/50 px-8 py-4 text-xs font-bold uppercase tracking-[0.16em] text-white">
            Explore the App
          </a>
        </div>
      </section>

     <section id="controls" className="border-y border-white/7 bg-black px-6 py-20 md:py-24">
  <div className="mx-auto max-w-6xl">
    <div className="relative left-1/2 h-[250px] w-screen max-w-[100vw] -translate-x-1/2 overflow-hidden sm:h-[330px] md:h-[370px]">
      {[0, 1, 2].map((index) => (
        <DeckPreviewFrame
          key={index}
          index={index}
          activeSlide={activeSlide}
          isDeckSliding={isDeckSliding}
        >
          {index === 0 && (
            <SlideOne />
          )}

          {index === 1 && (
            <SlideTwo />
          )}

          {index === 2 && (
            <SlideThree />
          )}
        </DeckPreviewFrame>
      ))}
    </div>

    {/* outside dots */}
    <div className="mt-6 flex items-center justify-center gap-3">
	      {[0, 1, 2].map((index) => (
	        <button
	          key={index}
	          type="button"
	          onClick={() => setActiveSlide(index)}
	          className={`cursor-pointer transition-all duration-300 hover:scale-125 ${
	            activeSlide === index
	              ? "h-2 w-8 rounded-full bg-[#4DA3FF] shadow-[0_0_14px_rgba(77,163,255,0.6)]"
	              : "h-2 w-2 rounded-full bg-[#4DA3FF]/35 hover:bg-[#4DA3FF]/80"
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
        {builtForCards.map((card, index) => (
        <BuiltForCard key={card.label} card={card} index={index} />
    
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

      <PrivacySection />
    
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
          Install PocketDeck on your Mac, enter the pair code on your phone,
          and control the exact deck you designed.
        </p>

        <div className="mx-auto mt-14 grid max-w-5xl overflow-hidden rounded-[28px] border border-white/10 md:grid-cols-3">
          <StepCard
            number="01"
            title="Install PocketDeck"
            text="Download the Mac helper, open it from the menu bar, and let it sync your installed apps."
            type="download"
          />

          <StepCard
            number="02"
            title="Enter Pair Code"
            text="Deck Studio shows a private pair code. Enter it on the controller to join the same session."
            type="connect"
          />

          <StepCard
            number="03"
            title="Take Control"
            text="Tap synced app and control tiles from your phone to launch apps, play media, mute, lock, or capture your screen."
            type="control"
          />
        </div>
      </div>
    </section>
  );
}

function BuiltForCard({
  card,
  index,
}: {
  card: (typeof builtForCards)[number];
  index: number;
}) {
  const Icon = card.Icon;

  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55, delay: index * 0.08, ease: "easeOut" }}
      whileHover={{ y: -6 }}
      className="group relative min-h-[292px] overflow-hidden rounded-[28px] border border-white/10 bg-[#050505] p-8 transition-colors duration-300 hover:border-white/20"      style={{
        boxShadow: `inset 0 1px 0 rgba(255,255,255,0.05), 0 0 0 1px rgba(255,255,255,0.01)`,
      }}
    >
      <motion.div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px opacity-70"
        style={{
          background: `linear-gradient(90deg, transparent, ${card.accent}, transparent)`,
        }}
        animate={{ x: ["-55%", "55%", "-55%"] }}
        transition={{
          duration: 5.5 + index,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="relative z-10 flex items-start justify-between gap-6">
        <div>
          <p
            className="mb-5 text-xs font-bold uppercase tracking-[0.2em]"
            style={{ color: card.accent }}
          >
            {card.label}
          </p>

          <h3 className="max-w-md text-3xl font-bold leading-tight tracking-[-0.03em]">
            {card.title}
          </h3>

          <p className="mt-5 max-w-xl leading-7 text-white/45">{card.body}</p>
        </div>

        <motion.div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]"
          style={{ color: card.accent }}
          animate={{ y: [0, -4, 0] }}
          transition={{
            duration: 2.6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: index * 0.2,
          }}
        >
          <Icon className="h-5 w-5" />
        </motion.div>
      </div>

      <BuiltForVisual accent={card.accent} type={card.visual} index={index} />
    </motion.article>
  );
}

function BuiltForVisual({
  accent,
  type,
  index,
}: {
  accent: string;
  type: (typeof builtForCards)[number]["visual"];
  index: number;
}) {
  if (type === "code") {
    return (
      <div className="pointer-events-none absolute bottom-6 right-7 flex w-44 flex-col gap-2 opacity-55 transition-opacity duration-300 group-hover:opacity-90">
        {["open:VSCode", "mute", "screenshot"].map((command, i) => (
          <motion.div
            key={command}
            className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 font-mono text-[10px] text-white/55"
            animate={{ x: [0, i % 2 ? -5 : 5, 0] }}
            transition={{
              duration: 2.4 + i * 0.4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 0.15,
            }}
          >
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: accent }}
            />
            {command}
          </motion.div>
        ))}
      </div>
    );
  }

  if (type === "creator") {
    return (
      <div className="pointer-events-none absolute bottom-7 right-8 grid grid-cols-4 gap-2 opacity-55 transition-opacity duration-300 group-hover:opacity-90">
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.span
            key={i}
            className="h-8 w-8 rounded-xl border border-white/10 bg-white/[0.05]"
            style={{
              backgroundColor: i === 1 || i === 6 ? `${accent}33` : undefined,
              borderColor: i === 1 || i === 6 ? `${accent}80` : undefined,
            }}
            animate={{ scale: i === 1 || i === 6 ? [1, 1.12, 1] : [1, 0.96, 1] }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.08,
            }}
          />
        ))}
      </div>
    );
  }

 if (type === "gaming") {
    return (
      <div className="pointer-events-none absolute bottom-7 right-8 flex items-center gap-4 opacity-60 transition-opacity duration-300 group-hover:opacity-95">
        <motion.div
          className="relative flex h-16 w-16 items-center justify-center rounded-[22px] border border-white/10 bg-white/[0.05]"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        >
          <span
            className="absolute inset-0 rounded-[22px] opacity-25 blur-xl"
            style={{ backgroundColor: accent }}
          />
          <Image
            src="/icons/discord.png"
            alt=""
            width={44}
            height={44}
            className="relative h-11 w-11 object-contain"
          />
        </motion.div>

        <div className="flex h-14 items-end gap-1.5">
          {[22, 38, 28, 46, 18].map((height, i) => (
            <motion.span
              key={height}
              className="w-2.5 rounded-full"
              style={{ backgroundColor: accent, opacity: i === 3 ? 0.9 : 0.38 }}
              animate={{ height: [height, height + 14, height] }}
              transition={{
                duration: 0.9 + i * 0.08,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.06,
              }}
            />
          ))}
        </div>

        <motion.div
          className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em]"
          style={{ color: accent }}
          animate={{ opacity: [0.45, 1, 0.45] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          Voice
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pointer-events-none absolute bottom-7 right-8 flex items-center gap-3 opacity-55 transition-opacity duration-300 group-hover:opacity-90">
      <motion.div
        className="h-20 w-10 rounded-[18px] border border-white/10 bg-white/[0.04] p-1.5"
        animate={{ rotate: [0, -2, 2, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <div
          className="h-full rounded-[14px]"
          style={{
            background: `linear-gradient(180deg, ${accent}55, rgba(255,255,255,0.08))`,
          }}
        />
      </motion.div>

      <motion.div
        className="grid grid-cols-2 gap-1.5"
        animate={{ opacity: [0.45, 1, 0.45] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      >
        {Array.from({ length: 4 }).map((_, i) => (
          <span
            key={i}
            className="h-6 w-6 rounded-lg border border-white/10 bg-white/[0.05]"
            style={i === 0 ? { backgroundColor: `${accent}2f` } : undefined}
          />
        ))}
      </motion.div>
    </div>
  );
}

function PrivacySection() {
  return (
    <section className="border-y border-white/7 bg-black px-6 py-16 text-white">
      <div className="mx-auto grid max-w-4xl gap-7 p-2 md:grid-cols-[0.9fr_1.1fr] md:items-center">
        <div>
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.32em] text-[#4DA3FF]">
            Privacy
          </p>

          <h2 className="max-w-sm text-3xl font-bold leading-[0.98] tracking-[-0.05em] md:text-4xl">
            Only the right code
            <span className="block text-white/35">connects.</span>
          </h2>

          <p className="mt-4 max-w-md text-sm leading-6 text-white/42">
            PocketDeck creates a private paired session. The controller must
            enter the active key before it can see your deck or send commands.
          </p>
        </div>

        <div className="relative overflow-hidden rounded-[24px] border border-[#4DA3FF]/15 bg-black p-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_20%,rgba(77,163,255,0.14),transparent_38%)]" />

          <div className="relative flex items-center justify-between gap-3">
            <SecureNode label="Mac" sub="PocketDeck" />
            <SecureLine delay={0} />
            <SecureKey />
            <SecureLine delay={0.45} />
            <SecureNode label="Phone" sub="Controller" />
          </div>

          <div className="relative mt-5 grid gap-2 sm:grid-cols-3">
            {[
              "Pair code required",
              "Wrong code blocked",
              "Commands stay in session",
            ].map((item, index) => (
              <motion.div
                key={item}
                className="rounded-2xl border border-white/10 bg-white/[0.035] px-3 py-2 text-[11px] font-semibold text-white/50"
                animate={{
                  borderColor: [
                    "rgba(255,255,255,0.1)",
                    "rgba(77,163,255,0.45)",
                    "rgba(255,255,255,0.1)",
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: index * 0.28,
                }}
              >
                {item}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function SecureNode({ label, sub }: { label: string; sub: string }) {
  return (
    <div className="min-w-0 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
      <div className="flex items-center gap-2">
        <motion.span
          className="h-2 w-2 rounded-full bg-[#4DA3FF] shadow-[0_0_16px_rgba(77,163,255,0.8)]"
          animate={{ opacity: [0.35, 1, 0.35] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        />
        <p className="text-sm font-bold text-white">{label}</p>
      </div>

      <p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-white/30">
        {sub}
      </p>
    </div>
  );
}

function SecureLine({ delay }: { delay: number }) {
  return (
    <div className="relative h-px min-w-8 flex-1 overflow-hidden bg-white/10">
      <motion.span
        className="absolute inset-y-0 left-0 w-1/2 bg-[#4DA3FF]"
        animate={{ x: ["-100%", "220%"] }}
        transition={{
          duration: 1.7,
          repeat: Infinity,
          ease: "easeInOut",
          delay,
        }}
      />
    </div>
  );
}

function SecureKey() {
  return (
    <motion.div
      className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-full border border-[#4DA3FF]/35 bg-[#4DA3FF]/10 shadow-[0_0_28px_rgba(77,163,255,0.16)]"
      animate={{ scale: [1, 1.05, 1] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
    >
      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#8EC5FF]">
        Key
      </p>

      <p className="mt-1 font-mono text-[10px] font-bold text-white/65">
        PD-•••
      </p>
    </motion.div>
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

        <div className="flex items-center gap-3 rounded-2xl border border-blue-500/30 bg-blue-500/10 p-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/20 ring-1 ring-blue-400/30">
            <Image
              src="/icons/iphone.png"
              alt=""
              width={26}
              height={26}
              className="h-6 w-6 object-contain"
            />
          </div>

          <div className="flex-1 space-y-2">
            <div className="h-2 w-24 rounded-full bg-white/35" />
            <div className="h-2 w-16 rounded-full bg-blue-300/30" />
          </div>

          <div className="animate-pulse rounded-xl bg-blue-500 px-3 py-1.5 text-[9px] font-bold">
            OPEN
          </div>
        </div>
      </div>

      <div className="text-center text-blue-400 animate-pulse">↔</div>

      <div className="mx-auto h-[98px] w-[62px] rounded-[22px] border border-white/10 bg-white/[0.04] p-2.5 text-center">
        <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-2xl border border-blue-500/40 bg-blue-500/10">
          <span className="h-3 w-3 animate-pulse rounded-full bg-blue-400 shadow-[0_0_14px_rgba(96,165,250,0.8)]" />
        </div>

        <div className="mx-auto h-1.5 w-8 rounded-full bg-white/10" />

        <p className="mt-2 text-[8px] font-bold leading-3 text-blue-300">
          adn apps
          <br />
          synced
        </p>
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

        <div className="flex items-center justify-between gap-3 rounded-2xl border border-green-500/30 bg-green-500/10 px-4 py-3">
          <span className="relative flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-green-400" />
          </span>

          <span className="font-mono text-sm font-bold tracking-[0.28em] text-green-300">
            PD-XXXXX
          </span>
        </div>
      </div>

      <div className="text-center text-green-400 animate-pulse">↔</div>

      <div className="mx-auto h-[98px] w-[62px] rounded-[22px] border border-white/10 bg-white/[0.04] p-3 text-center">
        <div className="mx-auto mb-3 h-3 w-3 animate-pulse rounded-full bg-green-400 shadow-[0_0_16px_rgba(74,222,128,0.8)]" />
        <div className="mx-auto h-1.5 w-10 rounded-full bg-green-400/40" />

        <p className="mt-3 text-[10px] leading-3 text-green-400">
          Code
          <br />
          joined
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
              className={`h-5 rounded-lg border border-white/10 bg-white/[0.06] transition ${
                i === 0
                  ? "animate-pulse border-purple-500/40 bg-purple-500/20"
                  : ""
              }`}
            />
          ))}
        </div>
      </div>

      <div className="text-center text-purple-400 animate-pulse">→</div>

      <div className="mx-auto flex h-[98px] w-[62px] flex-col items-center justify-center gap-2 rounded-[22px] border border-white/10 bg-white/[0.04]">
        <div className="relative grid h-12 w-12 grid-cols-2 gap-1 rounded-2xl bg-white/10 p-1.5">
          <div className="animate-pulse rounded-md bg-purple-500/80 shadow-[0_0_14px_rgba(168,85,247,0.7)]" />
          <div className="rounded-md bg-white/15" />
          <div className="rounded-md bg-white/15" />
          <div className="rounded-md bg-white/15" />
        </div>

        <div className="h-1.5 w-8 rounded-full bg-purple-400/60" />
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
  const visibleOpacity = isActive ? "opacity-100" : "opacity-10";

  return (
    <div
      className={`absolute left-1/2 top-1/2 aspect-[2.28/1] w-[min(78vw,640px)] rounded-[34px] bg-[#202020] p-[12px] shadow-[0_0_50px_rgba(255,255,255,0.08)] transition-[opacity,filter,transform] duration-700 ease-in-out sm:rounded-[46px] sm:p-[16px] md:rounded-[56px] md:p-[18px] ${
        isActive ? "z-20" : "z-10"
      } ${shouldShow ? visibleOpacity : "opacity-0"} ${
        isActive ? "blur-0" : "blur-[3px]"
      }`}
      style={{
        transform: `translate(-50%, -50%) translateX(${offset * 92}%) scale(${
          isActive ? 1 : 0.92
        })`,
        pointerEvents: isActive ? "auto" : "none",
      }}
    >
      <div className="relative h-full w-full overflow-hidden rounded-[26px] bg-black sm:rounded-[34px] md:rounded-[42px]">
        <div className="flex h-full items-center justify-center">{children}</div>

        <div
          className={`absolute right-5 top-1/2 h-20 w-1 -translate-y-1/2 rounded-full bg-white shadow-[0_0_14px_rgba(255,255,255,0.8)] transition-opacity duration-300 md:right-6 md:h-24 ${
            isDeckSliding ? "opacity-100" : "opacity-0"
          }`}
        />

        <div className="absolute bottom-5 left-5 h-2 w-2 rounded-full bg-[#22c55e] shadow-[0_0_10px_rgba(34,197,94,0.9)] md:bottom-6 md:left-6" />

        <div className="absolute bottom-1 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2.5 md:bottom-1.5 md:gap-3">
          {[0, 1, 2].map((dot) => (
            <span
              key={dot}
              className={`transition-all duration-300 ${
                activeSlide === dot
                  ? "h-1.5 w-6 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.6)]"
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
    <div className="flex h-[clamp(54px,13vw,112px)] w-[clamp(54px,13vw,112px)] items-center justify-center rounded-[clamp(18px,4vw,34px)] bg-[#171717] text-4xl shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] ring-1 ring-white/10">
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
    <div className="grid grid-cols-4 gap-[clamp(10px,3vw,24px)]">
      {appIcons.map((icon) => (
        <div key={icon.id}>
          <Tile>
            <Image
              src={icon.src}
              alt={icon.alt}
              width={150}
              height={150}
              className="h-[82%] w-[82%] object-contain"
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
    <div className="grid grid-cols-4 gap-[clamp(10px,3vw,24px)]">
      {appIcons.map((icon) => (
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

      {controls.map((Icon, i) => (
        <Tile key={i}>
          <Icon className="h-[clamp(24px,6vw,40px)] w-[clamp(24px,6vw,40px)] text-white" />
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
    <div className="grid grid-cols-4 gap-[clamp(10px,3vw,24px)]">
      {appIcons.map((icon) => (
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

      {controls.map((Icon, i) => (
        <Tile key={i}>
          <Icon className="h-[clamp(24px,6vw,40px)] w-[clamp(24px,6vw,40px)] text-white" />
        </Tile>
      ))}
    </div>
  );
}
