import React from 'react';

export function CompositeFigureSVG({ type = 'composite-track', length = 20, width = 10, radius = 5, className = "w-56 h-44" }) {
  if (type === 'composite-add') {
    return (
      <svg viewBox="0 0 240 180" className={`${className} filter drop-shadow-[0_0_12px_rgba(53,208,245,0.4)]`}>
        {/* Central Rectangle */}
        <rect x="40" y="40" width="100" height="100" fill="rgba(53, 208, 245, 0.15)" stroke="#35d0f5" strokeWidth="3" />
        {/* Semicircle on right */}
        <path d="M 140 40 A 50 50 0 0 1 140 140 Z" fill="rgba(255, 178, 56, 0.2)" stroke="#ffb238" strokeWidth="3" />
        {/* Labels */}
        <text x="90" y="30" fill="#35d0f5" fontSize="12" fontWeight="bold" textAnchor="middle">L = {length}m</text>
        <text x="30" y="90" fill="#35d0f5" fontSize="12" fontWeight="bold" textAnchor="end">W = {width}m</text>
        <text x="175" y="90" fill="#ffb238" fontSize="12" fontWeight="bold">r = {radius}m</text>
      </svg>
    );
  }

  if (type === 'composite-subtract') {
    return (
      <svg viewBox="0 0 220 220" className={`${className} filter drop-shadow-[0_0_12px_rgba(255,61,129,0.4)]`}>
        {/* Base Square */}
        <rect x="30" y="30" width="160" height="160" fill="rgba(124, 77, 255, 0.2)" stroke="#7c4dff" strokeWidth="4" />
        {/* Cutout Circle in Center */}
        <circle cx="110" cy="110" r="50" fill="#150c2b" stroke="#ff3d81" strokeWidth="3" strokeDasharray="4,3" />
        {/* Labels */}
        <text x="110" y="20" fill="#7c4dff" fontSize="13" fontWeight="bold" textAnchor="middle">{length} cm</text>
        <text x="110" y="115" fill="#ff3d81" fontSize="13" fontWeight="bold" textAnchor="middle">r = {radius} cm</text>
      </svg>
    );
  }

  // Default: Composite Stadium Track
  return (
    <svg viewBox="0 0 280 160" className={`${className} filter drop-shadow-[0_0_14px_rgba(53,208,245,0.5)]`}>
      {/* Stadium track outer path */}
      <path
        d="M 80 30 L 200 30 A 50 50 0 0 1 200 130 L 80 130 A 50 50 0 0 1 80 30 Z"
        fill="rgba(53, 208, 245, 0.12)"
        stroke="#35d0f5"
        strokeWidth="4"
      />
      {/* Internal dotted join lines */}
      <line x1="80" y1="30" x2="80" y2="130" stroke="#ef4a5f" strokeWidth="2" strokeDasharray="3,3" />
      <line x1="200" y1="30" x2="200" y2="130" stroke="#ef4a5f" strokeWidth="2" strokeDasharray="3,3" />
      {/* Labels */}
      <text x="140" y="22" fill="#35d0f5" fontSize="13" fontWeight="bold" textAnchor="middle">{length} m</text>
      <text x="235" y="85" fill="#ffb238" fontSize="13" fontWeight="bold">r = {radius} m</text>
    </svg>
  );
}
