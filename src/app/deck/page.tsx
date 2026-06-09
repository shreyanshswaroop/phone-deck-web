"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  Camera,
  Folder,
  Music,
  Play,
  Power,
  Search,
  Volume2,
  VolumeX,
  Wifi,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { io, Socket } from "socket.io-client";

const CLOUD_URL = "https://phone-deck-cloud.onrender.com";

const deckApps = [
  { label: "Chrome", image: "/icons/chrome.png", command: "chrome" },
  { label: "YouTube", image: "/icons/Youtube.png", command: "youtube" },
  { label: "Discord", image: "/icons/discord.png", command: "discord" },
  { label: "Music", image: "/icons/music.png", command: "music" },
  { label: "Terminal", image: "/icons/terminal.png", command: "terminal" },
  { label: "WhatsApp", image: "/icons/whatsapp.png", command: "whatsapp" },
  { label: "Claude", image: "/icons/claude.png", command: "claude" },
  { label: "OBS", image: "/icons/obs.png", command: "obs" },
];

const deckControls = [
  { label: "Finder", icon: Folder, command: "finder" },
  { label: "Spotify", icon: Music, command: "spotify" },
  { label: "Play/Pause", icon: Play, command: "playpause" },
  { label: "Mute", icon: VolumeX, command: "mute" },
  { label: "Unmute", icon: Volume2, command: "unmute" },
  { label: "Camera", icon: Camera, command: "camera" },
  { label: "Spotlight", icon: Search, command: "spotlight" },
  { label: "Sleep", icon: Power, command: "sleep" },
];

function readMacConnected(data: unknown) {
  if (
    data &&
    typeof data === "object" &&
    "connected" in data &&
    typeof data.connected === "boolean"
  ) {
    return data.connected;
  }

  return null;
}

