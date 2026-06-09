import { defaultDeckPages, type DeckPage, type DeckTile } from "./deck-layout";

export const CLOUD_URL = "https://phone-deck-cloud.onrender.com";
export const DECK_LAYOUT_STORAGE_KEY = "phonedeck-layout-v1";
export const DECK_LAYOUT_UPDATE_EVENT = "deck-layout-update";
export const DECK_LAYOUT_CURRENT_EVENT = "deck-layout-current";
export const DECK_LAYOUT_REQUEST_EVENT = "deck-layout-request";
export const PHONE_CONNECTED_EVENT = "phone-connected";
export const PHONE_DISCONNECTED_EVENT = "phone-disconnected";
export const PHONE_STATUS_EVENT = "phone-status";
export const PHONE_STATUS_REQUEST_EVENT = "phone-status-request";
export const PHONE_DEVICE_ID_STORAGE_KEY = "phonedeck-phone-device-id";
export const PHONE_DEVICE_NAME_STORAGE_KEY = "phonedeck-phone-name";

export type DeckLayoutPayload = {
  version: 1;
  updatedAt: number;
  pages: DeckPage[];
};

export type PhoneDeviceInfo = {
  id: string;
  name: string;
  detail: string;
  connected: boolean;
  connectedAt: number;
};

export function cloneDeckPages(pages: DeckPage[] = defaultDeckPages) {
  return pages.map((page) => ({
    ...page,
    tiles: page.tiles.map((tile) => ({ ...tile })),
  }));
}

export function createDeckLayoutPayload(pages: DeckPage[]): DeckLayoutPayload {
  return {
    version: 1,
    updatedAt: Date.now(),
    pages: cloneDeckPages(pages),
  };
}

export function sanitizeDeckPages(input: unknown): DeckPage[] | null {
  const pages = Array.isArray(input)
    ? input
    : input &&
        typeof input === "object" &&
        "pages" in input &&
        Array.isArray(input.pages)
      ? input.pages
      : null;

  if (!pages) {
    return null;
  }

  const cleanPages = pages
    .map((page): DeckPage | null => {
      if (!page || typeof page !== "object") {
        return null;
      }

      const rawPage = page as Partial<DeckPage>;
      const tiles = Array.isArray(rawPage.tiles)
        ? rawPage.tiles
            .map((tile): DeckTile | null => {
              if (!tile || typeof tile !== "object") {
                return null;
              }

              const rawTile = tile as Partial<DeckTile>;

              if (
                typeof rawTile.id !== "string" ||
                typeof rawTile.label !== "string" ||
                typeof rawTile.command !== "string"
              ) {
                return null;
              }

              return {
                id: rawTile.id,
                label: rawTile.label,
                command: rawTile.command,
                image:
                  typeof rawTile.image === "string" ? rawTile.image : undefined,
                icon: rawTile.icon,
              };
            })
            .filter((tile): tile is DeckTile => tile !== null)
            .slice(0, 8)
        : [];

      if (typeof rawPage.id !== "string" || typeof rawPage.name !== "string") {
        return null;
      }

      return {
        id: rawPage.id,
        name: rawPage.name,
        tiles,
      };
    })
    .filter((page): page is DeckPage => page !== null);

  return cleanPages.length > 0 ? cleanPages : null;
}

export function readStoredDeckLayout() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const rawLayout = window.localStorage.getItem(DECK_LAYOUT_STORAGE_KEY);

    if (!rawLayout) {
      return null;
    }

    const parsedLayout = JSON.parse(rawLayout);

    return sanitizeDeckPages(parsedLayout);
  } catch {
    return null;
  }
}

export function writeStoredDeckLayout(pages: DeckPage[]) {
  if (typeof window === "undefined") {
    return;
  }

  const payload = createDeckLayoutPayload(pages);
  window.localStorage.setItem(DECK_LAYOUT_STORAGE_KEY, JSON.stringify(payload));
}

function getOrCreatePhoneDeviceId() {
  const existingId = window.localStorage.getItem(PHONE_DEVICE_ID_STORAGE_KEY);

  if (existingId) {
    return existingId;
  }

  const nextId =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `phone-${Date.now()}`;
  window.localStorage.setItem(PHONE_DEVICE_ID_STORAGE_KEY, nextId);

  return nextId;
}

function readDeviceDetail() {
  const userAgent = window.navigator.userAgent;
  const isIphone = /iPhone/i.test(userAgent);
  const isIpad = /iPad/i.test(userAgent);
  const iosMatch = userAgent.match(/OS ([\d_]+)/);
  const iosVersion = iosMatch?.[1]?.replaceAll("_", ".");
  const deviceType = isIphone ? "iPhone" : isIpad ? "iPad" : "Phone";

  return iosVersion ? `${deviceType} · iOS ${iosVersion}` : deviceType;
}

export function createPhoneDeviceInfo(): PhoneDeviceInfo {
  const storedName = window.localStorage.getItem(PHONE_DEVICE_NAME_STORAGE_KEY);
  const detail = readDeviceDetail();

  return {
    id: getOrCreatePhoneDeviceId(),
    name: storedName?.trim() || detail.split(" · ")[0] || "Phone",
    detail,
    connected: true,
    connectedAt: Date.now(),
  };
}

export function readStoredPhoneDeviceName() {
  if (typeof window === "undefined") {
    return "";
  }

  return window.localStorage.getItem(PHONE_DEVICE_NAME_STORAGE_KEY) ?? "";
}

export function writeStoredPhoneDeviceName(name: string) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(PHONE_DEVICE_NAME_STORAGE_KEY, name.trim());
}

export function sanitizePhoneDeviceInfo(input: unknown): PhoneDeviceInfo | null {
  if (!input || typeof input !== "object") {
    return null;
  }

  const phone = input as Partial<PhoneDeviceInfo>;

  if (
    typeof phone.id !== "string" ||
    typeof phone.name !== "string" ||
    typeof phone.detail !== "string"
  ) {
    return null;
  }

  return {
    id: phone.id,
    name: phone.name,
    detail: phone.detail,
    connected: phone.connected === true,
    connectedAt:
      typeof phone.connectedAt === "number" ? phone.connectedAt : Date.now(),
  };
}
