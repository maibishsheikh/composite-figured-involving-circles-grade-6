import React from 'react';
import { Flame } from 'lucide-react';
import { useProgress } from '../state/ProgressContext.jsx';

export function StreakChip() {
  const { streak } = useProgress();

  if (streak === 0) return null;

  return (
    <div className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-brand-bg-card border border-brand-pink/50 shadow-glow-pink animate-bounce">
      <Flame className="w-4 h-4 text-brand-pink fill-brand-pink" />
      <span className="text-sm font-extrabold text-brand-pink">{streak}x Streak!</span>
    </div>
  );
}
