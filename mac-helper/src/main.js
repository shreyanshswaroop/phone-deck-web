const {
  app,
  BrowserWindow,
  Menu,
  Tray,
  dialog,
  nativeImage,
  shell,
} = require("electron");
const { execFile, spawn } = require("node:child_process");
const fs = require("node:fs/promises");
const path = require("node:path");
const os = require("node:os");
const { io } = require("socket.io-client");

const CLOUD_URL = "https://phone-deck-cloud.onrender.com";
const WEB_URL = "https://phone-deck-web.vercel.app";
const PAIRING_SESSION_EVENT = "join-pairing-session";
const MAC_APPS_CURRENT_EVENT = "mac-apps-current";
const MAC_APPS_REQUEST_EVENT = "mac-apps-request";
const MAC_APPS_UPDATE_EVENT = "mac-apps-update";
const COMMAND_EVENTS = [
  "phone-command",
  "mac-command",
  "deck-command",
  "run-command",
  "command",
  "execute-command",
  "execute-mac-command",
  "remote-command",
];
const CONFIG_FILE = "config.json";
const APP_DIRECTORIES = ["/Applications", "/System/Applications"];
const TRAY_ICON_DATA_URL =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAW0lEQVR4Ae3VQQrAIAxE0dz/0t2LSKE2ToRWsD7UDyYJbk0sIiJ2IaV0fp0BmH2EPoIeMEag/cXmPy45KYM48mbJ/cGLb4gIpDBpQ+rkk1jRv3QCbpE1Lh8vywQQDiy74Yh6uwAAAABJRU5ErkJggg==";

let tray;
let socket;
let pairCode = "";
let status = "Starting";
let cachedApps = [];
let screenRecordingProcess = null;
let pairCodeWindow = null;

app.setName("PocketDeck");

const execFileAsync = (file, args, options = {}) =>
  new Promise((resolve, reject) => {
    execFile(file, args, options, (error, stdout, stderr) => {
      if (error) {
        error.stderr = stderr;
        reject(error);
        return;
      }

      resolve(String(stdout || "").trim());
    });
  });

function normalizePairingCode(value) {
  const cleanValue = String(value || "")
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "");
  const withoutPrefix = cleanValue.startsWith("PD")
    ? cleanValue.slice(2)
    : cleanValue;
  const digits = withoutPrefix.replace(/\D/g, "").slice(0, 6);

  return digits.length === 6 ? `PD-${digits}` : "";
}

function generatePairingCode() {
  return `PD-${Math.floor(Math.random() * 1000000)
    .toString()
    .padStart(6, "0")}`;
}

async function readConfig() {
  try {
    const configPath = path.join(app.getPath("userData"), CONFIG_FILE);
    const config = JSON.parse(await fs.readFile(configPath, "utf8"));
    return {
      pairCode: normalizePairingCode(config.pairCode),
    };
  } catch {
    return { pairCode: "" };
  }
}

async function writeConfig(config) {
  const configPath = path.join(app.getPath("userData"), CONFIG_FILE);
  await fs.mkdir(path.dirname(configPath), { recursive: true });
  await fs.writeFile(configPath, JSON.stringify(config, null, 2));
}

function setStatus(nextStatus) {
  status = nextStatus;
  updateTrayMenu();
}

function updateTrayMenu() {
  if (!tray) {
    return;
  }

  const connected = socket?.connected ? "Connected" : "Disconnected";

  tray.setTitle(pairCode || "PD");
  tray.setToolTip(`PocketDeck - ${connected}`);
  tray.setContextMenu(
    Menu.buildFromTemplate([
      {
        label: `PocketDeck: ${connected}`,
        enabled: false,
      },
      {
        label: `Pair Code: ${pairCode || "Not set"}`,
        enabled: false,
      },
      {
        label: status,
        enabled: false,
      },
      { type: "separator" },
      {
        label: "Set Pair Code...",
        click: showPairCodeWindow,
      },
      {
        label: "Copy Pair Code",
        enabled: Boolean(pairCode),
        click: () => {
          require("electron").clipboard.writeText(pairCode);
        },
      },
      {
        label: "Open Deck Studio",
        click: () =>
          shell.openExternal(
            `${WEB_URL}/deck-studio?pair=${encodeURIComponent(pairCode)}`,
          ),
      },
      {
        label: "Open Phone Controller",
        click: () =>
          shell.openExternal(
            `${WEB_URL}/deck?pair=${encodeURIComponent(pairCode)}`,
          ),
      },
      { type: "separator" },
      {
        label: "Refresh Mac Apps",
        click: refreshAndPublishApps,
      },
      {
        label: "Test Command: Open Safari",
        click: () => runCommand("open:com.apple.Safari"),
      },
      {
        label: "Quit PocketDeck",
        click: () => app.quit(),
      },
    ]),
  );
}

