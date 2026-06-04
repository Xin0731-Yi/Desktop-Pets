import { useEffect, useState } from "react";
import { Controls } from "./components/Controls";
import { Pet } from "./components/Pet";
import { StatsPanel } from "./components/StatsPanel";
import { TimerBubble } from "./components/TimerBubble";
import { usePetStore } from "./store/petStore";

export default function App() {
  const { state, actions, derived } = usePetStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [alwaysOnTop, setAlwaysOnTop] = useState(true);

  const toggleMenu = () => {
    if (detailOpen) {
      return;
    }

    setMenuOpen((current) => !current);
  };

  const openDetail = () => {
    setMenuOpen(false);
    setDetailOpen(true);
  };

  const closeDetail = () => {
    setDetailOpen(false);
  };

  const backToMenu = () => {
    setDetailOpen(false);
    setMenuOpen(true);
  };

  const toggleAlwaysOnTop = async () => {
    const nextValue = await window.focusPet?.toggleAlwaysOnTop();
    if (typeof nextValue === "boolean") {
      setAlwaysOnTop(nextValue);
    }
  };

  useEffect(() => {
    void window.focusPet?.setMousePassthrough(false);
  }, []);

  useEffect(() => {
    void window.focusPet?.setMousePassthrough(false);
  }, [detailOpen, menuOpen]);


  useEffect(() => {
    const mode = detailOpen ? "detail" : menuOpen ? "menu" : "pet";
    void window.focusPet?.setMode(mode);
  }, [detailOpen, menuOpen]);

  return (
    <main className={`app-shell ${detailOpen ? "detail-mode" : "pet-only-mode"}`}>
      <section className="pet-stage" aria-label="Focus pet desktop companion">
        <TimerBubble mode={state.timerMode} status={state.timerStatus} remainingSeconds={state.remainingSeconds} />
        <Pet
          stage={derived.stage}
          mode={state.timerMode}
          status={state.timerStatus}
          feedback={state.feedback}
          onClick={toggleMenu}
        />

        {menuOpen ? (
          <div className="pet-menu" aria-label="Pet quick options">
            <button className="menu-action menu-feed" type="button" onClick={actions.feed}>
              喂小鱼干
            </button>
            <button className="menu-action menu-focus" type="button" onClick={state.timerStatus === "running" || state.timerStatus === "paused" ? actions.pause : actions.start}>
              {state.timerStatus === "running" ? "暂停" : state.timerStatus === "paused" ? "继续" : "开始专注"}
            </button>
            <button className="menu-action menu-pet" type="button" onClick={actions.pet}>
              摸摸头
            </button>
            <button className={`menu-action menu-pin ${alwaysOnTop ? "is-active" : ""}`} type="button" onClick={() => void toggleAlwaysOnTop()}>
              {alwaysOnTop ? "已置顶" : "置顶"}
            </button>
            <button className="menu-action menu-panel" type="button" onClick={openDetail}>
              打开面板
            </button>
          </div>
        ) : null}
      </section>

      {detailOpen ? (
        <section className="detail-window" aria-label="Focus pet detail panel">
          <header className="window-bar">
            <div className="detail-title">
              <button className="back-button" type="button" onClick={backToMenu} aria-label="Back to pet menu">
                返回
              </button>
              <div className="brand">
                <span className="brand-mark" />
                <span>Focus Pet</span>
              </div>
            </div>
            <div className="window-actions">
              <button className="dev-icon-button" type="button" onClick={actions.devResetLevel} aria-label="Reset pet level">
                ↺
              </button>
              <button className="dev-icon-button" type="button" onClick={actions.devLevelUp} aria-label="Level up pet">
                ↑
              </button>
              <button type="button" onClick={() => void toggleAlwaysOnTop()} aria-label="Toggle always on top">
                ⌁
              </button>
              <button type="button" onClick={closeDetail} aria-label="Close panel">
                ×
              </button>
            </div>
          </header>

          <p className="event-line">{state.lastEvent}</p>

          <StatsPanel
            level={state.level}
            exp={state.exp}
            coins={state.coins}
            totalPomodoros={state.totalPomodoros}
            totalFocusSeconds={state.totalFocusSeconds}
            stats={state.stats}
            stage={derived.stage}
          />

          <Controls
            status={state.timerStatus}
            onStart={actions.start}
            onPause={actions.pause}
            onReset={actions.reset}
            onSkip={actions.skip}
            onFeed={actions.feed}
            onPet={actions.pet}
          />
        </section>
      ) : null}
    </main>
  );
}
