// src/components/simulations/PerimeterTracerStation.jsx
import React, { useState } from 'react';
import './Stations.css';
import { playAudio, stopAudio } from '../../utils/audio.js';

const CHALLENGES = [
  {
    id: 1,
    title: "Stadium Track Boundary Lap",
    targetPerimeter: "38.84 m",
    targetPerimeterNumeric: 38.84,
    description: "Trace the outside running path: Top (10m) + Bottom (10m) + Left Arc (π×3 = 9.42m) + Right Arc (π×3 = 9.42m). Do NOT count the internal seam lines!",
    edges: [
      { id: 'top', label: "Top Straight", length: 10, isExternal: true },
      { id: 'bottom', label: "Bottom Straight", length: 10, isExternal: true },
      { id: 'leftArc', label: "Left Semicircle Arc", length: 9.42, isExternal: true },
      { id: 'rightArc', label: "Right Semicircle Arc", length: 9.42, isExternal: true },
      { id: 'innerLeft', label: "Internal Left Seam", length: 6, isExternal: false },
      { id: 'innerRight', label: "Internal Right Seam", length: 6, isExternal: false }
    ]
  },
  {
    id: 2,
    title: "Norman Window Frame",
    targetPerimeter: "36.56 m",
    targetPerimeterNumeric: 36.56,
    description: "Trace the outer wooden frame: Left (8m) + Right (8m) + Bottom (8m) + Semicircle Arch (½π×8 = 12.56m). Avoid the middle dividing glass bar!",
    edges: [
      { id: 'left', label: "Left Side (8m)", length: 8, isExternal: true },
      { id: 'right', label: "Right Side (8m)", length: 8, isExternal: true },
      { id: 'bottom', label: "Bottom Side (8m)", length: 8, isExternal: true },
      { id: 'arch', label: "Arch Arc (12.56m)", length: 12.56, isExternal: true },
      { id: 'middleBar', label: "Middle Divider Seam (8m)", length: 8, isExternal: false }
    ]
  }
];

