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
import {
  type DeckIconKey,
  type DeckPage as DeckPageData,
  type DeckTile as DeckTileData,
} from "@/app/lib/deck-layout";
import {
  cloneDeckPages,
  CLOUD_URL,
  createPhoneDeviceInfo,
  DECK_LAYOUT_CURRENT_EVENT,
  DECK_LAYOUT_REQUEST_EVENT,
  DECK_LAYOUT_STORAGE_KEY,
  DECK_LAYOUT_UPDATE_EVENT,
  readStoredDeckLayout,
  readStoredPhoneDeviceName,
  sanitizeDeckPages,
  writeStoredDeckLayout,
  writeStoredPhoneDeviceName,
} from "@/app/lib/deck-sync";

const iconMap: Record<DeckIconKey, LucideIcon> = {
  camera: Camera,
  finder: Folder,
  music: Music,
  play: Play,
  power: Power,
  search: Search,
  volume: Volume2,
  "volume-x": VolumeX,
};

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
  const lastLayoutRef = useRef("");
  const hasLoadedInitialLayoutRef = useRef(false);
  const [cloudOnline, setCloudOnline] = useState(false);
  const [macConnected, setMacConnected] = useState(false);
  const [phoneName, setPhoneName] = useState("");
  const [activeSlide, setActiveSlide] = useState(0);
  const [deckPages, setDeckPages] = useState<DeckPageData[]>(() =>
    cloneDeckPages()
  );
  const activeSlideIndex = Math.min(activeSlide, deckPages.length - 1);
  const activePage = deckPages[activeSlideIndex] ?? deckPages[0];
  const emptySlots = Math.max(0, 8 - activePage.tiles.length);

  useEffect(() => {
    const loadTimer = window.setTimeout(() => {
      setPhoneName(readStoredPhoneDeviceName());
    }, 0);

    return () => window.clearTimeout(loadTimer);
  }, []);

  useEffect(() => {
    const s = io(CLOUD_URL, {
      transports: ["websocket", "polling"],
    });

    function applyRemoteLayout(payload: unknown) {
      const nextPages = sanitizeDeckPages(payload);

      if (!nextPages) {
        return;
      }

      const serializedLayout = JSON.stringify(nextPages);

      if (serializedLayout === lastLayoutRef.current) {
        return;
      }

      lastLayoutRef.current = serializedLayout;
      hasLoadedInitialLayoutRef.current = true;
      writeStoredDeckLayout(nextPages);
      setDeckPages(nextPages);
      setActiveSlide(0);
    }

    s.on("connect", () => {
      connectedRef.current = true;
      setCloudOnline(true);
      setMacConnected(true);
      s.emit("register-phone", createPhoneDeviceInfo());
      s.emit("get-mac-status");
      s.emit(DECK_LAYOUT_REQUEST_EVENT);
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
    s.on(DECK_LAYOUT_CURRENT_EVENT, applyRemoteLayout);
    s.on(DECK_LAYOUT_UPDATE_EVENT, applyRemoteLayout);

    socketRef.current = s;

    return () => {
      connectedRef.current = false;
      setCloudOnline(false);
      setMacConnected(false);
      socketRef.current = null;
      s.disconnect();
    };
  }, []);

  function savePhoneName() {
    writeStoredPhoneDeviceName(phoneName);

    const socket = socketRef.current;

    if (socket?.connected) {
      socket.emit("register-phone", createPhoneDeviceInfo());
    }
  }

  useEffect(() => {
    const loadTimer = window.setTimeout(() => {
      if (hasLoadedInitialLayoutRef.current) {
        return;
      }

      const storedPages = readStoredDeckLayout();
      const initialPages = storedPages ?? cloneDeckPages();
      lastLayoutRef.current = JSON.stringify(initialPages);
      hasLoadedInitialLayoutRef.current = true;

      if (storedPages) {
        setDeckPages(storedPages);
        setActiveSlide(0);
      }
    }, 0);

    return () => window.clearTimeout(loadTimer);
  }, []);

  useEffect(() => {
    function handleStoredLayout(event: StorageEvent) {
      if (event.key !== DECK_LAYOUT_STORAGE_KEY || !event.newValue) {
        return;
      }

      try {
        const nextPages = sanitizeDeckPages(JSON.parse(event.newValue));

        if (!nextPages) {
          return;
        }

        const serializedLayout = JSON.stringify(nextPages);

        if (serializedLayout === lastLayoutRef.current) {
          return;
        }

        lastLayoutRef.current = serializedLayout;
        setDeckPages(nextPages);
      } catch {
        return;
      }
    }

    window.addEventListener("storage", handleStoredLayout);

    return () => window.removeEventListener("storage", handleStoredLayout);
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
        return Math.min(current + 1, deckPages.length - 1);
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

        <label className="mt-6 block max-w-sm">
          <span className="text-xs font-bold uppercase tracking-[0.22em] text-white/35">
            Phone Name
          </span>
          <input
            value={phoneName}
            onChange={(event) => setPhoneName(event.target.value)}
            onBlur={savePhoneName}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.currentTarget.blur();
              }
            }}
            placeholder="Shreyansh's iPhone"
            className="mt-2 w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-[#4DA3FF]"
          />
        </label>
      </section>

      <p className="text-center text-xs font-semibold uppercase tracking-[0.22em] text-white/35 sm:hidden">
        Rotate for full deck
      </p>

      <section
        className="relative aspect-[2.28/1] w-[min(calc(100vw_-_32px),704px)] touch-pan-y rounded-[34px] bg-[#202020] p-[8px] shadow-[0_0_70px_rgba(255,255,255,0.08)] sm:rounded-[46px] sm:p-[10px] md:rounded-[56px] md:p-[11px]"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="relative h-full w-full overflow-hidden rounded-[26px] bg-black sm:rounded-[36px] md:rounded-[44px]">
          <div className="absolute bottom-[13%] left-[3.4%] h-2 w-2 rounded-full bg-[#22c55e] shadow-[0_0_16px_rgba(34,197,94,0.9)] sm:h-2.5 sm:w-2.5" />

          <div className="flex h-full items-center justify-center px-[10%] pb-[10%] pt-[8%] sm:px-[12%]">
            <DeckGrid>
              {activePage.tiles.map((tile) => (
                <DeckTile
                  key={tile.id}
                  tile={tile}
                  onCommand={sendCommand}
                />
              ))}
              {Array.from({ length: emptySlots }).map((_, index) => (
                <div
                  key={`empty-${index}`}
                  aria-hidden="true"
                  className="h-[clamp(54px,13vw,112px)] w-[clamp(54px,13vw,112px)]"
                />
              ))}
            </DeckGrid>
          </div>

          {activeSlideIndex > 0 ? (
            <div className="absolute bottom-1 left-1/2 flex -translate-x-1/2 items-center gap-3 md:bottom-1.5">
              {deckPages.map((page, slide) => (
                <button
                  key={page.id}
                  type="button"
                  aria-label={`Show ${page.name} slide`}
                  onClick={() => setActiveSlide(slide)}
                  className={`h-1.5 w-1.5 rounded-full transition ${
                    activeSlideIndex === slide
                      ? "bg-white shadow-[0_0_10px_rgba(255,255,255,0.85)]"
                      : "bg-white/30"
                  }`}
                />
              ))}
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}

function DeckGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-4 gap-[clamp(10px,3vw,24px)]">
      {children}
    </div>
  );
}

function DeckTile({
  tile,
  onCommand,
}: {
  tile: DeckTileData;
  onCommand: (command: string) => void;
}) {
  const Icon = tile.icon ? iconMap[tile.icon] : null;

  return (
    <button
      type="button"
      aria-label={tile.label}
      onClick={() => onCommand(tile.command)}
      className="group flex h-[clamp(54px,13vw,112px)] w-[clamp(54px,13vw,112px)] items-center justify-center rounded-[clamp(18px,4vw,34px)] bg-[#171717] shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_18px_24px_rgba(0,0,0,0.45)] ring-1 ring-white/10 transition active:scale-95"
    >
      {tile.image ? (
        <Image
          src={tile.image}
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
