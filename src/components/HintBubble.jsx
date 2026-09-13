import React from 'react';
export function HintBubble({ hint }) {
  if (!hint) return null;
  return (
    <div className="hint-bubble p-2 bg-[#ffc700]/15 border border-[#ffc700]/40 rounded-xl text-xs text-[#ffe082]">
      💡 Hint: {hint}
    </div>
  );
}
export default HintBubble;
