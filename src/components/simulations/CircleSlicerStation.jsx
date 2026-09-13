// src/components/simulations/CircleSlicerStation.jsx
import React, { useState } from 'react';
import './Stations.css';
import { playAudio, stopAudio } from '../../utils/audio.js';

const CHALLENGES = [
  {
    id: 1,
    title: "Semicircle Pizza Bench",
    targetMode: 'half',
    targetRadius: 7,
    piLabel: "22/7",
    piNumeric: 22 / 7,
    targetArea: "77 cm²",
    targetFraction: "1/2",
    prompt: "Slice the circular dough into a Semicircle (½) with radius r = 7cm. What is the slice area?"
  },
  {
    id: 2,
    title: "Quarter Circle Garden Sector",
    targetMode: 'quarter',
    targetRadius: 10,
    piLabel: "3.14",
    piNumeric: 3.14,
    targetArea: "78.5 cm²",
    targetFraction: "1/4",
    prompt: "Slice the circular flowerbed into a Quarter Circle (¼) with radius r = 10cm. What is the slice area?"
  },
  {
    id: 3,
    title: "Three-Quarter Carousel Stage",
    targetMode: 'three-quarter',
    targetRadius: 7,
    piLabel: "22/7",
    piNumeric: 22 / 7,
    targetArea: "115.5 cm²",
    targetFraction: "3/4",
    prompt: "Slice into a Three-Quarter circle (¾) with radius r = 7cm. What is the slice area?"
  }
];

const SLICES = [
  { key: 'quarter', fraction: '1/4', factor: 0.25, label: 'Quarter (¼)' },
  { key: 'half', fraction: '1/2', factor: 0.5, label: 'Semicircle (½)' },
  { key: 'three-quarter', fraction: '3/4', factor: 0.75, label: 'Three-Quarter (¾)' },
  { key: 'full', fraction: '1', factor: 1.0, label: 'Full Circle (1)' }
];

