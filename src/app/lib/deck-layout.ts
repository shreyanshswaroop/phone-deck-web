export type DeckIconKey =
  | "camera"
  | "finder"
  | "music"
  | "play"
  | "power"
  | "search"
  | "volume"
  | "volume-x";

export type DeckTile = {
  id: string;
  label: string;
  command: string;
  image?: string;
  icon?: DeckIconKey;
};

export type DeckPage = {
  id: string;
  name: string;
  tiles: DeckTile[];
};

export const defaultDeckPages: DeckPage[] = [
  {
    id: "apps",
    name: "Apps",
    tiles: [
      { id: "chrome", label: "Chrome", image: "/icons/chrome.png", command: "chrome" },
      { id: "youtube", label: "YouTube", image: "/icons/Youtube.png", command: "youtube" },
      { id: "discord", label: "Discord", image: "/icons/discord.png", command: "discord" },
      { id: "music", label: "Music", image: "/icons/music.png", command: "music" },
      { id: "terminal", label: "Terminal", image: "/icons/terminal.png", command: "terminal" },
      { id: "whatsapp", label: "WhatsApp", image: "/icons/whatsapp.png", command: "whatsapp" },
      { id: "claude", label: "Claude", image: "/icons/claude.png", command: "claude" },
      { id: "obs", label: "OBS", image: "/icons/obs.png", command: "obs" },
    ],
  },
  {
    id: "controls",
    name: "Controls",
    tiles: [
      { id: "finder", label: "Finder", icon: "finder", command: "finder" },
      { id: "spotify", label: "Spotify", icon: "music", command: "spotify" },
      { id: "playpause", label: "Play/Pause", icon: "play", command: "playpause" },
      { id: "mute", label: "Mute", icon: "volume-x", command: "mute" },
      { id: "unmute", label: "Unmute", icon: "volume", command: "unmute" },
      { id: "camera", label: "Camera", icon: "camera", command: "camera" },
      { id: "spotlight", label: "Spotlight", icon: "search", command: "spotlight" },
      { id: "sleep", label: "Sleep", icon: "power", command: "sleep" },
    ],
  },
];
