import React from 'react';

export function Card({ children, className = '', active = false, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`rounded-2xl p-5 backdrop-blur-sm transition-all duration-300 ${
        active ? 'bg-card-active' : 'bg-card-gradient hover:border-brand-purple/60'
      } ${className}`}
    >
      {children}
    </div>
  );
}