export default function DeckPage() {
  const socketRef = useRef<Socket | null>(null);
  const connectedRef = useRef(false);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const [cloudOnline, setCloudOnline] = useState(false);
  const [macConnected, setMacConnected] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const s = io(CLOUD_URL, {
      transports: ["websocket", "polling"],
    });

    s.on("connect", () => {
      connectedRef.current = true;
      setCloudOnline(true);
      setMacConnected(true);
      s.emit("get-mac-status");
    });

    s.on("disconnect", () => {
      connectedRef.current = false;
      setCloudOnline(false);
      setMacConnected(false);
    });

    s.on("command-error", (data) => {
      if (!data?.message || data.message.includes("Mac")) {
        setMacConnected(false);
      }
    });

    s.on("mac-connected", () => setMacConnected(true));
    s.on("mac-disconnected", () => setMacConnected(false));
    s.on("mac-status", (data) => {
      const connected = readMacConnected(data);

      if (connected !== null) {
        setMacConnected(connected);
      }
    });
    s.on("mac-status-update", (data) => {
      const connected = readMacConnected(data);

      if (connected !== null) {
        setMacConnected(connected);
      }
    });

    socketRef.current = s;

    return () => {
      connectedRef.current = false;
      setCloudOnline(false);
      setMacConnected(false);
      socketRef.current = null;
      s.disconnect();
    };
  }, []);

  function sendCommand(command: string) {
    const socket = socketRef.current;

    if (!socket || !connectedRef.current) {
      return;
    }

    socket.emit("phone-command", { command });
    setMacConnected(true);
  }

  function handleTouchStart(event: React.TouchEvent<HTMLElement>) {
    const touch = event.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  }

  function handleTouchEnd(event: React.TouchEvent<HTMLElement>) {
    if (!touchStartRef.current) {
      return;
    }

    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;
    touchStartRef.current = null;

    if (Math.abs(deltaX) < 45 || Math.abs(deltaX) < Math.abs(deltaY)) {
      return;
    }

    setActiveSlide((current) => {
      if (deltaX < 0) {
        return Math.min(current + 1, 1);
      }

      return Math.max(current - 1, 0);
    });
  }

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center gap-5 overflow-x-hidden bg-black p-4 text-white sm:gap-8">
      <section className="w-[min(calc(100vw_-_32px),920px)] rounded-[30px] border border-white/10 bg-[#101010] p-6 shadow-[0_0_70px_rgba(255,255,255,0.06)] sm:rounded-[50px] sm:p-10">
        <div className="flex flex-col items-start gap-5 sm:flex-row sm:justify-between sm:gap-6">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.42em] text-[#4da3ff] sm:text-base sm:tracking-[0.5em]">
              PhoneDeck Cloud
            </p>
            <h1 className="mt-3 text-4xl font-bold tracking-[-0.06em] sm:mt-4 sm:text-6xl">
              Controller
            </h1>
          </div>

          <div
            className={`flex shrink-0 items-center gap-3 rounded-full px-5 py-3 text-base font-bold sm:px-6 sm:text-xl ${
              cloudOnline
                ? "bg-emerald-400/10 text-emerald-400"
                : "bg-red-400/10 text-red-400"
            }`}
          >
            <span
              className={`h-4 w-4 rounded-full ${
                cloudOnline ? "bg-emerald-400" : "bg-red-400"
              }`}
            />
            {cloudOnline ? "Cloud Online" : "Cloud Offline"}
          </div>
        </div>

        <div
          className={`mt-7 flex items-center gap-3 text-xl sm:mt-8 sm:gap-4 sm:text-2xl ${
            macConnected ? "text-emerald-400" : "text-white/45"
          }`}
        >
          <Wifi className="h-7 w-7 sm:h-8 sm:w-8" />
          {macConnected ? "Mac is connected" : "Mac is not connected"}
        </div>
      </section>

      <p className="text-center text-xs font-semibold uppercase tracking-[0.22em] text-white/35 sm:hidden">
        Rotate for full deck
      </p>

      <section
        className="relative aspect-[2.28/1] w-[min(calc(100vw_-_32px),920px)] touch-pan-y rounded-[34px] bg-[#202020] p-[12px] shadow-[0_0_70px_rgba(255,255,255,0.08)] sm:rounded-[70px] sm:p-[22px]"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="relative h-full w-full overflow-hidden rounded-[24px] bg-black sm:rounded-[56px]">
          <div className="absolute bottom-[13%] left-[3.4%] h-2 w-2 rounded-full bg-[#22c55e] shadow-[0_0_16px_rgba(34,197,94,0.9)] sm:h-2.5 sm:w-2.5" />

          <div className="flex h-full items-center justify-center px-[10%] pb-[10%] pt-[8%] sm:px-[12%]">
            {activeSlide === 0 ? (
              <DeckGrid>
                {deckApps.map((app) => (
                  <DeckTile
                    key={app.command}
                    label={app.label}
                    command={app.command}
                    image={app.image}
                    onCommand={sendCommand}
                  />
                ))}
              </DeckGrid>
            ) : (
              <DeckGrid>
                {deckControls.map((control) => (
                  <DeckTile
                    key={control.command}
                    label={control.label}
                    command={control.command}
                    icon={control.icon}
                    onCommand={sendCommand}
                  />
                ))}
              </DeckGrid>
            )}
          </div>

          <div className="absolute bottom-[9.5%] left-1/2 flex -translate-x-1/2 items-center gap-3">
            {[0, 1].map((slide) => (
              <button
                key={slide}
                type="button"
                aria-label={`Show slide ${slide + 1}`}
                onClick={() => setActiveSlide(slide)}
                className={`transition ${
                  activeSlide === slide
                    ? "h-1.5 w-8 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.85)]"
                    : "h-1.5 w-1.5 rounded-full bg-white/30"
                }`}
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function DeckGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-4 gap-[clamp(8px,2.5vw,34px)]">
      {children}
    </div>
  );
}

function DeckTile({
  label,
  command,
  image,
  icon: Icon,
  onCommand,
}: {
  label: string;
  command: string;
  image?: string;
  icon?: LucideIcon;
  onCommand: (command: string) => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={() => onCommand(command)}
      className="group flex h-[clamp(54px,10.5vw,136px)] w-[clamp(54px,10.5vw,136px)] items-center justify-center rounded-[clamp(18px,3vw,38px)] bg-[#171717] shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_18px_24px_rgba(0,0,0,0.45)] ring-1 ring-white/10 transition active:scale-95"
    >
      {image ? (
        <Image
          src={image}
          alt=""
          width={150}
          height={150}
          className="h-[80%] w-[80%] object-contain transition group-active:scale-90"
          priority
        />
      ) : Icon ? (
        <Icon className="h-[42%] w-[42%] text-white transition group-active:scale-90" />
      ) : null}
    </button>
  );
}