function connectSocket() {
  if (!pairCode) {
    setStatus("Set a pair code to connect.");
    return;
  }

  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
  }

  setStatus("Connecting to PocketDeck cloud...");
  socket = io(CLOUD_URL, {
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionAttempts: Infinity,
  });

  socket.on("connect", () => {
    setStatus("Connected. Syncing apps...");
    socket.emit(PAIRING_SESSION_EVENT, { pairCode, role: "mac" });
    socket.emit("register-mac", {
      pairCode,
      name: os.hostname(),
      platform: "macos",
      connectedAt: Date.now(),
    });
    socket.emit("register-desktop", {
      pairCode,
      name: os.hostname(),
      platform: "macos",
      connectedAt: Date.now(),
    });
    refreshAndPublishApps();
  });

  socket.on("disconnect", () => {
    setStatus("Disconnected. Reconnecting...");
  });

  socket.on("connect_error", () => {
    setStatus("Could not reach PocketDeck cloud.");
  });

  socket.on(MAC_APPS_REQUEST_EVENT, publishApps);
  COMMAND_EVENTS.forEach((eventName) => {
    socket.on(eventName, (payload) => handleCommandPayload(payload, eventName));
  });
  socket.onAny((eventName, payload) => {
    if (
      COMMAND_EVENTS.includes(eventName) ||
      eventName === MAC_APPS_REQUEST_EVENT
    ) {
      return;
    }

    handleCommandPayload(payload, eventName);
  });

  updateTrayMenu();
}

function extractCommand(payload) {
  if (typeof payload === "string") {
    return payload.trim();
  }

  if (!payload || typeof payload !== "object") {
    return "";
  }

  if (typeof payload.command === "string") {
    return payload.command.trim();
  }

  if (payload.data && typeof payload.data.command === "string") {
    return payload.data.command.trim();
  }

  return "";
}

function payloadBelongsToPair(payload) {
  if (!payload || typeof payload !== "object") {
    return true;
  }

  const payloadPairCode =
    typeof payload.pairCode === "string"
      ? normalizePairingCode(payload.pairCode)
      : "";

  return !payloadPairCode || payloadPairCode === pairCode;
}

function handleCommandPayload(payload, eventName) {
  const command = extractCommand(payload);

  if (!command || !payloadBelongsToPair(payload)) {
    return;
  }

  setStatus(`Received ${command} from ${eventName}.`);
  runCommand(command);
}

function publishApps() {
  if (!socket?.connected) {
    return;
  }

  socket.emit(MAC_APPS_CURRENT_EVENT, { pairCode, apps: cachedApps });
  socket.emit(MAC_APPS_UPDATE_EVENT, { pairCode, apps: cachedApps });
  setStatus(`Synced ${cachedApps.length} Mac apps.`);
}

async function refreshAndPublishApps() {
  try {
    cachedApps = await getInstalledApps();
    publishApps();
  } catch (error) {
    setStatus(`App sync failed: ${error.message}`);
  }
}

