/// <reference types="vite/client" />

interface Window {
  focusPet?: {
    minimize: () => Promise<void>;
    close: () => Promise<void>;
    toggleAlwaysOnTop: () => Promise<boolean>;
    setMousePassthrough: (enabled: boolean) => Promise<void>;
    moveBy: (deltaX: number, deltaY: number) => Promise<void>;
    setMode: (mode: "pet" | "menu" | "detail") => Promise<void>;
  };
}
