// src/components/simulations/ShadedRegionStation.jsx
import React, { useState } from 'react';
import './Stations.css';
import { playAudio, stopAudio } from '../../utils/audio.js';
import { Scissors, RotateCcw, CheckCircle2, AlertCircle } from 'lucide-react';

const CHALLENGES = [
  {
    id: 1,
    title: "Square Lawn with Circular Fountain",
    scenario: "A grassy park is a 14m × 14m square. In the center, a circular water fountain of radius r = 7m is installed. What is the area of the remaining grass (shaded region)? (Use π = 22/7)",
    outerName: "Square Lawn (14m × 14m)",
    outerFormula: "14 × 14 = 196 m²",
    outerArea: 196,
    innerName: "Fountain Hole (r = 7m)",
    innerFormula: "(22/7) × 7² = 154 m²",
    innerArea: 154,
    shadedFormula: "196 − 154 = 42 m²",
    targetArea: "42 m²",
    targetAreaNumeric: 42,
    unit: "m²",
    options: ["42 m²", "56 m²", "196 m²", "154 m²"],
    correctIdx: 0,
    explanation: "Area of Square Lawn = 14 × 14 = 196 m². Area of Fountain = (22/7) × 7² = 154 m². Shaded Grass Area = 196 − 154 = 42 m²!"
  },
  {
    id: 2,
    title: "Circular Clock Face with LCD Screen",
    scenario: "A circular clock has radius r = 10cm. A square LCD screen (8cm × 8cm) is cut out in the center. What is the shaded decorative area? (Use π = 3.14)",
    outerName: "Circular Clock (r = 10cm)",
    outerFormula: "3.14 × 10² = 314 cm²",
    outerArea: 314,
    innerName: "Square LCD (8cm × 8cm)",
    innerFormula: "8 × 8 = 64 cm²",
    innerArea: 64,
    shadedFormula: "314 − 64 = 250 cm²",
    targetArea: "250 cm²",
    targetAreaNumeric: 250,
    unit: "cm²",
    options: ["250 cm²", "314 cm²", "214 cm²", "150 cm²"],
    correctIdx: 0,
    explanation: "Clock Face Area = 3.14 × 100 = 314 cm². Square Screen = 8 × 8 = 64 cm². Shaded Decorative Face = 314 − 64 = 250 cm²!"
  },
  {
    id: 3,
    title: "Concentric Washer (Donut Ring)",
    scenario: "A circular metal washer has an outer radius R = 10cm and an inner hole radius r = 6cm. What is the area of the metal ring? (Use π = 3.14)",
    outerName: "Outer Circle (R = 10cm)",
    outerFormula: "3.14 × 10² = 314 cm²",
    outerArea: 314,
    innerName: "Inner Hole (r = 6cm)",
    innerFormula: "3.14 × 6² = 113.04 cm²",
    innerArea: 113.04,
    shadedFormula: "314 − 113.04 = 200.96 cm²",
    targetArea: "200.96 cm²",
    targetAreaNumeric: 200.96,
    unit: "cm²",
    options: ["200.96 cm²", "250.00 cm²", "180.50 cm²", "314.00 cm²"],
    correctIdx: 0,
    explanation: "Outer Circle Area = 314 cm². Inner Hole Area = 113.04 cm². Remaining Shaded Ring Area = 314 − 113.04 = 200.96 cm²!"
  }
];