async function getInstalledApps() {
  const appPaths = [];

  for (const directory of APP_DIRECTORIES) {
    try {
      const stdout = await execFileAsync("/usr/bin/find", [
        directory,
        "-maxdepth",
        "2",
        "-name",
        "*.app",
        "-type",
        "d",
      ]);
      appPaths.push(...stdout.split("\n").filter(Boolean));
    } catch {
      // Some system locations may be unavailable on older macOS versions.
    }
  }

  const uniquePaths = [...new Set(appPaths)].sort((a, b) =>
    path.basename(a).localeCompare(path.basename(b)),
  );
  const apps = [];

  for (const appPath of uniquePaths) {
    const name = path.basename(appPath, ".app");
    let bundleId = "";

    try {
      bundleId = await execFileAsync("/usr/bin/mdls", [
        "-name",
        "kMDItemCFBundleIdentifier",
        "-raw",
        appPath,
      ]);
    } catch {
      bundleId = "";
    }

    if (!bundleId || bundleId === "(null)") {
      bundleId = "";
    }

    apps.push({
      id: bundleId || appPath,
      name,
      command: bundleId ? `open:${bundleId}` : `open-path:${appPath}`,
      icon: await getAppIconDataUrl(appPath),
      bundleId,
      path: appPath,
    });
  }

  return apps.slice(0, 250);
}

async function getAppIconDataUrl(appPath) {
  const iconPath = await getAppIconPath(appPath);

  if (!iconPath) {
    return undefined;
  }

  const icon = nativeImage.createFromPath(iconPath);

  if (icon.isEmpty()) {
    return undefined;
  }

  return icon.resize({ width: 96, height: 96, quality: "best" }).toDataURL();
}

async function getAppIconPath(appPath) {
  const infoPlistPath = path.join(appPath, "Contents", "Info.plist");
  const resourcesPath = path.join(appPath, "Contents", "Resources");

  try {
    const iconFile = await execFileAsync("/usr/bin/plutil", [
      "-extract",
      "CFBundleIconFile",
      "raw",
      infoPlistPath,
    ]);
    const baseIconName = iconFile.endsWith(".icns")
      ? iconFile.slice(0, -5)
      : iconFile;
    const candidates = [
      iconFile,
      `${baseIconName}.icns`,
      `${baseIconName}@2x.icns`,
    ];

    for (const candidate of candidates) {
      const candidatePath = path.join(resourcesPath, candidate);

      try {
        await fs.access(candidatePath);
        return candidatePath;
      } catch {}
    }
  } catch {}

  return undefined;
}

async function runCommand(command) {
  setStatus(`Running ${command}...`);

  try {
    if (command.startsWith("open:")) {
      await execFileAsync("/usr/bin/open", ["-b", command.slice(5)]);
    } else if (command.startsWith("open-path:")) {
      await execFileAsync("/usr/bin/open", [command.slice(10)]);
    } else if (command === "screenshot") {
      const file = path.join(
        os.homedir(),
        "Desktop",
        `PocketDeck-Screenshot-${Date.now()}.png`,
      );
      await execFileAsync("/usr/sbin/screencapture", ["-x", file]);
    } else if (command === "screen-record") {
      startScreenRecording();
    } else if (command === "stop-record") {
      stopScreenRecording();
    } else if (command === "camera") {
      await execFileAsync("/usr/bin/open", ["-a", "FaceTime"]);
    } else if (command === "playpause") {
      await execFileAsync("/usr/bin/osascript", [
        "-e",
        'tell application "Music" to playpause',
      ]);
    } else if (command === "mute") {
      await execFileAsync("/usr/bin/osascript", [
        "-e",
        "set volume with output muted",
      ]);
    } else if (command === "unmute") {
      await execFileAsync("/usr/bin/osascript", [
        "-e",
        "set volume without output muted",
      ]);
    } else if (command === "lock") {
      await execFileAsync("/System/Library/CoreServices/Menu Extras/User.menu/Contents/Resources/CGSession", [
        "-suspend",
      ]);
    }

    setStatus(`Ran ${command}.`);
  } catch (error) {
    setStatus(`Command failed: ${command}`);
  }
}

function startScreenRecording() {
  if (screenRecordingProcess) {
    setStatus("Screen recording is already running.");
    return;
  }

  const file = path.join(
    os.homedir(),
    "Desktop",
    `PocketDeck-Recording-${Date.now()}.mov`,
  );

  screenRecordingProcess = spawn("/usr/sbin/screencapture", ["-v", file], {
    stdio: "ignore",
  });
  screenRecordingProcess.on("exit", () => {
    screenRecordingProcess = null;
    setStatus("Screen recording saved to Desktop.");
  });
}

