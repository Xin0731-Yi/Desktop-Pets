import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("focusPet", {
  minimize: () => ipcRenderer.invoke("window:minimize"),
  close: () => ipcRenderer.invoke("window:close"),
  toggleAlwaysOnTop: () => ipcRenderer.invoke("window:toggleAlwaysOnTop"),
  setMousePassthrough: (enabled: boolean) => ipcRenderer.invoke("window:setMousePassthrough", enabled),
  moveBy: (deltaX: number, deltaY: number) => ipcRenderer.invoke("window:moveBy", deltaX, deltaY),
  setMode: (mode: "pet" | "menu" | "detail") => ipcRenderer.invoke("window:setMode", mode)
});
