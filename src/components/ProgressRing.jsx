import React from 'react';
export function ProgressRing({ percent = 0 }) {
  return (
    <div className="progress-ring-badge text-xs font-bold text-[#f59e0b]">
      {Math.round(percent)}%
    </div>
  );
}
export default ProgressRing;
