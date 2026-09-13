// src/components/FeedbackOverlay.jsx
import React from 'react';
import { CheckCircle2, XCircle, Sparkles } from 'lucide-react';

export function FeedbackOverlay({ isCorrect, explanation, onNext, onClose, isLastQuestion }) {
  const handleAction = () => {
    if (typeof onNext === 'function') {
      onNext();
    } else if (typeof onClose === 'function') {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md anim-fade-in select-none"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleAction();
      }}
    >
      <div
        className={`w-full max-w-md p-5 sm:p-6 rounded-3xl border-2 text-center shadow-2xl flex flex-col items-center gap-3 anim-bounce-in ${
          isCorrect
            ? 'bg-[#12281c]/95 border-[#22c55e] shadow-[0_0_35px_rgba(34,197,94,0.4)]'
            : 'bg-[#2a1118]/95 border-[#ef4444] shadow-[0_0_35px_rgba(239,68,68,0.4)]'
        }`}
      >
        {/* Icon & Title */}
        {isCorrect ? (
          <div className="flex flex-col items-center gap-1.5">
            <div className="w-14 h-14 rounded-full bg-[#22c55e]/20 flex items-center justify-center border-2 border-[#22c55e] shadow-lg animate-bounce">
              <CheckCircle2 className="w-8 h-8 text-[#22c55e]" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#86efac] font-display">
              Correct! 🎉
            </h2>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1.5">
            <div className="w-14 h-14 rounded-full bg-[#ef4444]/20 flex items-center justify-center border-2 border-[#ef4444] shadow-lg animate-pulse">
              <XCircle className="w-8 h-8 text-[#ef4444]" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#fca5a5] font-display">
              Not quite! 💡
            </h2>
          </div>
        )}

        {/* Worked Explanation */}
        <div className="w-full bg-black/45 rounded-2xl p-3 sm:p-4 border border-white/10 text-left">
          <p className="text-[11px] uppercase font-black text-[#35d0f5] mb-1 flex items-center gap-1 font-display">
            <Sparkles className="w-3.5 h-3.5" /> Step-by-step Solution:
          </p>
          <p className="text-xs sm:text-sm font-bold text-gray-200 leading-relaxed font-sans">
            {explanation}
          </p>
        </div>

        {/* Continue CTA */}
        <button
          onClick={handleAction}
          className={`${
            isCorrect ? 'btn-green' : 'btn-primary'
          } w-full py-2.5 rounded-xl text-sm sm:text-base font-black shadow-lg active:scale-95 transition-all cursor-pointer mt-1`}
        >
          {isLastQuestion ? 'View Results! 🏆' : 'Continue →'}
        </button>
      </div>
    </div>
  );
}
export default FeedbackOverlay;