function stopScreenRecording() {
  if (!screenRecordingProcess) {
    setStatus("No screen recording is running.");
    return;
  }

  screenRecordingProcess.kill("SIGINT");
}

function showPairCodeWindow() {
  if (pairCodeWindow && !pairCodeWindow.isDestroyed()) {
    pairCodeWindow.show();
    pairCodeWindow.focus();
    return;
  }

  const win = new BrowserWindow({
    width: 420,
    height: 310,
    resizable: false,
    title: "PocketDeck Pair Code",
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  pairCodeWindow = win;
  win.removeMenu();
  win.loadURL(
    `data:text/html;charset=utf-8,${encodeURIComponent(renderPairCodeHtml())}`,
  );
  win.on("closed", () => {
    pairCodeWindow = null;
  });
}

function renderPairCodeHtml() {
  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <style>
      body {
        margin: 0;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        background: #f7f7f8;
        color: #1f1f23;
      }
      main {
        padding: 28px;
      }
      h1 {
        margin: 0 0 10px;
        font-size: 24px;
      }
      .code {
        margin: 16px 0;
        border-radius: 14px;
        background: #ffffff;
        box-shadow: 0 10px 24px rgba(0, 0, 0, 0.08);
        padding: 14px;
        text-align: center;
        font-size: 28px;
        font-weight: 800;
        letter-spacing: 0.12em;
      }
      p {
        color: #666672;
        line-height: 1.45;
        margin: 0 0 12px;
      }
      input {
        box-sizing: border-box;
        width: 100%;
        height: 48px;
        border: 1px solid #d4d4dc;
        border-radius: 12px;
        padding: 0 14px;
        font-size: 18px;
        font-weight: 700;
        letter-spacing: 0.08em;
        text-align: center;
        text-transform: uppercase;
      }
      button {
        width: 100%;
        height: 44px;
        margin-top: 14px;
        border: 0;
        border-radius: 12px;
        background: #1d1d1f;
        color: white;
        font-size: 15px;
        font-weight: 700;
      }
      .secondary {
        background: #e7e7eb;
        color: #1f1f23;
      }
    </style>
  </head>
  <body>
    <main>
      <h1>PocketDeck Pair Code</h1>
      <p>Use this code in Deck Studio and on your phone.</p>
      <div class="code">${pairCode}</div>
      <p>To use a different code, enter it below.</p>
      <input id="pairCode" value="${pairCode}" placeholder="PD-123456" />
      <button id="save">Save and Connect</button>
      <button id="copy" class="secondary">Copy Code</button>
    </main>
    <script>
      const { ipcRenderer } = require("electron");
      const input = document.getElementById("pairCode");
      document.getElementById("save").addEventListener("click", () => {
        ipcRenderer.send("set-pair-code", input.value);
        window.close();
      });
      input.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          ipcRenderer.send("set-pair-code", input.value);
          window.close();
        }
      });
      document.getElementById("copy").addEventListener("click", () => {
        ipcRenderer.send("copy-pair-code");
      });
      input.focus();
      input.select();
    </script>
  </body>
</html>`;
}

require("electron").ipcMain.on("set-pair-code", async (_event, value) => {
  const normalizedCode = normalizePairingCode(value);

  if (!normalizedCode) {
    dialog.showErrorBox("Invalid Pair Code", "Use a code like PD-123456.");
    return;
  }

  pairCode = normalizedCode;
  await writeConfig({ pairCode });
  connectSocket();
});

require("electron").ipcMain.on("copy-pair-code", () => {
  require("electron").clipboard.writeText(pairCode);
});

app.whenReady().then(async () => {
  const config = await readConfig();
  pairCode = config.pairCode || generatePairingCode();
  await writeConfig({ pairCode });

  const trayIcon = nativeImage.createFromDataURL(TRAY_ICON_DATA_URL);
  trayIcon.setTemplateImage(true);
  tray = new Tray(trayIcon);
  tray.on("click", () => {
    tray.popUpContextMenu();
  });
  tray.on("double-click", showPairCodeWindow);
  updateTrayMenu();
  connectSocket();
  showPairCodeWindow();
});

app.on("activate", showPairCodeWindow);

app.on("window-all-closed", () => {
  updateTrayMenu();
});
