// src/components/simulations/ShapeSplitterStation.jsx
import React, { useState } from 'react';
import './Stations.css';
import { playAudio, stopAudio } from '../../utils/audio.js';

const CHALLENGES = [
  {
    id: 1,
    name: "Running Track Field",
    targetRects: 1,
    targetSemis: 2,
    targetQuarters: 0,
    rectDims: "10m × 6m = 60 m²",
    semiDims: "r = 3m, 2 semis = πr² = 28.26 m²",
    targetArea: "88.26 m²",
    blueprintDesc: "Construct a running track: 1 central rectangle (10m × 6m) + 2 semicircle endcaps (r = 3m)."
  },
  {
    id: 2,
    name: "Norman Arch Window",
    targetRects: 1, // square base
    targetSemis: 1,
    targetQuarters: 0,
    rectDims: "8m × 8m square = 64 m²",
    semiDims: "r = 4m arch = ½πr² = 25.12 m²",
    targetArea: "89.12 m²",
    blueprintDesc: "Construct a Norman Arch: 1 square base (8m × 8m) + 1 semicircle top arch (r = 4m)."
  },
  {
    id: 3,
    name: "Ice-Cream Cone Sign",
    targetRects: 0,
    targetSemis: 1,
    targetQuarters: 0,
    rectDims: "Triangle cone (b=6, h=8) = 24 cm²",
    semiDims: "r = 3cm scoop = ½πr² = 14.13 cm²",
    targetArea: "38.13 cm²",
    blueprintDesc: "Construct an ice-cream sign: 1 triangle cone + 1 semicircle scoop (r = 3cm)."
  }
];