export default function ShadedRegionStation({ onComplete, onStationComplete, audioEnabled }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isCutoutRemoved, setIsCutoutRemoved] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [shake, setShake] = useState(false);

  const current = CHALLENGES[activeIdx];
  const handleNotifyComplete = onStationComplete || onComplete;

  const handleSelectOption = (idx) => {
    setSelectedOption(idx);
    const isCorrect = idx === current.correctIdx;
    if (isCorrect) {
      setFeedback({
        isSuccess: true,
        message: `Terrific deduction! ${current.explanation}`
      });
      playAudio(`Spot on! Shaded Area = ${current.targetArea}. ${current.explanation}`, !audioEnabled);
      if (handleNotifyComplete) {
        handleNotifyComplete(true);
      }
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      setFeedback({
        isSuccess: false,
        message: "Remember the Subtraction Rule: Shaded Area = Outer Total Area − Inner Cutout Area!"
      });
      playAudio("Remember: Subtract the inner cutout hole from the total outer area!", !audioEnabled);
    }
  };

  const handleNextChallenge = () => {
    stopAudio();
    setFeedback(null);
    setSelectedOption(null);
    setIsCutoutRemoved(false);
    setActiveIdx((prev) => (prev + 1) % CHALLENGES.length);
  };

  const handleReset = () => {
    setFeedback(null);
    setSelectedOption(null);
    setIsCutoutRemoved(false);
  };

  return (
    <div className="station-wrap">
      {/* Header */}
      <div className="station-header">
        <h3 className="station-title">✂️ Station D: Shaded Region Subtraction</h3>
        <div className={`station-target-box ${shake ? 'anim-shake' : ''}`}>
          <span className="station-target-label">Target Area:</span>
          <span className="station-target-num">{current.targetArea}</span>
        </div>
      </div>

      {/* Main 2-Column Grid */}
      <div className="station-grid-2col">
        {/* Left Column: Interactive Cutout Canvas */}
        <div className="station-col-left">
          <div className="p-2 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between text-xs">
            <span className="text-white/80 font-bold truncate max-w-[200px] sm:max-w-none">{current.title}</span>
            <button
              onClick={() => setIsCutoutRemoved(!isCutoutRemoved)}
              className="flex items-center gap-1.5 px-3 py-1 bg-[#ec4899]/20 hover:bg-[#ec4899]/35 border border-[#ec4899]/50 text-[#f472b6] font-bold rounded-lg transition-all text-xs shrink-0"
            >
              <Scissors className="w-3.5 h-3.5" />
              <span>{isCutoutRemoved ? "Replace Cutout" : "Punch Out Hole"}</span>
            </button>
          </div>

          {/* SVG Canvas */}
          <div className="flex-1 w-full bg-[#120a2e]/90 rounded-2xl border border-white/15 p-2 flex items-center justify-center min-h-[140px] max-h-[190px] relative overflow-hidden">
            {activeIdx === 0 && (
              <svg viewBox="0 0 200 200" className="w-full h-full max-h-[170px]">
                {/* Outer Square (Green Lawn) */}
                <rect x="25" y="25" width="150" height="150" fill="#22c55e" fillOpacity="0.4" stroke="#22c55e" strokeWidth="3" />
                <text x="100" y="45" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">Square Lawn (14m × 14m)</text>

                {/* Inner Circle (Water Fountain) */}
                <g transform={isCutoutRemoved ? "translate(0, -90) scale(0.65)" : "translate(0, 0)"} className="transition-transform duration-500 origin-center">
                  <circle
                    cx="100"
                    cy="100"
                    r="50"
                    fill={isCutoutRemoved ? "#38bdf8" : "#0f172a"}
                    fillOpacity={isCutoutRemoved ? 0.75 : 0.9}
                    stroke="#38bdf8"
                    strokeWidth="3"
                    strokeDasharray={isCutoutRemoved ? "4 3" : "none"}
                  />
                  <text x="100" y="103" fill="#38bdf8" fontSize="10" fontWeight="bold" textAnchor="middle">
                    {isCutoutRemoved ? "Cutout Hole (r=7m)" : "Fountain Hole (r=7m)"}
                  </text>
                  <line x1="100" y1="100" x2="150" y2="100" stroke="#ffffff" strokeWidth="2" />
                  <text x="125" y="93" fill="#ffffff" fontSize="9" textAnchor="middle">r=7</text>
                </g>
              </svg>
            )}

            {activeIdx === 1 && (
              <svg viewBox="0 0 200 200" className="w-full h-full max-h-[170px]">
                {/* Outer Circle */}
                <circle cx="100" cy="100" r="75" fill="#a855f7" fillOpacity="0.4" stroke="#a855f7" strokeWidth="3" />
                <text x="100" y="48" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">Clock Face (r = 10cm)</text>

                {/* Inner Square */}
                <g transform={isCutoutRemoved ? "translate(0, -90) scale(0.65)" : "translate(0, 0)"} className="transition-transform duration-500 origin-center">
                  <rect
                    x="65"
                    y="65"
                    width="70"
                    height="70"
                    fill={isCutoutRemoved ? "#ec4899" : "#0f172a"}
                    fillOpacity={isCutoutRemoved ? 0.75 : 0.9}
                    stroke="#ec4899"
                    strokeWidth="3"
                    strokeDasharray={isCutoutRemoved ? "4 3" : "none"}
                  />
                  <text x="100" y="104" fill="#ec4899" fontSize="10" fontWeight="bold" textAnchor="middle">
                    {isCutoutRemoved ? "Cutout (8×8)" : "LCD Screen (8×8)"}
                  </text>
                </g>
              </svg>
            )}

            {activeIdx === 2 && (
              <svg viewBox="0 0 200 200" className="w-full h-full max-h-[170px]">
                {/* Outer Circle */}
                <circle cx="100" cy="100" r="75" fill="#f59e0b" fillOpacity="0.4" stroke="#f59e0b" strokeWidth="3" />
                <text x="100" y="45" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">Outer R = 10cm</text>

                {/* Inner Circle Hole */}
                <g transform={isCutoutRemoved ? "translate(0, -90) scale(0.65)" : "translate(0, 0)"} className="transition-transform duration-500 origin-center">
                  <circle
                    cx="100"
                    cy="100"
                    r="45"
                    fill={isCutoutRemoved ? "#38bdf8" : "#0f172a"}
                    fillOpacity={isCutoutRemoved ? 0.75 : 0.9}
                    stroke="#38bdf8"
                    strokeWidth="3"
                    strokeDasharray={isCutoutRemoved ? "4 3" : "none"}
                  />
                  <text x="100" y="104" fill="#38bdf8" fontSize="10" fontWeight="bold" textAnchor="middle">
                    {isCutoutRemoved ? "Cutout (r=6)" : "Inner Hole (r=6)"}
                  </text>
                </g>
              </svg>
            )}
          </div>

          <div className="bg-[#ec4899]/15 border border-[#ec4899]/30 text-white/90 text-xs px-3 py-1.5 rounded-lg text-center w-full">
            💡 Subtraction Rule: <strong>Area(Shaded) = Area(Outer Total) − Area(Inner Cutout)</strong>
          </div>
        </div>

        {/* Right Column: Formula Breakdown & Challenge Options */}
        <div className="station-col-right">
          <div>
            <span className="text-[11px] font-bold text-white/60 uppercase tracking-wider block mb-1">
              📐 Step-by-Step Breakdown:
            </span>
            <div className="space-y-1.5 mt-1">
              <div className="p-2 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between border-l-4 border-l-[#22c55e]">
                <div>
                  <span className="font-bold text-white text-xs block">{current.outerName}</span>
                  <span className="text-xs text-white/60">{current.outerFormula}</span>
                </div>
                <span className="font-bold text-sm text-[#4ade80] font-display">
                  {current.outerArea} {current.unit}
                </span>
              </div>

              <div className="p-2 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between border-l-4 border-l-[#ef4444]">
                <div>
                  <span className="font-bold text-white text-xs block">− {current.innerName}</span>
                  <span className="text-xs text-white/60">{current.innerFormula}</span>
                </div>
                <span className="font-bold text-sm text-[#f87171] font-display">
                  − {current.innerArea} {current.unit}
                </span>
              </div>
            </div>

            {/* Question Box */}
            <div className="mt-2 p-2.5 bg-[#1a0f38] rounded-xl border border-[#ec4899]/30">
              <span className="text-xs text-[#f472b6] font-bold block mb-1.5">
                Challenge: Select the remaining SHADED area:
              </span>
              <div className="grid grid-cols-2 gap-2">
                {current.options.map((opt, oIdx) => {
                  const isSelected = selectedOption === oIdx;
                  const isCorrect = oIdx === current.correctIdx;
                  let btnClass = "bg-white/5 hover:bg-white/10 border-white/15 text-white";
                  if (selectedOption !== null) {
                    if (isCorrect) btnClass = "bg-[#22c55e]/30 border-[#22c55e] text-[#4ade80]";
                    else if (isSelected) btnClass = "bg-[#ef4444]/30 border-[#ef4444] text-[#fca5a5]";
                  }
                  return (
                    <button
                      key={oIdx}
                      onClick={() => handleSelectOption(oIdx)}
                      disabled={selectedOption !== null && isCorrect}
                      className={`p-2 rounded-lg font-bold text-xs sm:text-sm border transition-all cursor-pointer ${btnClass}`}
                    >
                      {opt}
                    </button>
                  );
                })}
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

          {/* Action Row */}
          <div className="flex items-center gap-2 pt-1">
            <button onClick={handleReset} className="btn btn-outline btn-sm flex-1">
              <RotateCcw className="w-3.5 h-3.5 mr-1" />
              Reset
            </button>
            {feedback?.isSuccess && (
              <button onClick={handleNextChallenge} className="btn btn-green btn-sm flex-1">
                Next Challenge →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export { ShadedRegionStation };
