import React from 'react';

const GLYPHS = ['⭕', '◐', '◔', 'π', 'r', 'd', 'C', 'A', '3.14', '22/7', 'r²', '2πr'];

export function BackgroundGlyphs() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 opacity-15">
      {GLYPHS.map((glyph, index) => {
        const top = (index * 17 + 8) % 90;
        const left = (index * 23 + 12) % 90;
        const size = index % 3 === 0 ? 'text-6xl font-bold' : 'text-4xl font-semibold';
        const delay = (index * 0.7) % 4;

        return (
          <span
            key={index}
            className={`absolute select-none text-brand-purple animate-float ${size}`}
            style={{
              top: `${top}%`,
              left: `${left}%`,
              animationDelay: `${delay}s`
            }}
          >
            {glyph}
          </span>
        );
      })}
    </div>
  );
}
