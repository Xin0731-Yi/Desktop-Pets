export type PetStage = "egg" | "cub" | "teen" | "young" | "adult" | "master";

export type StageInfo = {
  id: PetStage;
  name: string;
  minLevel: number;
  color: string;
  accent: string;
  expression: string;
  size: number;
};

export const STAGES: StageInfo[] = [
  {
    id: "egg",
    name: "宠物蛋",
    minLevel: 1,
    color: "#f7e7c8",
    accent: "#e9b66f",
    expression: "...",
    size: 0.82
  },
  {
    id: "cub",
    name: "幼崽",
    minLevel: 2,
    color: "#f7c5ac",
    accent: "#e4816a",
    expression: "w",
    size: 0.92
  },
  {
    id: "teen",
    name: "少年",
    minLevel: 5,
    color: "#f3a98c",
    accent: "#d86155",
    expression: "v",
    size: 1
  },
  {
    id: "young",
    name: "青年",
    minLevel: 9,
    color: "#d9a47d",
    accent: "#7cc9b8",
    expression: "u",
    size: 1.06
  },
  {
    id: "adult",
    name: "成年",
    minLevel: 14,
    color: "#b98b6f",
    accent: "#5fb6a8",
    expression: "^",
    size: 1.12
  },
  {
    id: "master",
    name: "大师形态",
    minLevel: 20,
    color: "#cfa86a",
    accent: "#8ddfd0",
    expression: "*",
    size: 1.2
  }
];

export function getExpForLevel(level: number) {
  return 80 + level * 35;
}

export function getStageForLevel(level: number) {
  return [...STAGES].reverse().find((stage) => level >= stage.minLevel) ?? STAGES[0];
}

export function addExperience(currentLevel: number, currentExp: number, gainedExp: number) {
  let level = currentLevel;
  let exp = currentExp + gainedExp;
  let needed = getExpForLevel(level);

  while (exp >= needed) {
    exp -= needed;
    level += 1;
    needed = getExpForLevel(level);
  }

  return {
    level,
    exp,
    expToNextLevel: needed,
    stage: getStageForLevel(level)
  };
}

export function clampStat(value: number) {
  return Math.min(100, Math.max(0, value));
}
