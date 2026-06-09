"use client";

import Image from "next/image";
import Link from "next/link";
import { type DragEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  Camera,
  Trash2,
  Folder,
  MonitorSmartphone,
  Music,
  Play,
  Plus,
  Power,
  Search,
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
  const [connectedPhone, setConnectedPhone] = useState<PhoneDeviceInfo | null>(
    null
  );
  const activePage =
    pages.find((page) => page.id === activePageId) ?? pages[0];
  const selectedTile =
    activePage.tiles.find((tile) => tile.id === selectedTileId) ?? null;

  const libraryTiles = useMemo(
    () => defaultDeckPages.flatMap((page) => page.tiles),
    []
  );

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

  function updateSelectedTile(field: "label" | "command", value: string) {
    if (!selectedTile) {
      return;
    }

    setPages((currentPages) =>
      currentPages.map((page) =>
        page.id === activePage.id
          ? {
              ...page,
              tiles: page.tiles.map((tile) =>
                tile.id === selectedTile.id ? { ...tile, [field]: value } : tile
              ),
            }
          : page
      )
    );
  }

  function removeSelectedTile() {
    if (!selectedTile) {
      return;
    }

    setPages((currentPages) =>
      currentPages.map((page) =>
        page.id === activePage.id
          ? {
              ...page,
              tiles: page.tiles.filter((tile) => tile.id !== selectedTile.id),
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
      <div className="grid min-h-screen lg:grid-cols-[280px_1fr]">
        <aside className="border-b border-white/10 bg-[#080808] p-5 lg:border-b-0 lg:border-r">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]">
              <MonitorSmartphone className="h-5 w-5 text-[#4DA3FF]" />
            </div>
            <div>
              <p className="text-sm font-bold tracking-wide">PhoneDeck</p>
              <p className="text-xs text-white/40">Command Center</p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-[52px_1fr] items-center gap-3 rounded-[28px] border border-white/10 bg-white/[0.03] p-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-black/40">
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

          <div className="mt-8">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-white/35">
              Pages
            </p>

            <div className="space-y-2">
              {pages.map((page, index) => {
                const canDeletePage = !defaultPageIds.has(page.id);

                return (
                  <div
                    key={page.id}
                    className={`group flex w-full items-center gap-2 rounded-2xl border p-2 transition ${
                      activePage.id === page.id
                        ? "border-[#4DA3FF]/40 bg-[#4DA3FF]/10"
                        : "border-white/10 bg-white/[0.03] hover:border-white/20"
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
                className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-white/15 px-3 py-3 text-sm font-semibold text-white/40 transition hover:border-[#4DA3FF]/40 hover:text-[#4DA3FF]"
              >
                <Plus className="h-4 w-4" />
                New Page
              </button>
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
                Select tiles to edit. Add more from the app library below.
              </p>
            </div>

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
          </header>

          <div className="mt-8 grid gap-8 xl:grid-cols-[1fr_340px]">
            <div className="relative min-w-0">
              <div className="pointer-events-none absolute inset-x-6 top-8 h-[520px] rounded-full bg-black/70 blur-3xl" />
              <div className="relative px-6 pb-6">
                <div className="flex min-h-[420px] items-center justify-center">
                  <DeckPreview
                    pages={pages}
                    activePageId={activePage.id}
                    selectedTileId={selectedTileId}
                    onSelectTile={setSelectedTileId}
                    onAddTile={addTileToActivePage}
                    onDropTile={handleDeckDrop}
                  />
                </div>

                <div className="mt-8">
                  <p className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-white/35">
                    Apps On This Mac
                  </p>

                  <div className="grid grid-cols-4 gap-x-5 gap-y-6 sm:grid-cols-5 md:grid-cols-7 xl:grid-cols-7">
                    {libraryTiles.map((tile) => (
                      <LibraryTile
                        key={tile.id}
                        tile={tile}
                        disabled={activePage.tiles.length >= 8}
                        onAddTile={addTileToActivePage}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <aside className="rounded-[28px] border border-white/10 bg-white/[0.03] p-5">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/35">
                Tile Inspector
              </p>

              {selectedTile ? (
                <div className="mt-5 space-y-4">
                  <label className="block">
                    <span className="text-xs font-bold uppercase tracking-[0.18em] text-white/35">
                      Label
                    </span>
                    <input
                      value={selectedTile.label}
                      onChange={(event) =>
                        updateSelectedTile("label", event.target.value)
                      }
                      className="mt-2 w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm outline-none transition focus:border-[#4DA3FF]"
                    />
                  </label>

                  <label className="block">
                    <span className="text-xs font-bold uppercase tracking-[0.18em] text-white/35">
                      Command
                    </span>
                    <input
                      value={selectedTile.command}
                      onChange={(event) =>
                        updateSelectedTile("command", event.target.value)
                      }
                      className="mt-2 w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm outline-none transition focus:border-[#4DA3FF]"
                    />
                  </label>

                  <button
                    type="button"
                    onClick={removeSelectedTile}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm font-bold text-red-300 transition hover:border-red-400/40"
                  >
                    <Trash2 className="h-4 w-4" />
                    Remove Tile
                  </button>
                </div>
              ) : (
                <div className="mt-5 space-y-4 text-sm text-white/45">
                  <p>Select a tile in the preview to edit it.</p>
                  <p>
                    Click an app below to add it to the active page. Pages hold
                    up to 8 tiles.
                  </p>
                </div>
              )}

              <Link
                href="/deck"
                className="mt-8 inline-flex w-full justify-center rounded-2xl bg-white px-5 py-3 text-sm font-bold text-black transition hover:opacity-90"
              >
                Open Controller
              </Link>
            </aside>
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
  onAddTile,
  onDropTile,
}: {
  pages: DeckPage[];
  activePageId: string;
  selectedTileId: string | null;
  onSelectTile: (tileId: string) => void;
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
  onDropTile,
}: {
  tile: DeckTileData;
  selected: boolean;
  onSelectTile: (tileId: string) => void;
  onDropTile: (event: DragEvent<HTMLButtonElement>) => void;
}) {
  const Icon = tile.icon ? iconMap[tile.icon] : null;

  return (
    <button
      type="button"
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
      onClick={() => onSelectTile(tile.id)}
      className={`flex h-[clamp(54px,13vw,112px)] w-[clamp(54px,13vw,112px)] items-center justify-center rounded-[clamp(18px,4vw,34px)] bg-[#171717] shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_18px_24px_rgba(0,0,0,0.45)] ring-1 transition ${
        selected
          ? "ring-[#4DA3FF] shadow-[0_0_24px_rgba(77,163,255,0.25)]"
          : "ring-white/10 hover:ring-white/25"
      }`}
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
      className="flex aspect-square cursor-grab items-center justify-center rounded-2xl p-3 transition hover:bg-white/[0.055] hover:shadow-[0_0_28px_rgba(77,163,255,0.18)] active:cursor-grabbing active:scale-95 disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:bg-transparent disabled:hover:shadow-none"
      aria-label={`Add ${tile.label}`}
    >
      {tile.image ? (
        <Image
          src={tile.image}
          alt=""
          width={64}
          height={64}
          className="h-[72%] w-[72%] object-contain"
        />
      ) : Icon ? (
        <Icon className="h-8 w-8 text-white" />
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
