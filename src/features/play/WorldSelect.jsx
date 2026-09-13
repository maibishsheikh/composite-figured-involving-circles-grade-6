import React, { useEffect } from 'react';
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

export function WorldSelect({ onSelectWorld }) {
  const { worlds, isMuted } = useProgress();

  useEffect(() => {
    playAudio("Practice — Choose Your World! Answer questions in each world. Earn stars and XP!", isMuted);
    return () => stopAudio();
  }, [isMuted]);

  return (
    <div className="flex-1 w-full h-full max-h-full min-h-0 flex flex-col items-center justify-between p-2 sm:p-4 overflow-y-auto overflow-x-hidden select-none box-border max-w-[1100px] mx-auto">
      {/* Top Header Title & Banner */}
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

      {/* Responsive Grid matching reference KingdomMap (5 cols -> 3 cols -> 2 cols) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 sm:gap-3.5 w-full my-auto py-1 items-stretch">
        {WORLDS_CONFIG.map((world) => {
          const worldState = worlds[world.id] || { unlocked: world.id === 1, stars: 0 };
          const isUnlocked = worldState.unlocked;

          return (
            <div
              key={world.id}
              onClick={() => isUnlocked && onSelectWorld(world.id)}
              className={`p-2.5 sm:p-3.5 rounded-2xl flex flex-col items-center justify-between text-center relative overflow-hidden transition-all duration-200 ${
                isUnlocked
                  ? 'bg-[#1a113c]/92 border-1.5 border-[#ff007f] shadow-[0_0_20px_rgba(255,0,127,0.35)] hover:scale-[1.03] cursor-pointer'
                  : 'bg-[#13082b]/80 border border-white/10 text-gray-400 opacity-60 cursor-not-allowed'
              }`}
            >
              {/* Lock Icon for Locked Worlds */}
              {!isUnlocked && (
                <Lock className="w-3.5 h-3.5 text-purple-300/60 absolute top-2 right-2 shrink-0" />
              )}

              {/* Center Square Icon Container */}
              <div className={`w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center text-xl sm:text-3xl shadow-md my-auto shrink-0 ${
                isUnlocked ? `${world.bg} text-white shadow-lg` : 'bg-[#1e0d45]/90 border border-[#371f6a] text-purple-300/60'
              }`}>
                <span className="drop-shadow">{world.icon}</span>
              </div>

              {/* World Title & Question Range */}
              <div className="my-1.5 w-full px-0.5 shrink-0">
                <h3 className="text-xs sm:text-sm font-black text-white font-display leading-tight line-clamp-1">
                  {world.name}
                </h3>
                <p className="text-[10px] sm:text-xs font-extrabold text-purple-300/90 mt-0.5">
                  {world.qRange}
                </p>
              </div>

              {/* Action Button */}
              {isUnlocked ? (
                <button
                  className="w-full py-1.5 px-2 rounded-full bg-gradient-to-r from-[#ff007f] to-[#e60067] text-white font-black text-xs shadow-md border border-pink-400/50 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-1 cursor-pointer mt-0.5 shrink-0"
                >
                  <Play className="w-3 h-3 fill-white text-white" />
                  <span>PRACTICE</span>
                </button>
              ) : (
                <div className="w-full py-1 px-2 rounded-full bg-[#1b0c42] border border-[#391f6e] text-[10px] font-black text-purple-300/50 uppercase tracking-wider mt-0.5 shrink-0">
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
