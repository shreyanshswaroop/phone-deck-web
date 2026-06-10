export type DeckIconKey =
  | "camera"
  | "lock"
  | "play"
  | "record"
  | "screenshot"
  | "stop"
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
    tiles: [],
  },
  {
    id: "controls",
    name: "Controls",
    tiles: [
      { id: "screenshot", label: "Screenshot", icon: "screenshot", command: "screenshot" },
      { id: "screen-record", label: "Screen Record", icon: "record", command: "screen-record" },
      { id: "stop-record", label: "Stop Record", icon: "stop", command: "stop-record" },
      { id: "camera", label: "Camera", icon: "camera", command: "camera" },
      { id: "playpause", label: "Play/Pause", icon: "play", command: "playpause" },
      { id: "mute", label: "Mute", icon: "volume-x", command: "mute" },
      { id: "unmute", label: "Unmute", icon: "volume", command: "unmute" },
      { id: "lock", label: "Lock Mac", icon: "lock", command: "lock" },
    ],
  },
];