export default function ShapeSplitterStation({ onComplete, onStationComplete, audioEnabled }) {
  const [challIdx, setChallIdx] = useState(0);
  const [parts, setParts] = useState({ rects: 0, semis: 0, quarters: 0 });
  const [isExploded, setIsExploded] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [shake, setShake] = useState(false);

  const challenge = CHALLENGES[challIdx];
  const handleNotifyComplete = onStationComplete || onComplete;

  const addPart = (type) => {
    setFeedback(null);
    setParts(prev => ({ ...prev, [type]: prev[type] + 1 }));
  };

  const removePart = (type) => {
    setFeedback(null);
    setParts(prev => ({ ...prev, [type]: Math.max(0, prev[type] - 1) }));
  };

  const handleReset = () => {
    setParts({ rects: 0, semis: 0, quarters: 0 });
    setFeedback(null);
    setIsExploded(false);
  };

  const handleCheck = () => {
    const isCorrect =
      parts.rects === challenge.targetRects &&
      parts.semis === challenge.targetSemis &&
      parts.quarters === challenge.targetQuarters;

    if (isCorrect) {
      setFeedback({
        isSuccess: true,
        message: `Outstanding! Blueprint matched: Total Area = ${challenge.targetArea}!`
      });
      playAudio(`Spot on! You built the composite shape and calculated the total area: ${challenge.targetArea}!`, !audioEnabled);
      if (handleNotifyComplete) handleNotifyComplete(true);
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      setFeedback({
        isSuccess: false,
        message: `Not quite! Check the blueprint requirements: ${challenge.blueprintDesc}`
      });
      playAudio("Review the blueprint requirements to make sure you have the exact shapes needed!", !audioEnabled);
    }
  };

  const nextChallenge = () => {
    stopAudio();
    setChallIdx((prev) => (prev + 1) % CHALLENGES.length);
    handleReset();
  };

  return (
    <div className="station-wrap">
      {/* Header */}
      <div className="station-header">
        <h3 className="station-title">🧱 Station A: Composite Figure Architect</h3>
        <div className={`station-target-box ${shake ? 'anim-shake' : ''}`}>
          <span className="station-target-label">Target Area:</span>
          <span className="station-target-num">{challenge.targetArea}</span>
        </div>
      </div>

      {/* Main 2-Column Simulative Layout */}
      <div className="station-grid-2col">
        {/* Left Column: Interactive Blueprint Canvas */}
        <div className="station-col-left">
          <div className="p-2 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between text-xs">
            <span className="text-white/80 font-bold">{challenge.name}</span>
            <button
              onClick={() => setIsExploded(!isExploded)}
              className="px-2.5 py-1 bg-[#f59e0b]/20 text-[#ffd54f] border border-[#f59e0b]/40 rounded-lg font-bold text-xs hover:bg-[#f59e0b]/30 transition-all"
            >
              {isExploded ? "Combine Pieces" : "Explode Decomposed Parts"}
            </button>
          </div>

          {/* SVG Visualizer */}
          <div className="flex-1 w-full bg-[#120a2e]/90 rounded-2xl border border-white/15 p-2 flex items-center justify-center min-h-[140px] max-h-[190px] relative overflow-hidden">
            <svg viewBox="0 0 320 160" className="w-full h-full max-h-[170px]">
              {/* Left Semicircle */}
              {parts.semis >= 1 && (
                <g transform={isExploded ? "translate(-20, 0)" : "translate(0, 0)"} className="transition-transform duration-500">
                  <path d="M 100 30 A 50 50 0 0 0 100 130 Z" fill="#f59e0b" fillOpacity="0.45" stroke="#f59e0b" strokeWidth="3" />
                  <text x="70" y="85" fill="#f59e0b" fontSize="11" fontWeight="bold" textAnchor="middle">Semi 1</text>
                </g>
              )}

              {/* Rectangle / Base */}
              {parts.rects >= 1 && (
                <g>
                  <rect x="100" y="30" width="120" height="100" fill="#38bdf8" fillOpacity="0.35" stroke="#38bdf8" strokeWidth="3" />
                  <text x="160" y="85" fill="#ffffff" fontSize="12" fontWeight="bold" textAnchor="middle">Rectangle</text>
                  <line x1="100" y1="30" x2="100" y2="130" stroke="#ffffff" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.5" />
                  <line x1="220" y1="30" x2="220" y2="130" stroke="#ffffff" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.5" />
                </g>
              )}

              {/* Right Semicircle */}
              {parts.semis >= 2 && (
                <g transform={isExploded ? "translate(20, 0)" : "translate(0, 0)"} className="transition-transform duration-500">
                  <path d="M 220 30 A 50 50 0 0 1 220 130 Z" fill="#f59e0b" fillOpacity="0.45" stroke="#f59e0b" strokeWidth="3" />
                  <text x="250" y="85" fill="#f59e0b" fontSize="11" fontWeight="bold" textAnchor="middle">Semi 2</text>
                </g>
              )}

              {/* Empty placeholder if no parts */}
              {parts.rects === 0 && parts.semis === 0 && (
                <text x="160" y="85" fill="rgba(255,255,255,0.4)" fontSize="12" textAnchor="middle">
                  Tap shapes below to place them on the blueprint stage!
                </text>
              )}
            </svg>
          </div>

          {/* Placed Pieces Counter */}
          <div className="flex gap-2 text-xs">
            <div className="flex-1 bg-white/5 border border-white/10 rounded-lg p-1.5 text-center">
              <span className="text-white/60 block text-[10px]">Rectangles:</span>
              <strong className="text-[#38bdf8] text-sm">{parts.rects}</strong>
            </div>
            <div className="flex-1 bg-white/5 border border-white/10 rounded-lg p-1.5 text-center">
              <span className="text-white/60 block text-[10px]">Semicircles:</span>
              <strong className="text-[#f59e0b] text-sm">{parts.semis}</strong>
            </div>
          </div>
        </div>

        {/* Right Column: Shape Supply Palette & Formula Breakdown */}
        <div className="station-col-right">
          <div className="bg-white/5 border border-white/10 rounded-xl p-2.5">
            <span className="text-[11px] font-bold text-[#ffd54f] uppercase tracking-wider block mb-1">
              📋 Blueprint Instructions:
            </span>
            <p className="text-xs text-white/90 leading-snug">{challenge.blueprintDesc}</p>
          </div>

          {/* Add / Remove Shape Controls */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between bg-white/5 border border-white/10 p-2 rounded-xl">
              <div>
                <span className="font-bold text-white text-xs block">Rectangle / Square</span>
                <span className="text-[10px] text-white/50">{challenge.rectDims}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => removePart('rects')}
                  disabled={parts.rects === 0}
                  className="w-7 h-7 rounded-lg bg-white/10 text-white hover:bg-white/20 font-bold disabled:opacity-30"
                >
                  −
                </button>
                <span className="w-5 text-center font-bold text-xs text-white">{parts.rects}</span>
                <button
                  onClick={() => addPart('rects')}
                  className="w-7 h-7 rounded-lg bg-[#38bdf8] text-[#0f172a] hover:bg-[#7dd3fc] font-bold"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between bg-white/5 border border-white/10 p-2 rounded-xl">
              <div>
                <span className="font-bold text-white text-xs block">Semicircle (½ Circle)</span>
                <span className="text-[10px] text-white/50">{challenge.semiDims}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => removePart('semis')}
                  disabled={parts.semis === 0}
                  className="w-7 h-7 rounded-lg bg-white/10 text-white hover:bg-white/20 font-bold disabled:opacity-30"
                >
                  −
                </button>
                <span className="w-5 text-center font-bold text-xs text-white">{parts.semis}</span>
                <button
                  onClick={() => addPart('semis')}
                  className="w-7 h-7 rounded-lg bg-[#f59e0b] text-[#0f172a] hover:bg-[#fbbf24] font-bold"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Feedback Display (Inline & Non-blocking) */}
          {feedback && (
            <div className={`p-2 rounded-xl text-xs font-bold border transition-all ${
              feedback.isSuccess
                ? 'bg-[#22c55e]/25 border-[#22c55e] text-[#86efac]'
                : 'bg-[#ef4444]/25 border-[#ef4444] text-[#fca5a5]'
            }`}>
              {feedback.message}
            </div>
          )}

          {/* Action Bar */}
          <div className="flex items-center gap-2 pt-1">
            <button onClick={handleReset} className="btn btn-outline btn-sm flex-1">
              Clear
            </button>
            <button onClick={handleCheck} className="btn btn-primary btn-sm flex-1">
              Verify Blueprint ✓
            </button>
            {feedback?.isSuccess && (
              <button onClick={nextChallenge} className="btn btn-green btn-sm flex-1">
                Next →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
export { ShapeSplitterStation };
