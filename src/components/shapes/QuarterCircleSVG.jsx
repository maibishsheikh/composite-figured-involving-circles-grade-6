import React from 'react';

export function QuarterCircleSVG({ radius = 10, className = "w-48 h-48" }) {
  return (
    <svg viewBox="0 0 200 200" className={`${className} filter drop-shadow-[0_0_12px_rgba(255,61,129,0.5)]`}>
      {/* Quarter circle path */}
      <path
        d="M 40 160 L 40 40 A 120 120 0 0 1 160 160 Z"
        fill="rgba(255, 61, 129, 0.2)"
        stroke="#ff3d81"
        strokeWidth="4"
      />
      {/* Radius labels */}
      <text x="30" y="100" fill="#ff3d81" fontSize="14" fontWeight="bold" textAnchor="end">r={radius}</text>
      <text x="100" y="180" fill="#ff3d81" fontSize="14" fontWeight="bold" textAnchor="middle">r={radius}</text>
    </svg>
  );
}
