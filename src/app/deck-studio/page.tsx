"use client";

import Image from "next/image";
import Link from "next/link";
import { type DragEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  Camera,
  ChevronDown,
  Trash2,
  Folder,
  HelpCircle,
  Info,
  MonitorSmartphone,
  Music,
  Play,
  Plus,
  Power,
  Search,
  Settings,
  Volume2,
  VolumeX,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { io, type Socket } from "socket.io-client";
import {
  defaultDeckPages,
  type DeckIconKey,
  type DeckPage,
  type DeckTile as DeckTileData,
} from "@/app/lib/deck-layout";
import {
  cloneDeckPages,
  CLOUD_URL,
  createDeckLayoutPayload,
  DECK_LAYOUT_CURRENT_EVENT,
  DECK_LAYOUT_REQUEST_EVENT,
  DECK_LAYOUT_UPDATE_EVENT,
  PHONE_CONNECTED_EVENT,
  PHONE_DISCONNECTED_EVENT,
  PHONE_STATUS_EVENT,
  PHONE_STATUS_REQUEST_EVENT,
  readStoredDeckLayout,
  sanitizeDeckPages,
  sanitizePhoneDeviceInfo,
  type PhoneDeviceInfo,
  writeStoredDeckLayout,
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

const TILE_DRAG_DATA_TYPE = "application/x-phonedeck-tile";
const defaultPageIds = new Set(defaultDeckPages.map((page) => page.id));

type TileDragPayload =
  | {
      type: "deck";
      tileId: string;
    }
  | {
      type: "library";
      tile: DeckTileData;
    };

function readTileDragPayload(event: DragEvent<HTMLElement>) {
  try {
    const payload = event.dataTransfer.getData(TILE_DRAG_DATA_TYPE);

    if (!payload) {
      return null;
    }

    return JSON.parse(payload) as TileDragPayload;
  } catch {
    return null;
  }
}

export default function BuilderPage() {
  const socketRef = useRef<Socket | null>(null);
  const lastLayoutRef = useRef("");
  const hasLoadedInitialLayoutRef = useRef(false);
  const [pages, setPages] = useState<DeckPage[]>(() => cloneDeckPages());
  const [activePageId, setActivePageId] = useState(defaultDeckPages[0].id);
  const [selectedTileId, setSelectedTileId] = useState<string | null>(null);
  const [cloudOnline, setCloudOnline] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<number | null>(null);
  const [editingPageId, setEditingPageId] = useState<string | null>(null);
  const [editingPageName, setEditingPageName] = useState("");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [appSearch, setAppSearch] = useState("");
  const [connectedPhone, setConnectedPhone] = useState<PhoneDeviceInfo | null>(
    null
  );
  const activePage =
    pages.find((page) => page.id === activePageId) ?? pages[0];
  const activePageFull = activePage.tiles.length >= 8;

  const libraryTiles = useMemo(
    () => defaultDeckPages.flatMap((page) => page.tiles),
    []
  );
  const filteredLibraryTiles = useMemo(() => {
    const query = appSearch.trim().toLowerCase();

    if (!query) {
      return libraryTiles;
    }

    return libraryTiles.filter((tile) =>
      `${tile.label} ${tile.command}`.toLowerCase().includes(query)
    );
  }, [appSearch, libraryTiles]);

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
        setPages(storedPages);
        setActivePageId(storedPages[0]?.id ?? defaultDeckPages[0].id);
        setSelectedTileId(null);
      }
    }, 0);

    return () => window.clearTimeout(loadTimer);
  }, []);

  useEffect(() => {
    const socket = io(CLOUD_URL, {
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
      setPages(nextPages);
      setActivePageId(nextPages[0]?.id ?? defaultDeckPages[0].id);
      setSelectedTileId(null);
      setLastSyncedAt(Date.now());
    }

    function applyPhoneStatus(payload: unknown) {
      const phone = sanitizePhoneDeviceInfo(payload);

      if (!phone) {
        return;
      }

      setConnectedPhone(phone.connected ? phone : null);
    }

    socket.on("connect", () => {
      setCloudOnline(true);
      socket.emit("register-builder");
      socket.emit(DECK_LAYOUT_REQUEST_EVENT);
      socket.emit(PHONE_STATUS_REQUEST_EVENT);
    });

    socket.on("disconnect", () => {
      setCloudOnline(false);
      setConnectedPhone(null);
    });

    socket.on(DECK_LAYOUT_CURRENT_EVENT, applyRemoteLayout);
    socket.on(DECK_LAYOUT_UPDATE_EVENT, applyRemoteLayout);
    socket.on(PHONE_CONNECTED_EVENT, applyPhoneStatus);
    socket.on(PHONE_STATUS_EVENT, applyPhoneStatus);
    socket.on(PHONE_DISCONNECTED_EVENT, () => setConnectedPhone(null));

    socketRef.current = socket;

    return () => {
      socketRef.current = null;
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!hasLoadedInitialLayoutRef.current) {
      return;
    }

    const serializedLayout = JSON.stringify(pages);

    if (serializedLayout === lastLayoutRef.current) {
      return;
    }

    lastLayoutRef.current = serializedLayout;
    writeStoredDeckLayout(pages);

    const syncTimer = window.setTimeout(() => {
      const socket = socketRef.current;

      if (!socket?.connected) {
        return;
      }

      socket.emit(DECK_LAYOUT_UPDATE_EVENT, createDeckLayoutPayload(pages));
      setLastSyncedAt(Date.now());
    }, 250);

    return () => window.clearTimeout(syncTimer);
  }, [pages]);

  function removeTileById(tileId: string) {
    setPages((currentPages) =>
      currentPages.map((page) =>
        page.id === activePage.id
          ? {
              ...page,
              tiles: page.tiles.filter((tile) => tile.id !== tileId),
            }
          : page
      )
    );
    setSelectedTileId(null);
  }

  function createTileCopy(tile: DeckTileData) {
    return {
      ...tile,
      id: `${tile.id}-${Date.now()}`,
    };
  }

  function addTileToActivePage(tile: DeckTileData, insertIndex?: number) {
    if (activePage.tiles.length >= 8) {
      return;
    }

    const tileCopy = createTileCopy(tile);

    setPages((currentPages) =>
      currentPages.map((page) =>
        page.id === activePage.id
          ? {
              ...page,
              tiles:
                typeof insertIndex === "number"
                  ? [
                      ...page.tiles.slice(0, insertIndex),
                      tileCopy,
                      ...page.tiles.slice(insertIndex),
                    ].slice(0, 8)
                  : [...page.tiles, tileCopy],
            }
          : page
      )
    );
    setSelectedTileId(tileCopy.id);
  }

  function moveTileInActivePage(tileId: string, targetIndex: number) {
    setPages((currentPages) =>
      currentPages.map((page) => {
        if (page.id !== activePage.id) {
          return page;
        }

        const fromIndex = page.tiles.findIndex((tile) => tile.id === tileId);

        if (fromIndex === -1 || fromIndex === targetIndex) {
          return page;
        }

        const nextTiles = [...page.tiles];
        const [movingTile] = nextTiles.splice(fromIndex, 1);
        const safeTargetIndex =
          fromIndex < targetIndex ? targetIndex - 1 : targetIndex;
        nextTiles.splice(safeTargetIndex, 0, movingTile);

        return {
          ...page,
          tiles: nextTiles,
        };
      })
    );
    setSelectedTileId(tileId);
  }

  function handleDeckDrop(event: DragEvent<HTMLElement>, targetIndex: number) {
    event.preventDefault();
    event.stopPropagation();

    const payload = readTileDragPayload(event);

    if (!payload) {
      return;
    }

    if (payload.type === "deck") {
      moveTileInActivePage(payload.tileId, targetIndex);
      return;
    }

    addTileToActivePage(payload.tile, targetIndex);
  }

  function createPage() {
    const nextPageNumber = pages.length + 1;
    const newPage = {
      id: `page-${Date.now()}`,
      name: `Page ${nextPageNumber}`,
      tiles: [],
    };

    setPages((currentPages) => [...currentPages, newPage]);
    setActivePageId(newPage.id);
    setSelectedTileId(null);
  }

  function deletePage(pageId: string) {
    if (defaultPageIds.has(pageId) || pages.length <= 1) {
      return;
    }

    const pageIndex = pages.findIndex((page) => page.id === pageId);
    const nextPages = pages.filter((page) => page.id !== pageId);
    const nextActivePage =
      nextPages[Math.max(0, pageIndex - 1)] ?? nextPages[0] ?? defaultDeckPages[0];

    setPages(nextPages);

    if (activePageId === pageId) {
      setActivePageId(nextActivePage.id);
    }

    setSelectedTileId(null);
  }

  function startEditingPageName(page: DeckPage) {
    setActivePageId(page.id);
    setSelectedTileId(null);
    setEditingPageId(page.id);
    setEditingPageName(page.name);
  }

  function saveEditingPageName() {
    if (!editingPageId) {
      return;
    }

    const nextName = editingPageName.trim();

    setPages((currentPages) =>
      currentPages.map((page) =>
        page.id === editingPageId
          ? { ...page, name: nextName || page.name }
          : page
      )
    );
    setEditingPageId(null);
    setEditingPageName("");
  }

  function cancelEditingPageName() {
    setEditingPageId(null);
    setEditingPageName("");
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="grid min-h-screen items-start lg:grid-cols-[340px_1fr]">
        <aside className="bg-black p-4 lg:sticky lg:top-5 lg:self-start lg:p-5">
          <div className="flex min-h-[calc(100vh-32px)] flex-col rounded-[30px] border border-white/[0.13] bg-white/[0.055] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.10),0_28px_80px_rgba(0,0,0,0.48)] backdrop-blur-2xl lg:h-[calc(100vh-40px)] lg:min-h-0">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/[0.12] bg-white/[0.045] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
                <MonitorSmartphone className="h-5 w-5 text-[#4DA3FF]" />
              </div>
              <div>
                <p className="text-base font-bold tracking-wide">PhoneDeck</p>
                <p className="text-sm text-white/40">Command Center</p>
              </div>
            </div>

            <div className="mt-7 grid grid-cols-[58px_1fr] items-center gap-4 rounded-[26px] border border-white/[0.12] bg-black/25 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/[0.12] bg-white/[0.035]">
                <MonitorSmartphone className="h-7 w-7 text-white/75" />
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-bold">
                  {connectedPhone?.name ?? "No phone connected"}
                </p>
                <div
                  className={`mt-1 flex items-center gap-2 text-xs font-semibold ${
                    connectedPhone ? "text-emerald-400" : "text-white/35"
                  }`}
                >
                  <span
                    className={`h-2 w-2 rounded-full ${
                      connectedPhone
                        ? "bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]"
                        : "bg-white/25"
                    }`}
                  />
                  {connectedPhone ? "Connected" : "Waiting"}
                </div>
                <p className="mt-1 truncate text-xs text-white/35">
                  {connectedPhone?.detail ?? "Open /deck on your phone"}
                </p>
              </div>
            </div>

            <div className="mt-8 min-h-0 flex-1 overflow-y-auto pr-1">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-white/35">
                Pages
              </p>

              <div className="space-y-2">
                {pages.map((page, index) => {
                  const canDeletePage = !defaultPageIds.has(page.id);

                  return (
                    <div
                      key={page.id}
                      className={`group flex w-full items-center gap-3 rounded-[22px] border p-3 transition ${
                        activePage.id === page.id
                          ? "border-[#4DA3FF]/45 bg-[#4DA3FF]/[0.12] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
                          : "border-white/[0.11] bg-black/[0.18] hover:border-white/20 hover:bg-white/[0.04]"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          setActivePageId(page.id);
                          setSelectedTileId(null);
                        }}
                        className="flex min-w-0 flex-1 items-center gap-3 rounded-xl px-1 py-1 text-left"
                      >
                        <MiniPagePreview tiles={page.tiles} />

                        <div className="min-w-0 flex-1">
                          {editingPageId === page.id ? (
                            <input
                              value={editingPageName}
                              autoFocus
                              onClick={(event) => event.stopPropagation()}
                              onDoubleClick={(event) => event.stopPropagation()}
                              onChange={(event) =>
                                setEditingPageName(event.target.value)
                              }
                              onBlur={saveEditingPageName}
                              onKeyDown={(event) => {
                                if (event.key === "Enter") {
                                  event.currentTarget.blur();
                                }

                                if (event.key === "Escape") {
                                  event.preventDefault();
                                  cancelEditingPageName();
                                }
                              }}
                              className="w-full rounded-lg border border-[#4DA3FF]/40 bg-black/60 px-2 py-1 text-sm font-semibold text-white outline-none"
                            />
                          ) : (
                            <p
                              onDoubleClick={(event) => {
                                event.stopPropagation();
                                startEditingPageName(page);
                              }}
                              className="truncate text-sm font-semibold"
                            >
                              {page.name}
                            </p>
                          )}
                          <p className="text-xs text-white/35">
                            Page {index + 1} · {page.tiles.length}/8
                          </p>
                        </div>
                      </button>

                      {canDeletePage ? (
                        <button
                          type="button"
                          aria-label={`Delete ${page.name}`}
                          onClick={() => deletePage(page.id)}
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white/30 opacity-0 transition hover:bg-red-400/10 hover:text-red-300 group-hover:opacity-100"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      ) : null}
                    </div>
                  );
                })}

                <button
                  type="button"
                  onClick={createPage}
                  className="flex w-full items-center justify-center gap-2 rounded-[22px] border border-dashed border-white/15 px-3 py-4 text-sm font-semibold text-white/40 transition hover:border-[#4DA3FF]/40 hover:text-[#4DA3FF]"
                >
                  <Plus className="h-4 w-4" />
                  New Page
                </button>
              </div>
            </div>

            <div className="mt-8 border-t border-white/10 pt-3">
              <button
                type="button"
                onClick={() => setSettingsOpen((open) => !open)}
                aria-expanded={settingsOpen}
                className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm font-semibold text-white/65 transition hover:bg-white/[0.055] hover:text-white"
              >
                <Settings className="h-4 w-4 text-white/45" />
                <span className="min-w-0 flex-1">Settings</span>
                <ChevronDown
                  className={`h-4 w-4 text-white/35 transition ${
                    settingsOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {settingsOpen ? (
                <div className="mt-2 space-y-1">
                  <Link
                    href="/"
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/70 transition hover:bg-white/[0.055] hover:text-white"
                  >
                    <Info className="h-4 w-4 text-white/45" />
                    <span className="min-w-0 flex-1">About PhoneDeck</span>
                    <span className="text-xs text-white/30">v0.1.0</span>
                  </Link>

                  <Link
                    href="/contact"
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/70 transition hover:bg-white/[0.055] hover:text-white"
                  >
                    <HelpCircle className="h-4 w-4 text-white/45" />
                    <span>Help & Feedback</span>
                  </Link>
                </div>
              ) : null}
            </div>
          </div>
        </aside>

        <section className="min-w-0 p-5 lg:p-8">
          <header className="flex flex-col gap-5 border-b border-white/10 pb-6 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#4DA3FF]">
                Design
              </p>
              <h1 className="mt-2 text-4xl font-bold tracking-[-0.05em]">
                {activePage.name}
              </h1>
              <p className="mt-2 max-w-xl text-sm text-white/45">
                Drag apps into the deck. Select a tile to reveal its remove
                control.
              </p>
            </div>

            <div className="flex flex-col items-start gap-3 md:items-end">
              <div
                className={`flex items-center gap-3 rounded-full px-4 py-2 text-sm font-bold ${
                  cloudOnline
                    ? "bg-emerald-400/10 text-emerald-400"
                    : "bg-white/10 text-white/45"
                }`}
              >
                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    cloudOnline
                      ? "bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]"
                      : "bg-white/30"
                  }`}
                />
                {cloudOnline
                  ? lastSyncedAt
                    ? "Cloud Synced"
                    : "Cloud Ready"
                  : "Local Only"}
              </div>

              <Link
                href="/deck"
                className="inline-flex h-12 items-center justify-center rounded-full border border-white/[0.16] bg-white/[0.075] px-8 text-sm font-bold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_0_0_5px_rgba(255,255,255,0.045),0_18px_55px_rgba(0,0,0,0.42)] backdrop-blur-2xl transition hover:border-white/25 hover:bg-white/[0.11]"
              >
                Open Controller
              </Link>
            </div>
          </header>

          <div className="mt-8">
            <div className="relative min-w-0">
              <div className="pointer-events-none absolute inset-x-6 top-8 h-[520px] rounded-full bg-black/70 blur-3xl" />
              <div className="relative px-6 pb-6">
                <div className="flex min-h-[420px] items-center justify-center">
                  <DeckPreview
                    pages={pages}
                    activePageId={activePage.id}
                    selectedTileId={selectedTileId}
                    onSelectTile={setSelectedTileId}
                    onRemoveTile={removeTileById}
                    onAddTile={addTileToActivePage}
                    onDropTile={handleDeckDrop}
                  />
                </div>

                <div className="mt-8">
                  <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/35">
                      Apps On This Mac
                    </p>

                    <label className="flex h-10 w-full items-center gap-2 rounded-full border border-white/10 bg-white/[0.045] px-3 text-white/55 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl transition focus-within:border-[#4DA3FF]/45 focus-within:text-white sm:max-w-[260px]">
                      <Search className="h-4 w-4 shrink-0" />
                      <input
                        value={appSearch}
                        onChange={(event) => setAppSearch(event.target.value)}
                        placeholder="Search apps"
                        className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/35"
                      />
                      <span className="text-xs text-white/30">
                        {filteredLibraryTiles.length}
                      </span>
                    </label>
                  </div>

                  {filteredLibraryTiles.length > 0 ? (
                    <div
                      className={`grid grid-cols-4 place-items-center gap-x-5 gap-y-8 transition sm:grid-cols-5 md:grid-cols-7 xl:grid-cols-7 ${
                        activePageFull
                          ? "pointer-events-none opacity-60 saturate-75"
                          : "opacity-100"
                      }`}
                    >
                      {filteredLibraryTiles.map((tile) => (
                        <LibraryTile
                          key={tile.id}
                          tile={tile}
                          disabled={activePageFull}
                          onAddTile={addTileToActivePage}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-[22px] border border-dashed border-white/10 px-5 py-8 text-center text-sm text-white/40">
                      No apps found.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function DeckPreview({
  pages,
  activePageId,
  selectedTileId,
  onSelectTile,
  onRemoveTile,
  onAddTile,
  onDropTile,
}: {
  pages: DeckPage[];
  activePageId: string;
  selectedTileId: string | null;
  onSelectTile: (tileId: string) => void;
  onRemoveTile: (tileId: string) => void;
  onAddTile: (tile: DeckTileData, insertIndex?: number) => void;
  onDropTile: (event: DragEvent<HTMLElement>, targetIndex: number) => void;
}) {
  const activePageIndex = Math.max(
    0,
    pages.findIndex((page) => page.id === activePageId)
  );

  function allowDrop(event: DragEvent<HTMLElement>) {
    event.preventDefault();
  }

  return (
    <div className="relative aspect-[1.99/1] w-full max-w-[640px] rounded-[34px] bg-[#202020] shadow-[0_0_50px_rgba(255,255,255,0.08)] sm:rounded-[46px] md:rounded-[56px]">
      <div className="absolute inset-[12px] overflow-hidden rounded-[26px] bg-black sm:inset-[16px] sm:rounded-[34px] md:inset-[18px] md:rounded-[42px]">
        <div className="absolute bottom-5 left-5 h-2 w-2 rounded-full bg-[#22c55e] shadow-[0_0_10px_rgba(34,197,94,0.9)] md:bottom-6 md:left-6" />
        <div className="absolute right-4 top-1/2 z-30 h-20 w-1 -translate-y-1/2 rounded-full bg-white ] md:right-5 md:h-24" />

        <div
          className="relative h-full"
          onDragOver={allowDrop}
          onDrop={(event) => {
            const payload = readTileDragPayload(event);

            if (payload?.type === "library") {
              event.preventDefault();
              onAddTile(payload.tile);
            }
          }}
        >
          {pages.map((page, pageIndex) => {
            const offset = pageIndex - activePageIndex;
            const isActivePage = page.id === activePageId;
            const emptySlots = Math.max(0, 8 - page.tiles.length);

            return (
              <div
                key={page.id}
                className={`absolute inset-0 flex items-center justify-center transition-[opacity,transform,filter] duration-700 ease-in-out ${
                  isActivePage
                    ? "z-20 opacity-100 blur-0"
                    : "z-10 opacity-10 blur-[2px]"
                }`}
                style={{
                  transform: `translateX(${offset * 92}%) scale(${
                    isActivePage ? 1 : 0.92
                  })`,
                  pointerEvents: isActivePage ? "auto" : "none",
                }}
              >
                <div className="grid grid-cols-4 gap-[clamp(10px,3vw,24px)]">
                  {page.tiles.map((tile, index) => (
                    <DeckPreviewTile
                      key={tile.id}
                      tile={tile}
                      selected={tile.id === selectedTileId}
                      onSelectTile={onSelectTile}
                      onRemoveTile={onRemoveTile}
                      onDropTile={(event) => onDropTile(event, index)}
                    />
                  ))}

                  {Array.from({ length: emptySlots }).map((_, index) => (
                    <div
                      key={`empty-${index}`}
                      onDragOver={allowDrop}
                      onDrop={(event) =>
                        onDropTile(event, page.tiles.length + index)
                      }
                      className="flex h-[clamp(54px,13vw,112px)] w-[clamp(54px,13vw,112px)] items-center justify-center rounded-[clamp(18px,4vw,34px)] border border-dashed border-white/10 bg-white/[0.015] transition hover:border-[#4DA3FF]/35"
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* <div className="absolute bottom-1 left-1/2 flex -translate-x-1/2 items-center gap-3 md:bottom-1.5">
          <span className="h-1.5 w-6 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.6)]" />
          <span className="h-1.5 w-1.5 rounded-full bg-white/30" />
        </div> */}
      </div>
    </div>
  );
}

function DeckPreviewTile({
  tile,
  selected,
  onSelectTile,
  onRemoveTile,
  onDropTile,
}: {
  tile: DeckTileData;
  selected: boolean;
  onSelectTile: (tileId: string) => void;
  onRemoveTile: (tileId: string) => void;
  onDropTile: (event: DragEvent<HTMLDivElement>) => void;
}) {
  const Icon = tile.icon ? iconMap[tile.icon] : null;

  return (
    <div
      draggable
      onDragStart={(event) => {
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setData(
          TILE_DRAG_DATA_TYPE,
          JSON.stringify({ type: "deck", tileId: tile.id })
        );
      }}
      onDragOver={(event) => event.preventDefault()}
      onDrop={onDropTile}
      className={`relative h-[clamp(54px,13vw,112px)] w-[clamp(54px,13vw,112px)] rounded-[clamp(18px,4vw,34px)] bg-[#171717] shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_18px_24px_rgba(0,0,0,0.45)] ring-1 transition ${
        selected
          ? "ring-[#4DA3FF] shadow-[0_0_24px_rgba(77,163,255,0.25)]"
          : "ring-white/10 hover:ring-white/25"
      }`}
    >
      <button
        type="button"
        onClick={() => onSelectTile(tile.id)}
        className="flex h-full w-full items-center justify-center rounded-[inherit]"
        aria-label={`Select ${tile.label}`}
      >
        {tile.image ? (
          <Image
            src={tile.image}
            alt=""
            width={120}
            height={120}
            className="h-[82%] w-[82%] object-contain"
          />
        ) : Icon ? (
          <Icon className="h-[clamp(24px,6vw,40px)] w-[clamp(24px,6vw,40px)] text-white" />
        ) : null}
      </button>

      {selected ? (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onRemoveTile(tile.id);
          }}
          className="absolute right-0 top-0 z-50 flex h-7 w-7 translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_0_0_2px_rgba(255,255,255,0.08),0_8px_18px_rgba(0,0,0,0.55)] backdrop-blur-2xl transition hover:border-red-200/45 hover:bg-red-400/25"
          aria-label={`Remove ${tile.label}`}
        >
          <span className="h-1 w-3 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.45)]" />
        </button>
      ) : null}
    </div>
  );
}

function LibraryTile({
  tile,
  disabled,
  onAddTile,
}: {
  tile: DeckTileData;
  disabled: boolean;
  onAddTile: (tile: DeckTileData) => void;
}) {
  const Icon = tile.icon ? iconMap[tile.icon] : null;

  return (
    <button
      type="button"
      disabled={disabled}
      draggable={!disabled}
      onDragStart={(event) => {
        if (disabled) {
          return;
        }

        event.dataTransfer.effectAllowed = "copy";
        event.dataTransfer.setData(
          TILE_DRAG_DATA_TYPE,
          JSON.stringify({ type: "library", tile })
        );
      }}
      onClick={() => onAddTile(tile)}
      className="flex h-[72px] w-[72px] cursor-grab items-center justify-center rounded-[22px] bg-[#171717] shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_14px_22px_rgba(0,0,0,0.42)] ring-1 ring-white/10 transition hover:ring-white/25 hover:shadow-[0_0_28px_rgba(77,163,255,0.18)] active:cursor-grabbing active:scale-95 disabled:cursor-not-allowed disabled:opacity-100 disabled:hover:ring-white/10 disabled:hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_14px_22px_rgba(0,0,0,0.42)]"
      aria-label={`Add ${tile.label}`}
    >
      {tile.image ? (
        <Image
          src={tile.image}
          alt=""
          width={64}
          height={64}
          className="h-[74%] w-[74%] object-contain"
        />
      ) : Icon ? (
        <Icon className="h-8 w-8 text-white/75" />
      ) : null}
    </button>
  );
}

function MiniPagePreview({ tiles }: { tiles: DeckTileData[] }) {
  const cells = Array.from({ length: 8 }, (_, index) => tiles[index] ?? null);

  return (
    <div className="grid h-10 w-12 shrink-0 grid-cols-4 gap-0.5 rounded-lg bg-black p-1 ring-1 ring-white/10">
      {cells.map((tile, index) => {
        const Icon = tile?.icon ? iconMap[tile.icon] : null;

        return (
          <span
            key={tile?.id ?? `empty-${index}`}
            className="flex items-center justify-center rounded-[3px] bg-white/[0.035]"
          >
            {tile?.image ? (
              <Image
                src={tile.image}
                alt=""
                width={16}
                height={16}
                className="h-full w-full object-contain"
              />
            ) : Icon ? (
              <Icon className="h-2.5 w-2.5 text-white/70" />
            ) : null}
          </span>
        );
      })}
    </div>
  );
}
