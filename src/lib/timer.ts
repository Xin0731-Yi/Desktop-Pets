export type TimerMode = "focus" | "shortBreak" | "longBreak";
export type TimerStatus = "idle" | "running" | "paused" | "completed";

export const TIMER_DURATIONS: Record<TimerMode, number> = {
  focus: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60
};

export function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
}

export function getNextMode(currentMode: TimerMode, completedFocusRounds: number): TimerMode {
  if (currentMode !== "focus") {
    return "focus";
  }

  return completedFocusRounds % 4 === 0 ? "longBreak" : "shortBreak";
}

export function getModeLabel(mode: TimerMode) {
  if (mode === "focus") {
    return "专注";
  }

  return mode === "longBreak" ? "长休息" : "短休息";
}

export function getModeIcon(mode: TimerMode) {
  return mode === "focus" ? "🍅" : "☕";
}
