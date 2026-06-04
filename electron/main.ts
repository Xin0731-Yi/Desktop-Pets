import { app, BrowserWindow, ipcMain } from "electron";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let mainWindow: BrowserWindow | null = null;

const WINDOW_SIZES = {
  pet: { width: 260, height: 300 },
  menu: { width: 260, height: 430 },
  detail: { width: 320, height: 600 }
} as const;

type WindowMode = keyof typeof WINDOW_SIZES;

function resizeWindow(mode: WindowMode) {
  if (!mainWindow) {
    return;
  }

  const size = WINDOW_SIZES[mode];
  const [currentWidth] = mainWindow.getSize();
  const [x, y] = mainWindow.getPosition();
  const deltaWidth = size.width - currentWidth;

  mainWindow.setMinimumSize(size.width, size.height);
  mainWindow.setSize(size.width, size.height, true);
  mainWindow.setPosition(Math.round(x - deltaWidth / 2), y, false);
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: WINDOW_SIZES.pet.width,
    height: WINDOW_SIZES.pet.height,
    minWidth: WINDOW_SIZES.pet.width,
    minHeight: WINDOW_SIZES.pet.height,
    frame: false,
    transparent: true,
    resizable: true,
    alwaysOnTop: true,
    skipTaskbar: false,
    hasShadow: false,
    backgroundColor: "#00000000",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
    }
  });

  mainWindow.setAlwaysOnTop(true, "floating");

  if (process.platform === "darwin") {
    mainWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  }

  const devServerUrl = process.env.VITE_DEV_SERVER_URL;

  if (devServerUrl) {
    void mainWindow.loadURL(devServerUrl);
    mainWindow.webContents.openDevTools({ mode: "detach" });
  } else {
    void mainWindow.loadFile(path.join(__dirname, "../dist/index.html"));
  }

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

ipcMain.handle("window:minimize", () => {
  mainWindow?.minimize();
});

ipcMain.handle("window:close", () => {
  mainWindow?.close();
});

ipcMain.handle("window:toggleAlwaysOnTop", () => {
  if (!mainWindow) {
    return false;
  }

  const nextValue = !mainWindow.isAlwaysOnTop();
  mainWindow.setAlwaysOnTop(nextValue, "floating");
  return nextValue;
});

ipcMain.handle("window:setMousePassthrough", (_event, enabled: boolean) => {
  mainWindow?.setIgnoreMouseEvents(enabled, { forward: true });
});

ipcMain.handle("window:moveBy", (_event, deltaX: number, deltaY: number) => {
  if (!mainWindow) {
    return;
  }

  const [x, y] = mainWindow.getPosition();
  mainWindow.setPosition(Math.round(x + deltaX), Math.round(y + deltaY), false);
});

ipcMain.handle("window:setMode", (_event, mode: WindowMode) => {
  if (!Object.prototype.hasOwnProperty.call(WINDOW_SIZES, mode)) {
    return;
  }

  resizeWindow(mode);
});
