import { useCallback, useEffect, useReducer } from "react";
import { addExperience, clampStat, getExpForLevel, getStageForLevel } from "../lib/progression";
import { getNextMode, TIMER_DURATIONS, type TimerMode, type TimerStatus } from "../lib/timer";

const STORAGE_KEY = "focus-pet:v1";

export type PetStats = {
  hunger: number;
  mood: number;
  energy: number;
};

export type PetState = {
  timerMode: TimerMode;
  timerStatus: TimerStatus;
  remainingSeconds: number;
  completedFocusRounds: number;
  totalPomodoros: number;
  totalFocusSeconds: number;
  level: number;
  exp: number;
  coins: number;
  stats: PetStats;
  lastSavedAt: number;
  lastEvent: string;
  feedback: string | null;
};

type Action =
  | { type: "START" }
  | { type: "PAUSE" }
  | { type: "RESET" }
  | { type: "SKIP" }
  | { type: "TICK" }
  | { type: "FEED" }
  | { type: "PET" }
  | { type: "DEV_LEVEL_UP" }
  | { type: "DEV_RESET_LEVEL" }
  | { type: "CLEAR_FEEDBACK" }
  | { type: "HYDRATE"; state: PetState };

export const initialPetState: PetState = {
  timerMode: "focus",
  timerStatus: "idle",
  remainingSeconds: TIMER_DURATIONS.focus,
  completedFocusRounds: 0,
  totalPomodoros: 0,
  totalFocusSeconds: 0,
  level: 1,
  exp: 0,
  coins: 0,
  stats: {
    hunger: 78,
    mood: 72,
    energy: 84
  },
  lastSavedAt: Date.now(),
  lastEvent: "我准备好陪你学习啦。",
  feedback: null
};

function completeCurrentRound(state: PetState) {
  if (state.timerMode !== "focus") {
    const nextMode = getNextMode(state.timerMode, state.completedFocusRounds);
    return {
      ...state,
      timerMode: nextMode,
      timerStatus: "idle" as TimerStatus,
      remainingSeconds: TIMER_DURATIONS[nextMode],
      stats: {
        hunger: clampStat(state.stats.hunger - 2),
        mood: clampStat(state.stats.mood + 4),
        energy: clampStat(state.stats.energy + 12)
      },
      lastEvent: "休息结束，慢慢回到专注节奏。",
      feedback: "stretch"
    };
  }

  const completedFocusRounds = state.completedFocusRounds + 1;
  const progress = addExperience(state.level, state.exp, 25);
  const nextMode = getNextMode("focus", completedFocusRounds);
  const leveledUp = progress.level > state.level;

  return {
    ...state,
    timerMode: nextMode,
    timerStatus: "idle" as TimerStatus,
    remainingSeconds: TIMER_DURATIONS[nextMode],
    completedFocusRounds,
    totalPomodoros: state.totalPomodoros + 1,
    totalFocusSeconds: state.totalFocusSeconds + TIMER_DURATIONS.focus,
    level: progress.level,
    exp: progress.exp,
    coins: state.coins + 8,
    stats: {
      hunger: clampStat(state.stats.hunger - 7),
      mood: clampStat(state.stats.mood + 8),
      energy: clampStat(state.stats.energy - 8)
    },
    lastEvent: leveledUp ? "升级啦！今天又成长了一点点。" : "辛苦啦，我也学到了很多。",
    feedback: leveledUp ? "level-up" : "celebrate"
  };
}

function degradeStats(state: PetState) {
  return {
    hunger: clampStat(state.stats.hunger - 0.08),
    mood: clampStat(state.stats.mood - (state.stats.hunger < 35 ? 0.16 : 0.05)),
    energy: clampStat(state.stats.energy - (state.timerMode === "focus" ? 0.1 : 0.03))
  };
}

