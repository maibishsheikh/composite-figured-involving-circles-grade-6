// src/components/phases/WonderPhase.jsx
import React, { useEffect, useState } from 'react';
import './WonderPhase.css';
import { useProgress } from '../../state/ProgressContext.jsx';
import { playAudio, stopAudio } from '../../utils/audio.js';
import { Compass, Sparkles, Volume2, Eye } from 'lucide-react';
import wonderTrackImg from '../../assets/wonder_track.jpg';

export default function WonderPhase() {
  const { setPhase, isMuted } = useProgress();
  const [isRevealed, setIsRevealed] = useState(false);

  const hookText = "Oliver is designing a running track with two curved semicircle ends and a rectangle middle. How can we find the total distance around without losing track?";

  useEffect(() => {
    playAudio(hookText, isMuted);
    return () => stopAudio();
  }, [isMuted]);

  return (
    <div className="wonder-wrap select-none">
      <div className="wonder-content anim-slide-up">
        <div className="wonder-card">
          {/* Top Accent Bar */}
          <div className="w-14 h-1.5 bg-[#a060ff] rounded-full shadow-[0_0_12px_#a060ff] shrink-0" />

          {/* Title Row */}
          <div className="flex items-center justify-center gap-2.5 shrink-0">
            <h2 className="text-white font-black text-xl sm:text-3xl flex items-center justify-center gap-2 drop-shadow-md font-display">
              <span>🔮</span>
              <span>Wonder Hook</span>
            </h2>
            <button
              onClick={() => playAudio(hookText, isMuted)}
              className="p-1.5 rounded-full bg-[#24154e] text-[#35d0f5] hover:bg-[#321c6b] cursor-pointer transition-all shadow border border-[#35d0f5]/40"
              title="Listen to Wonder Hook Narration"
            >
              <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          {/* Interactive Wonder Illustration / Mystery Card */}
          <div
            onClick={() => setIsRevealed(!isRevealed)}
            className="w-full max-w-[460px] cursor-pointer relative shrink-0 transition-transform duration-300 hover:scale-[1.01]"
            title="Click to toggle blueprint reveal"
          >
            {isRevealed ? (
              <div className="relative w-full aspect-[16/9] max-h-[170px] sm:max-h-[195px] rounded-2xl overflow-hidden border-2 border-[#35d0f5] shadow-[0_0_25px_rgba(53,208,245,0.4)] anim-scale-up">
                <img
                  src={wonderTrackImg || "/assets/images/wonder_track.jpg"}
                  alt="Oliver's Stadium Track Blueprint"
                  className="w-full h-full object-cover"
                />
                {/* Overlay Badges */}
                <div className="absolute top-2 left-2 z-10 bg-black/75 backdrop-blur-md border border-[#35d0f5]/70 text-[#35d0f5] text-[10px] sm:text-xs font-black px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-md">
                  <Sparkles className="w-3.5 h-3.5 text-[#ffd54f]" />
                  <span>Oliver's Plan: 2 Semicircles + 1 Rectangle</span>
                </div>
                <div className="absolute bottom-2 right-2 z-10 bg-black/75 backdrop-blur-md border border-white/20 text-white/90 text-[10px] font-bold px-2 py-0.5 rounded-lg flex items-center gap-1">
                  <span>Tap to close</span>
                </div>
              </div>
            ) : (
              <div className="relative w-full aspect-[16/9] max-h-[170px] sm:max-h-[195px] rounded-2xl overflow-hidden border-2 border-dashed border-[#7c4dff] hover:border-[#35d0f5] bg-[#160b33] flex flex-col items-center justify-center p-3 transition-all shadow-inner group">
                <img
                  src={wonderTrackImg || "/assets/images/wonder_track.jpg"}
                  alt="Mystery Blueprint"
                  className="absolute inset-0 w-full h-full object-cover blur-sm opacity-25 group-hover:opacity-35 transition-opacity scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#12082b]/90 via-[#12082b]/70 to-transparent" />
                <div className="relative z-10 flex flex-col items-center gap-1 text-center">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#35d0f5]/20 border border-[#35d0f5] flex items-center justify-center animate-bounce shadow-[0_0_12px_#35d0f5]">
                    <Compass className="w-5 h-5 sm:w-6 sm:h-6 text-[#35d0f5]" />
                  </div>
                  <h3 className="text-[#ffd54f] text-sm sm:text-base font-black flex items-center justify-center gap-1.5 font-display text-glow-gold">
                    <Sparkles className="w-4 h-4 text-[#ffd54f]" />
                    <span>Tap to Reveal Oliver's Stadium Track!</span>
                    <Sparkles className="w-4 h-4 text-[#ffd54f]" />
                  </h3>
                  <span className="text-[10px] sm:text-[11px] font-extrabold text-white/70 uppercase tracking-widest flex items-center gap-1">
                    <Eye className="w-3 h-3 text-[#35d0f5]" />
                    <span>Composite Figure Blueprint Inside</span>
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Hook Dilemma Text */}
          <div className="max-w-lg px-2 shrink-0">
            <p className="text-sm sm:text-base font-black text-white leading-snug font-display">
              Oliver has a running track with two{' '}
              <span className="text-[#ffd54f] font-black underline decoration-[#ffd54f]/50">curved semicircle ends</span> and a{' '}
              <span className="text-[#35d0f5] font-black underline decoration-[#35d0f5]/50">rectangle middle</span>.
            </p>
            <p className="text-xs sm:text-sm font-bold text-gray-300 mt-1">
              How can we find the total distance around without losing track?
            </p>
          </div>

          {/* Primary CTA Button */}
          <button
            onClick={() => setPhase('story')}
            className="btn-primary text-sm sm:text-base py-2.5 px-7 rounded-2xl shadow-xl active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2 shrink-0"
          >
            <span>Discover the Story →</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export { WonderPhase };
