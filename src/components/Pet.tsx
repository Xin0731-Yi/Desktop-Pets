import { useRef, type PointerEvent } from "react";
import dalmatianEgg from "../assets/dalmatian-egg.png";
import dalmatianPuppy from "../assets/dalmatian-puppy.png";
import { type StageInfo } from "../lib/progression";
import { type TimerMode, type TimerStatus } from "../lib/timer";

type PetProps = {
  stage: StageInfo;
  mode: TimerMode;
  status: TimerStatus;
  feedback: string | null;
  onClick: () => void;
};

function getPose(mode: TimerMode, status: TimerStatus, feedback: string | null) {
  if (feedback === "fed") {
    return "nom";
  }

  if (feedback === "heart" || feedback === "level-up" || feedback === "celebrate") {
    return "happy";
  }

  if (status === "running" && mode === "focus") {
    return "study";
  }

  if (status === "running") {
    return "rest";
  }

  return "idle";
}

export function Pet({ stage, mode, status, feedback, onClick }: PetProps) {
  const pose = getPose(mode, status, feedback);
  const isEgg = stage.id === "egg";
  const dragRef = useRef({
    active: false,
    dragged: false,
    startX: 0,
    startY: 0,
    lastX: 0,
    lastY: 0
  });

  const handlePointerDown = (event: PointerEvent<HTMLButtonElement>) => {
    dragRef.current = {
      active: true,
      dragged: false,
      startX: event.screenX,
      startY: event.screenY,
      lastX: event.screenX,
      lastY: event.screenY
    };

    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: PointerEvent<HTMLButtonElement>) => {
    const drag = dragRef.current;

    if (!drag.active) {
      return;
    }

    const totalDeltaX = event.screenX - drag.startX;
    const totalDeltaY = event.screenY - drag.startY;
    const movedEnough = Math.hypot(totalDeltaX, totalDeltaY) > 6;

    if (!movedEnough && !drag.dragged) {
      return;
    }

    drag.dragged = true;
    const deltaX = event.screenX - drag.lastX;
    const deltaY = event.screenY - drag.lastY;
    drag.lastX = event.screenX;
    drag.lastY = event.screenY;

    void window.focusPet?.moveBy(deltaX, deltaY);
  };

  const handlePointerUp = (event: PointerEvent<HTMLButtonElement>) => {
    const wasDragged = dragRef.current.dragged;
    dragRef.current.active = false;
    event.currentTarget.releasePointerCapture(event.pointerId);

    if (!wasDragged) {
      onClick();
    }
  };

  return (
    <button
      className={`pet-wrap pose-${pose} ${feedback ? `feedback-${feedback}` : ""}`}
      type="button"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      aria-label="Open focus pet options"
      style={
        {
          "--pet-color": stage.color,
          "--pet-accent": stage.accent,
          "--pet-scale": stage.size
        } as React.CSSProperties
      }
    >
      <span className="pet-shadow" />
      <span className={isEgg ? "sprite-pet sprite-egg" : "sprite-pet sprite-puppy"}>
        <img src={isEgg ? dalmatianEgg : dalmatianPuppy} alt="" draggable="false" />
      </span>

      {feedback ? <span className="feedback-pop">{feedback === "heart" ? "♥" : feedback === "fed" ? "♪" : "★"}</span> : null}
    </button>
  );
}