export default function PerimeterTracerStation({ onComplete, onStationComplete, audioEnabled }) {
  const [challIdx, setChallIdx] = useState(0);
  const [selectedEdges, setSelectedEdges] = useState(new Set());
  const [trapWarning, setTrapWarning] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [shake, setShake] = useState(false);

  const challenge = CHALLENGES[challIdx];
  const handleNotifyComplete = onStationComplete || onComplete;

  const currentSum = challenge.edges
    .filter(e => selectedEdges.has(e.id))
    .reduce((sum, e) => sum + e.length, 0);

  const handleToggleEdge = (edge) => {
    setFeedback(null);
    if (!edge.isExternal) {
      setTrapWarning(`⚠️ Internal Seam Trap! "${edge.label}" is inside the shape! Perimeter only measures the outer boundary walk. Internal lines must NEVER be included!`);
      playAudio("Warning! That's an internal seam. Perimeter only measures the outside boundary!", !audioEnabled);
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    setTrapWarning(null);
    const next = new Set(selectedEdges);
    if (next.has(edge.id)) {
      next.delete(edge.id);
    } else {
      next.add(edge.id);
    }
    setSelectedEdges(next);
  };

  const handleCheck = () => {
    const externalEdges = challenge.edges.filter(e => e.isExternal);
    const allExternalSelected = externalEdges.every(e => selectedEdges.has(e.id));
    const noInternalSelected = challenge.edges.filter(e => !e.isExternal).every(e => !selectedEdges.has(e.id));

    if (allExternalSelected && noInternalSelected && selectedEdges.size === externalEdges.length) {
      setFeedback({
        isSuccess: true,
        message: `Perfect! Outer Perimeter = ${challenge.targetPerimeter}. You correctly excluded all internal seams!`
      });
      playAudio(`Awesome job! You walked the exact outer perimeter: ${challenge.targetPerimeter}!`, !audioEnabled);
      if (handleNotifyComplete) handleNotifyComplete(true);
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      setFeedback({
        isSuccess: false,
        message: `Current traced length is ${currentSum.toFixed(2)}m. Make sure all ${externalEdges.length} outer edges are traced!`
      });
      playAudio("Make sure every outer edge of the boundary is highlighted!", !audioEnabled);
    }
  };

  const handleReset = () => {
    setSelectedEdges(new Set());
    setTrapWarning(null);
    setFeedback(null);
  };

  const nextChallenge = () => {
    stopAudio();
    const nextIdx = (challIdx + 1) % CHALLENGES.length;
    setChallIdx(nextIdx);
    handleReset();
  };

  return (
    <div className="station-wrap">
      {/* Header */}
      <div className="station-header">
        <h3 className="station-title">📏 Station C: Perimeter &amp; Boundary Path Tracer</h3>
        <div className={`station-target-box ${shake ? 'anim-shake' : ''}`}>
          <span className="station-target-label">Target Perimeter:</span>
          <span className="station-target-num">{challenge.targetPerimeter}</span>
        </div>
      </div>

      <div className="station-grid-2col">
        {/* Left Column: Interactive Track SVG */}
        <div className="station-col-left">
          <div className="p-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white/80 flex items-center justify-between">
            <span>Tap edges on the shape to trace the runner's path:</span>
            <span className="text-[10px] text-[#22c55e] font-bold">Green = Traced</span>
          </div>

          {/* Trap Alert Banner */}
          {trapWarning && (
            <div className="bg-[#ef4444]/25 border border-[#ef4444] text-[#fca5a5] p-2 rounded-xl text-xs flex items-start gap-1.5 animate-bounce">
              <span>{trapWarning}</span>
            </div>
          )}

          {/* SVG Map */}
          <div className="flex-1 w-full bg-[#120a2e]/90 rounded-2xl border border-white/15 p-2 flex items-center justify-center min-h-[140px] max-h-[190px] relative">
            {challIdx === 0 && (
              <svg viewBox="0 0 320 160" className="w-full h-full max-h-[170px]">
                {/* Internal Trap Seams */}
                <line
                  x1="100" y1="30" x2="100" y2="130"
                  stroke="#ef4444" strokeWidth="4" strokeDasharray="5 4"
                  className="cursor-pointer hover:opacity-100 opacity-60"
                  onClick={() => handleToggleEdge(challenge.edges.find(e => e.id === 'innerLeft'))}
                />
                <line
                  x1="220" y1="30" x2="220" y2="130"
                  stroke="#ef4444" strokeWidth="4" strokeDasharray="5 4"
                  className="cursor-pointer hover:opacity-100 opacity-60"
                  onClick={() => handleToggleEdge(challenge.edges.find(e => e.id === 'innerRight'))}
                />

                {/* Top Straight */}
                <line
                  x1="100" y1="30" x2="220" y2="30"
                  stroke={selectedEdges.has('top') ? "#22c55e" : "#ffffff"}
                  strokeWidth={selectedEdges.has('top') ? "6" : "3"}
                  className="cursor-pointer transition-all"
                  onClick={() => handleToggleEdge(challenge.edges.find(e => e.id === 'top'))}
                />
                <text x="160" y="22" fill="#ffffff" fontSize="10" textAnchor="middle">10m</text>

                {/* Bottom Straight */}
                <line
                  x1="100" y1="130" x2="220" y2="130"
                  stroke={selectedEdges.has('bottom') ? "#22c55e" : "#ffffff"}
                  strokeWidth={selectedEdges.has('bottom') ? "6" : "3"}
                  className="cursor-pointer transition-all"
                  onClick={() => handleToggleEdge(challenge.edges.find(e => e.id === 'bottom'))}
                />
                <text x="160" y="146" fill="#ffffff" fontSize="10" textAnchor="middle">10m</text>

                {/* Left Arc */}
                <path
                  d="M 100 30 A 50 50 0 0 0 100 130"
                  fill="none"
                  stroke={selectedEdges.has('leftArc') ? "#22c55e" : "#ffffff"}
                  strokeWidth={selectedEdges.has('leftArc') ? "6" : "3"}
                  className="cursor-pointer transition-all"
                  onClick={() => handleToggleEdge(challenge.edges.find(e => e.id === 'leftArc'))}
                />
                <text x="40" y="85" fill="#22c55e" fontSize="10" textAnchor="middle">9.42m</text>

                {/* Right Arc */}
                <path
                  d="M 220 30 A 50 50 0 0 1 220 130"
                  fill="none"
                  stroke={selectedEdges.has('rightArc') ? "#22c55e" : "#ffffff"}
                  strokeWidth={selectedEdges.has('rightArc') ? "6" : "3"}
                  className="cursor-pointer transition-all"
                  onClick={() => handleToggleEdge(challenge.edges.find(e => e.id === 'rightArc'))}
                />
                <text x="280" y="85" fill="#22c55e" fontSize="10" textAnchor="middle">9.42m</text>
              </svg>
            )}

            {challIdx === 1 && (
              <svg viewBox="0 0 240 200" className="w-full h-full max-h-[170px]">
                {/* Arch Arc */}
                <path
                  d="M 70 80 A 50 50 0 0 1 170 80"
                  fill="none"
                  stroke={selectedEdges.has('arch') ? "#22c55e" : "#ffffff"}
                  strokeWidth={selectedEdges.has('arch') ? "6" : "3"}
                  className="cursor-pointer transition-all"
                  onClick={() => handleToggleEdge(challenge.edges.find(e => e.id === 'arch'))}
                />
                <text x="120" y="55" fill="#22c55e" fontSize="10" textAnchor="middle">12.56m</text>

                {/* Internal Divider */}
                <line
                  x1="70" y1="80" x2="170" y2="80"
                  stroke="#ef4444" strokeWidth="4" strokeDasharray="5 4"
                  className="cursor-pointer hover:opacity-100 opacity-60"
                  onClick={() => handleToggleEdge(challenge.edges.find(e => e.id === 'middleBar'))}
                />

                {/* Square Left */}
                <line
                  x1="70" y1="80" x2="70" y2="180"
                  stroke={selectedEdges.has('left') ? "#22c55e" : "#ffffff"}
                  strokeWidth={selectedEdges.has('left') ? "6" : "3"}
                  className="cursor-pointer transition-all"
                  onClick={() => handleToggleEdge(challenge.edges.find(e => e.id === 'left'))}
                />
                <text x="55" y="135" fill="#ffffff" fontSize="10" textAnchor="middle">8m</text>

                {/* Square Bottom */}
                <line
                  x1="70" y1="180" x2="170" y2="180"
                  stroke={selectedEdges.has('bottom') ? "#22c55e" : "#ffffff"}
                  strokeWidth={selectedEdges.has('bottom') ? "6" : "3"}
                  className="cursor-pointer transition-all"
                  onClick={() => handleToggleEdge(challenge.edges.find(e => e.id === 'bottom'))}
                />
                <text x="120" y="196" fill="#ffffff" fontSize="10" textAnchor="middle">8m</text>

                {/* Square Right */}
                <line
                  x1="170" y1="80" x2="170" y2="180"
                  stroke={selectedEdges.has('right') ? "#22c55e" : "#ffffff"}
                  strokeWidth={selectedEdges.has('right') ? "6" : "3"}
                  className="cursor-pointer transition-all"
                  onClick={() => handleToggleEdge(challenge.edges.find(e => e.id === 'right'))}
                />
                <text x="185" y="135" fill="#ffffff" fontSize="10" textAnchor="middle">8m</text>
              </svg>
            )}
          </div>

          <div className="bg-[#1a0f38] border border-[#22c55e]/30 rounded-xl p-2 flex items-center justify-between text-xs">
            <span className="text-white/60">Traced Sum:</span>
            <span className="font-mono text-[#4ade80] font-bold text-sm">
              {currentSum.toFixed(2)} m
            </span>
          </div>
        </div>

        {/* Right Column: Edge Inventory & Guidance */}
        <div className="station-col-right">
          <div className="bg-white/5 border border-white/10 rounded-xl p-2.5">
            <span className="text-[11px] font-bold text-[#ffd54f] uppercase tracking-wider block mb-1">
              🏃 Drone Lap Instructions:
            </span>
            <p className="text-xs text-white/90 leading-snug">{challenge.description}</p>
          </div>

          {/* Interactive Edge List */}
          <div className="space-y-1.5 max-h-[140px] overflow-y-auto">
            {challenge.edges.map(edge => {
              const isTraced = selectedEdges.has(edge.id);
              return (
                <button
                  key={edge.id}
                  onClick={() => handleToggleEdge(edge)}
                  className={`w-full p-2 rounded-xl text-xs font-bold flex items-center justify-between border transition-all ${
                    !edge.isExternal
                      ? 'bg-[#ef4444]/15 border-[#ef4444]/40 text-[#fca5a5] hover:bg-[#ef4444]/25'
                      : isTraced
                      ? 'bg-[#22c55e]/25 border-[#22c55e] text-[#86efac]'
                      : 'bg-white/5 border-white/10 text-white/75 hover:bg-white/10'
                  }`}
                >
                  <span>{edge.label}</span>
                  <span className="font-mono">{isTraced ? "Traced ✓" : `${edge.length}m`}</span>
                </button>
              );
            })}
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
              Clear Path
            </button>
            <button onClick={handleCheck} className="btn btn-primary btn-sm flex-1">
              Verify Boundary ✓
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
export { PerimeterTracerStation };
