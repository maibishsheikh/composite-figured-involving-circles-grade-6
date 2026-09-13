import React from 'react';

export function CircleSVG({ radius = 10, showRadius = true, showDiameter = false, className = "w-48 h-48" }) {
  return (
    <svg viewBox="0 0 200 200" className={`${className} filter drop-shadow-[0_0_12px_rgba(53,208,245,0.5)]`}>
      {/* Background circle glow */}
      <circle cx="100" cy="100" r="75" fill="rgba(53, 208, 245, 0.12)" stroke="#35d0f5" strokeWidth="4" />
      
      {/* Center point */}
      <circle cx="100" cy="100" r="4" fill="#ffb238" />

      {/* Radius line */}
      {showRadius && (
        <g>
          <line x1="100" y1="100" x2="175" y2="100" stroke="#ffb238" strokeWidth="3" strokeDasharray="4,2" />
          <text x="135" y="90" fill="#ffb238" fontSize="14" fontWeight="bold">r = {radius}</text>
        </g>
      )}

      {/* Diameter line */}
      {showDiameter && (
        <g>
          <line x1="25" y1="100" x2="175" y2="100" stroke="#ff3d81" strokeWidth="3" />
          <text x="100" y="125" fill="#ff3d81" fontSize="14" fontWeight="bold" textAnchor="middle">d = {radius * 2}</text>
        </g>
      )}
    </svg>
  );
}
