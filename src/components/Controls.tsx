import { type TimerStatus } from "../lib/timer";

type ControlsProps = {
  status: TimerStatus;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onSkip: () => void;
  onFeed: () => void;
  onPet: () => void;
};

export function Controls({ status, onStart, onPause, onReset, onSkip, onFeed, onPet }: ControlsProps) {
  const isRunning = status === "running";
  const hasStarted = status === "running" || status === "paused";

  return (
    <section className="control-panel" aria-label="Focus controls">
      <div className="primary-actions">
        <button className="button primary" type="button" onClick={hasStarted ? onPause : onStart}>
          {isRunning ? "暂停" : hasStarted ? "继续" : "开始"}
        </button>
        <button className="button ghost" type="button" onClick={onReset}>
          重置
        </button>
        <button className="button ghost" type="button" onClick={onSkip}>
          跳过
        </button>
      </div>

      <div className="pet-actions">
        <button className="button soft" type="button" onClick={onFeed}>
          小鱼干 -5
        </button>
        <button className="button soft mint" type="button" onClick={onPet}>
          摸摸头
        </button>
      </div>
    </section>
  );
}
