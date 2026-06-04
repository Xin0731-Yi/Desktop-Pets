import { formatTime, getModeIcon, getModeLabel, type TimerMode, type TimerStatus } from "../lib/timer";

type TimerBubbleProps = {
  mode: TimerMode;
  status: TimerStatus;
  remainingSeconds: number;
};

export function TimerBubble({ mode, status, remainingSeconds }: TimerBubbleProps) {
  const urgencyClass =
    remainingSeconds <= 60 ? "timer-bubble danger" : remainingSeconds <= 5 * 60 ? "timer-bubble warning" : "timer-bubble";
  const pulseClass = remainingSeconds <= 10 && status === "running" ? " final-countdown" : "";

  return (
    <div className={`${urgencyClass}${pulseClass}`} aria-label={`${getModeLabel(mode)} ${formatTime(remainingSeconds)}`}>
      <span className="timer-icon">{getModeIcon(mode)}</span>
      <span className="timer-text">{formatTime(remainingSeconds)}</span>
      <span className="timer-mode">{getModeLabel(mode)}</span>
    </div>
  );
}