export default function CircleSlicerStation({ onComplete, onStationComplete, audioEnabled }) {
  const [challIdx, setChallIdx] = useState(0);
  const [currentSlice, setCurrentSlice] = useState('full');
  const [currentRadius, setCurrentRadius] = useState(7);
  const [feedback, setFeedback] = useState(null);
  const [shake, setShake] = useState(false);

  const challenge = CHALLENGES[challIdx];
  const sliceMeta = SLICES.find(s => s.key === currentSlice) || SLICES[3];
  const handleNotifyComplete = onStationComplete || onComplete;

  const calculatedArea = (sliceMeta.factor * challenge.piNumeric * currentRadius * currentRadius).toFixed(1);

  const handleCheck = () => {
    const isCorrect =
      currentSlice === challenge.targetMode &&
      currentRadius === challenge.targetRadius;

    if (isCorrect) {
      setFeedback({
        isSuccess: true,
        message: `Spot on! (${challenge.targetFraction}) × π × ${challenge.targetRadius}² = ${challenge.targetArea}!`
      });
      playAudio(`Spot on! You sliced the circle to ${sliceMeta.label} with area ${challenge.targetArea}!`, !audioEnabled);
      if (handleNotifyComplete) handleNotifyComplete(true);
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      setFeedback({
        isSuccess: false,
        message: `Target is ${challenge.targetFraction} slice with radius ${challenge.targetRadius}cm. Current area is ${calculatedArea} cm²!`
      });
      playAudio("Adjust the slice fraction and radius to match the target specification!", !audioEnabled);
    }
  };

  const handleReset = () => {
    setCurrentSlice('full');
    setCurrentRadius(challenge.targetRadius);
    setFeedback(null);
  };

  const nextChallenge = () => {
    stopAudio();
    const nextIdx = (challIdx + 1) % CHALLENGES.length;
    setChallIdx(nextIdx);
    setCurrentSlice('full');
    setCurrentRadius(CHALLENGES[nextIdx].targetRadius);
    setFeedback(null);
  };

  return (
    <div className="station-wrap">
      {/* Header */}
      <div className="station-header">
        <h3 className="station-title">🍕 Station B: Semicircle &amp; Sector Slicer</h3>
        <div className={`station-target-box ${shake ? 'anim-shake' : ''}`}>
          <span className="station-target-label">Target Area:</span>
          <span className="station-target-num">{challenge.targetArea}</span>
        </div>
      </div>

      <div className="station-grid-2col">
        {/* Left Column: Interactive Slicer Canvas */}
        <div className="station-col-left">
          <div className="flex items-center justify-between text-xs px-2 py-1 bg-white/5 border border-white/10 rounded-xl">
            <span>Radius: <strong className="text-[#38bdf8]">r = {currentRadius} cm</strong></span>
            <span>Use: <strong className="text-[#f59e0b]">π = {challenge.piLabel}</strong></span>
          </div>

          {/* SVG Slicer Visualizer */}
          <div className="flex-1 w-full bg-[#120a2e]/90 rounded-2xl border border-white/15 p-2 flex items-center justify-center min-h-[140px] max-h-[190px] relative">
            <svg viewBox="0 0 200 200" className="w-full h-full max-h-[170px]">
              {/* Outer guide ring */}
              <circle cx="100" cy="100" r="70" fill="none" stroke="#ffffff" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.25" />

              {/* Wedge Path */}
              {currentSlice === 'full' && (
                <circle cx="100" cy="100" r="70" fill="#38bdf8" fillOpacity="0.38" stroke="#38bdf8" strokeWidth="3" />
              )}
              {currentSlice === 'half' && (
                <path d="M 100 100 L 170 100 A 70 70 0 0 1 30 100 Z" fill="#38bdf8" fillOpacity="0.38" stroke="#38bdf8" strokeWidth="3" />
              )}
              {currentSlice === 'quarter' && (
                <path d="M 100 100 L 170 100 A 70 70 0 0 1 100 170 Z" fill="#38bdf8" fillOpacity="0.38" stroke="#38bdf8" strokeWidth="3" />
              )}
              {currentSlice === 'three-quarter' && (
                <path d="M 100 100 L 170 100 A 70 70 0 1 1 100 30 Z" fill="#38bdf8" fillOpacity="0.38" stroke="#38bdf8" strokeWidth="3" />
              )}

              {/* Center & Radius Line */}
              <line x1="100" y1="100" x2="170" y2="100" stroke="#ffd54f" strokeWidth="2.5" />
              <text x="135" y="93" fill="#ffd54f" fontSize="10" fontWeight="bold" textAnchor="middle">r={currentRadius}</text>
              <circle cx="100" cy="100" r="4" fill="#ffffff" />
            </svg>
          </div>

          {/* Live Area Formula Bar */}
          <div className="bg-[#1a0f38] border border-white/10 rounded-xl p-2 flex items-center justify-between text-xs">
            <span className="text-white/60">Formula Readout:</span>
            <span className="font-mono text-[#38bdf8] font-bold">
              ({sliceMeta.fraction}) × π × {currentRadius}² = <strong>{calculatedArea} cm²</strong>
            </span>
          </div>
        </div>

        {/* Right Column: Slicer Controls & Challenge */}
        <div className="station-col-right">
          <div className="bg-white/5 border border-white/10 rounded-xl p-2.5">
            <span className="text-[11px] font-bold text-[#ffd54f] uppercase tracking-wider block mb-1">
              🎯 Slicer Mission:
            </span>
            <p className="text-xs text-white/90 leading-snug">{challenge.prompt}</p>
          </div>

          {/* Slicer Fraction Selector */}
          <div>
            <span className="text-[11px] font-bold text-white/60 uppercase block mb-1">
              1. Choose Fraction Cut:
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {SLICES.map(s => (
                <button
                  key={s.key}
                  onClick={() => setCurrentSlice(s.key)}
                  className={`p-2 rounded-xl text-xs font-bold transition-all border ${
                    currentSlice === s.key
                      ? 'bg-[#38bdf8] text-[#0f172a] border-[#38bdf8] shadow-[0_0_10px_#38bdf8]'
                      : 'bg-white/5 text-white/80 border-white/10 hover:bg-white/10'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Radius Selector */}
          <div>
            <span className="text-[11px] font-bold text-white/60 uppercase block mb-1">
              2. Set Radius:
            </span>
            <div className="flex gap-2">
              {[7, 10, 14].map(r => (
                <button
                  key={r}
                  onClick={() => setCurrentRadius(r)}
                  className={`flex-1 p-1.5 rounded-xl text-xs font-bold border transition-all ${
                    currentRadius === r
                      ? 'bg-[#f59e0b] text-[#0f172a] border-[#f59e0b] shadow-[0_0_8px_#f59e0b]'
                      : 'bg-white/5 text-white/80 border-white/10 hover:bg-white/10'
                  }`}
                >
                  r = {r} cm
                </button>
              ))}
            </div>
          </div>

          {/* Inline Feedback */}
          {feedback && (
            <div className={`p-2 rounded-xl text-xs font-bold border transition-all ${
              feedback.isSuccess
                ? 'bg-[#22c55e]/25 border-[#22c55e] text-[#86efac]'
                : 'bg-[#ef4444]/25 border-[#ef4444] text-[#fca5a5]'
            }`}>
              {feedback.message}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2 pt-1">
            <button onClick={handleReset} className="btn btn-outline btn-sm flex-1">
              Reset
            </button>
            <button onClick={handleCheck} className="btn btn-primary btn-sm flex-1">
              Execute Cut ✓
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
export { CircleSlicerStation };
