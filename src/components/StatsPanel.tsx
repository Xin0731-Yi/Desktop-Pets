import { getExpForLevel, type StageInfo } from "../lib/progression";
import { type PetStats } from "../store/petStore";

type StatsPanelProps = {
  level: number;
  exp: number;
  coins: number;
  totalPomodoros: number;
  totalFocusSeconds: number;
  stats: PetStats;
  stage: StageInfo;
};

function StatBar({ label, value, tone }: { label: string; value: number; tone: "coral" | "mint" | "gold" }) {
  const displayValue = Math.round(value);

  return (
    <div className="stat-row">
      <div className="stat-label">
        <span>{label}</span>
        <strong>{displayValue}</strong>
      </div>
      <div className="stat-track">
        <div className={`stat-fill ${tone}`} style={{ width: `${displayValue}%` }} />
      </div>
    </div>
  );
}

export function StatsPanel({ level, exp, coins, totalPomodoros, totalFocusSeconds, stats, stage }: StatsPanelProps) {
  const expToNext = getExpForLevel(level);
  const hours = Math.floor(totalFocusSeconds / 3600);
  const minutes = Math.floor((totalFocusSeconds % 3600) / 60);

  return (
    <section className="stats-panel" aria-label="Pet growth stats">
      <div className="growth-card">
        <div>
          <span className="caption">Level {level}</span>
          <h2>{stage.name}</h2>
        </div>
        <div className="coin-pill">{coins} 金币</div>
      </div>

      <div className="exp-row">
        <span>EXP</span>
        <div className="exp-track">
          <div className="exp-fill" style={{ width: `${Math.min(100, (exp / expToNext) * 100)}%` }} />
        </div>
        <strong>
          {exp}/{expToNext}
        </strong>
      </div>

      <div className="stats-grid">
        <StatBar label="饱食度" value={stats.hunger} tone="gold" />
        <StatBar label="心情值" value={stats.mood} tone="coral" />
        <StatBar label="体力值" value={stats.energy} tone="mint" />
      </div>

      <div className="summary-strip">
        <span>{totalPomodoros} 个番茄钟</span>
        <span>{hours}h {minutes}m 专注</span>
      </div>
    </section>
  );
}
