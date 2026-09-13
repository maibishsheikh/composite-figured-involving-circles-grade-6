import React from 'react';
import { Heart } from 'lucide-react';
import { useProgress } from '../state/ProgressContext.jsx';

export function HeartsRow() {
  const { hearts } = useProgress();

  return (
    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-bg-card border border-brand-red/40">
      {[1, 2, 3].map((num) => {
        const isFilled = num <= hearts;
        return (
          <Heart
            key={num}
            className={`w-5 h-5 transition-all duration-300 ${
              isFilled ? 'text-brand-red fill-brand-red scale-110 drop-shadow-[0_0_8px_rgba(239,74,95,0.8)]' : 'text-gray-600 fill-gray-800 opacity-40'
            }`}
          />
        );
      })}
    </div>
  );
}
