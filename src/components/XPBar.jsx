import React from 'react';
import { Sparkles } from 'lucide-react';
import { useProgress } from '../state/ProgressContext.jsx';

export function XPBar() {
  const { xpTotal } = useProgress();

  return (
    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-bg-card border border-brand-gold/40 shadow-glow-gold">
      <Sparkles className="w-4 h-4 text-brand-gold fill-brand-gold animate-pulse" />
      <span className="text-sm font-extrabold text-brand-gold">
        {xpTotal} XP
      </span>
    </div>
  );
}
