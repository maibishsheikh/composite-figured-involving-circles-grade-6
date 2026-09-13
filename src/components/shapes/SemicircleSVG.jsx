import React from 'react';

export function SemicircleSVG({ radius = 10, className = "w-48 h-48" }) {
  return (
    <svg viewBox="0 0 200 200" className={`${className} filter drop-shadow-[0_0_12px_rgba(124,77,255,0.5)]`}>
      {/* Semicircle path (arc + diameter base) */}
      <path
        d="M 25 120 A 75 75 0 0 1 175 120 Z"
        fill="rgba(124, 77, 255, 0.2)"
        stroke="#7c4dff"
        strokeWidth="4"
      />
      {/* Center point */}
      <circle cx="100" cy="120" r="4" fill="#ffb238" />
      {/* Radius line */}
      <line x1="100" y1="120" x2="175" y2="120" stroke="#ffb238" strokeWidth="3" strokeDasharray="4,2" />
      <text x="135" y="142" fill="#ffb238" fontSize="14" fontWeight="bold">r = {radius}</text>
    </svg>
  );
}
