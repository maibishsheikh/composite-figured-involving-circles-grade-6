import React from 'react';
import { useProgress } from '../state/ProgressContext.jsx';
import { stopAudio } from '../utils/audio.js';

const PHASES = [
  { key: 'wonder',   num: '01', icon: '🔍', label: 'Wonder'   },
  { key: 'story',    num: '02', icon: '📖', label: 'Story'    },
  { key: 'simulate', num: '03', icon: '✏️', label: 'Simulate' },
  { key: 'practice', num: '04', icon: '🎮', label: 'Practice' },
  { key: 'reflect',  num: '05', icon: '📝', label: 'Reflect'  },
];

const PHASE_ORDER = ['landing', 'wonder', 'story', 'simulate', 'practice', 'reflect'];

export function TopBar() {
  const { currentPhase, setPhase, isMuted, toggleMute, resetAllProgress, simulateStations, worlds, reflectionText } = useProgress();

  if (currentPhase === 'landing') return null;

  const handleReturnHome = () => {
    stopAudio();
    resetAllProgress();
    setPhase('landing');
  };

  const handleSelectPhase = (phaseKey) => {
    stopAudio();
    setPhase(phaseKey);
  };

  // Determine completion state
  const currentIndex = PHASE_ORDER.indexOf(currentPhase);
  const isSimulateDone = (simulateStations?.station1?.completed && simulateStations?.station2?.completed && simulateStations?.station3?.completed) || currentIndex > 3;
  const isPracticeDone = Object.values(worlds || {}).some(w => w.stars > 0) || currentIndex > 4;
  const isReflectDone = (reflectionText?.trim().length >= 10);

  const isCompleted = {
    wonder: currentIndex > 1,
    story: currentIndex > 2,
    simulate: isSimulateDone,
    practice: isPracticeDone,
    reflect: isReflectDone
  };

  return (
    <header className="app-header">
      {/* Left Home Button */}
      <button
        onClick={handleReturnHome}
        className="home-btn"
        aria-label="Home"
        title="Return to Home"
      >
        <span className="home-icon">🏠</span>
        <span className="home-text">Home</span>
      </button>

      {/* Center Progress Capsule Navigation */}
      <div className="header-progress">
        <nav className="progress-bar-nav" role="navigation" aria-label="Learning journey phases">
          <div className="progress-bar-pill">
            {PHASES.map((p, i) => {
              const isActive = p.key === currentPhase;
              const isDone = isCompleted[p.key];

              return (
                <React.Fragment key={p.key}>
                  <div
                    className={`step-item ${isActive ? 'active' : ''} ${isDone ? 'completed' : ''}`}
                    onClick={() => handleSelectPhase(p.key)}
                    role="button"
                    tabIndex={0}
                    aria-label={`Go to ${p.label} phase`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleSelectPhase(p.key);
                      }
                    }}
                  >
                    <span className={`step-circle ${isDone ? 'circle-done' : isActive ? 'circle-active' : 'circle-idle'}`}>
                      {isDone ? '✓' : p.num}
                    </span>
                    <span className="step-label">
                      <span className="step-label-icon">{p.icon}</span>
                      <span>{p.label}</span>
                    </span>
                  </div>
                  {i < PHASES.length - 1 && <span className="step-divider">—</span>}
                </React.Fragment>
              );
            })}
          </div>

          {/* Audio Toggle Button right beside the pill */}
          <button
            className="audio-btn"
            onClick={toggleMute}
            aria-label={isMuted ? 'Unmute sound' : 'Mute sound'}
            title={isMuted ? 'Unmute sound' : 'Mute sound'}
          >
            {isMuted ? '🔇' : '🔊'}
          </button>
        </nav>
      </div>
    </header>
  );
}
