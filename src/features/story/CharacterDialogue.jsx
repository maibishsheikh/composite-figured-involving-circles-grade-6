import React from 'react';
export function CharacterDialogue({ speaker, text, avatar }) {
  return (
    <div className="char-dialogue flex items-center gap-2 p-2 bg-white/10 rounded-xl">
      <span className="text-xl">{avatar || '🧭'}</span>
      <div>
        <strong className="text-xs text-[#f59e0b] block">{speaker}</strong>
        <p className="text-xs text-white">{text}</p>
      </div>
    </div>
  );
}
export default CharacterDialogue;