export function petReducer(state: PetState, action: Action): PetState {
  switch (action.type) {
    case "HYDRATE":
      return action.state;
    case "START":
      return {
        ...state,
        timerStatus: "running",
        lastEvent: state.timerMode === "focus" ? "我会陪你一起专注。" : "休息一下，补充能量。"
      };
    case "PAUSE":
      return {
        ...state,
        timerStatus: state.timerStatus === "running" ? "paused" : "running",
        lastEvent: state.timerStatus === "running" ? "暂停一下也没关系。" : "继续，我们慢慢来。"
      };
    case "RESET":
      return {
        ...state,
        timerStatus: "idle",
        remainingSeconds: TIMER_DURATIONS[state.timerMode],
        lastEvent: "计时器已经重置。"
      };
    case "SKIP":
      return completeCurrentRound(state);
    case "TICK": {
      const nextState = {
        ...state,
        remainingSeconds: Math.max(0, state.remainingSeconds - 1),
        stats: degradeStats(state)
      };

      if (nextState.remainingSeconds === 0) {
        return completeCurrentRound(nextState);
      }

      return nextState;
    }
    case "FEED": {
      if (state.coins < 5) {
        return {
          ...state,
          lastEvent: "金币还不够买小鱼干。",
          feedback: "hungry"
        };
      }

      return {
        ...state,
        coins: state.coins - 5,
        stats: {
          hunger: clampStat(state.stats.hunger + 24),
          mood: clampStat(state.stats.mood + 8),
          energy: clampStat(state.stats.energy + 3)
        },
        lastEvent: "小鱼干真香。",
        feedback: "fed"
      };
    }
    case "PET":
      return {
        ...state,
        stats: {
          ...state.stats,
          mood: clampStat(state.stats.mood + 10)
        },
        lastEvent: "摸摸头，心情变好了。",
        feedback: "heart"
      };
    case "DEV_LEVEL_UP": {
      const progress = addExperience(state.level, state.exp, getExpForLevel(state.level) - state.exp);

      return {
        ...state,
        level: progress.level,
        exp: progress.exp,
        coins: state.coins + 20,
        stats: {
          hunger: clampStat(state.stats.hunger + 8),
          mood: clampStat(state.stats.mood + 12),
          energy: clampStat(state.stats.energy + 8)
        },
        lastEvent: `开发模式：升级到 Level ${progress.level}。`,
        feedback: "level-up"
      };
    }
    case "DEV_RESET_LEVEL":
      return {
        ...state,
        level: 1,
        exp: 0,
        coins: 0,
        stats: initialPetState.stats,
        lastEvent: "开发模式：宠物等级已重置。",
        feedback: "heart"
      };
    case "CLEAR_FEEDBACK":
      return {
        ...state,
        feedback: null
      };
    default:
      return state;
  }
}

function parseStoredState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as PetState;
    return {
      ...initialPetState,
      ...parsed,
      stats: {
        ...initialPetState.stats,
        ...parsed.stats
      }
    };
  } catch {
    return null;
  }
}

export function usePetStore() {
  const [state, dispatch] = useReducer(petReducer, initialPetState, () => parseStoredState() ?? initialPetState);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        ...state,
        lastSavedAt: Date.now()
      })
    );
  }, [state]);

  useEffect(() => {
    if (state.timerStatus !== "running") {
      return;
    }

    const tickId = window.setInterval(() => {
      dispatch({ type: "TICK" });
    }, 1000);

    return () => window.clearInterval(tickId);
  }, [state.timerStatus]);

  useEffect(() => {
    if (!state.feedback) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      dispatch({ type: "CLEAR_FEEDBACK" });
    }, 1800);

    return () => window.clearTimeout(timeoutId);
  }, [state.feedback]);

  const start = useCallback(() => dispatch({ type: "START" }), []);
  const pause = useCallback(() => dispatch({ type: "PAUSE" }), []);
  const reset = useCallback(() => dispatch({ type: "RESET" }), []);
  const skip = useCallback(() => dispatch({ type: "SKIP" }), []);
  const feed = useCallback(() => dispatch({ type: "FEED" }), []);
  const pet = useCallback(() => dispatch({ type: "PET" }), []);
  const devLevelUp = useCallback(() => dispatch({ type: "DEV_LEVEL_UP" }), []);
  const devResetLevel = useCallback(() => dispatch({ type: "DEV_RESET_LEVEL" }), []);

  return {
    state,
    actions: {
      start,
      pause,
      reset,
      skip,
      feed,
      pet,
      devLevelUp,
      devResetLevel
    },
    derived: {
      stage: getStageForLevel(state.level),
      expToNextLevel: getExpForLevel(state.level)
    }
  };
}
