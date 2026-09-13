import React, { useEffect } from 'react';
import './KingdomMap.css';
import { useProgress } from '../../state/ProgressContext.jsx';
import { playAudio, stopAudio } from '../../utils/audio.js';
import { Lock, Play } from 'lucide-react';

const WORLDS_CONFIG = [
  { id: 1, name: "Round Table Yard", icon: "⭕", qRange: "Questions 1–10", bg: "bg-[#3b82f6]" },
  { id: 2, name: "Garden Path Grove", icon: "🌳", qRange: "Questions 11–20", bg: "bg-[#10b981]" },
  { id: 3, name: "Wheel Works", icon: "⚙️", qRange: "Questions 21–30", bg: "bg-[#6366f1]" },
  { id: 4, name: "Pizza Palace", icon: "🍕", qRange: "Questions 31–40", bg: "bg-[#f59e0b]" },
  { id: 5, name: "Window Wonderland", icon: "🪟", qRange: "Questions 41–50", bg: "bg-[#ec4899]" },
  { id: 6, name: "Coin Cove", icon: "🪙", qRange: "Questions 51–60", bg: "bg-[#14b8a6]" },
  { id: 7, name: "Raceway Track", icon: "🏟️", qRange: "Questions 61–70", bg: "bg-[#8b5cf6]" },
  { id: 8, name: "Clock Tower City", icon: "🕰️", qRange: "Questions 71–80", bg: "bg-[#f43f5e]" },
  { id: 9, name: "Word Problem Woods", icon: "📖", qRange: "Questions 81–90", bg: "bg-[#06b6d4]" },
  { id: 10, name: "Challenge Colosseum", icon: "🏛️", qRange: "Questions 91–100", bg: "bg-[#a855f7]" }
];

export default function KingdomMap({ onSelectWorld }) {
  const { worlds, isMuted } = useProgress();

  useEffect(() => {
    playAudio("Practice — Choose Your World! Answer questions in each world. Earn stars and XP!", isMuted);
    return () => stopAudio();
  }, [isMuted]);

  return (
    <div className="flex-1 w-full h-full max-h-full min-h-0 flex flex-col items-center justify-between p-2 sm:p-4 overflow-y-auto overflow-x-hidden select-none box-border max-w-[1100px] mx-auto">
      {/* Top Header Title */}
      <div className="text-center shrink-0 mb-1">
        <div className="flex items-center justify-center gap-2 mb-0.5">
          <span className="text-xl sm:text-3xl text-[#a78bfa]">🎮</span>
          <h2 className="text-xl sm:text-3xl lg:text-4xl font-black text-white font-display drop-shadow-md">
            Practice — Choose Your World!
          </h2>
        </div>
        <p className="text-xs sm:text-sm font-extrabold text-[#c2b3f3]">
          Answer questions in each world. Earn stars and XP!
        </p>
      </div>

      {/* Grid */}
      <div className="kingdom-grid my-auto py-1">
        {WORLDS_CONFIG.map((world) => {
          const worldState = worlds[world.id] || { unlocked: world.id === 1, stars: 0 };
          const isUnlocked = worldState.unlocked;

          return (
            <div
              key={world.id}
              onClick={() => isUnlocked && onSelectWorld(world.id)}
              className={`kingdom-district-card relative ${
                isUnlocked ? 'current' : 'locked'
              }`}
            >
              {!isUnlocked && (
                <Lock className="w-3.5 h-3.5 text-purple-300/60 absolute top-2 right-2 shrink-0" />
              )}

              <div className={`district-icon-wrap ${
                isUnlocked ? `${world.bg} text-white shadow-lg` : 'bg-[#1e0d45]/90 text-purple-300/60'
              }`}>
                <span>{world.icon}</span>
              </div>

              <div className="district-info">
                <span className="district-num">{world.qRange}</span>
                <span className="district-name">{world.name}</span>
              </div>

              {isUnlocked ? (
                <button
                  className="btn btn-primary btn-sm w-full py-1 text-xs mt-1"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>PRACTICE</span>
                </button>
              ) : (
                <div className="w-full py-1 rounded-full bg-white/10 text-[10px] font-black text-white/50 uppercase tracking-wider mt-1">
                  LOCKED
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export { KingdomMap };
