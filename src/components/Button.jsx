import React from 'react';

export function Button({
  children,
  variant = 'gold', // 'gold' | 'cyan' | 'purple' | 'pink' | 'outline'
  size = 'md', // 'sm' | 'md' | 'lg'
  disabled = false,
  onClick,
  className = '',
  ...props
}) {
  const baseStyle = "inline-flex items-center justify-center font-extrabold rounded-full transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none cursor-pointer";

  const variants = {
    gold: "bg-gold-gradient text-brand-bg shadow-glow-gold hover:brightness-110 border-2 border-amber-300",
    cyan: "bg-brand-cyan text-brand-bg shadow-glow-cyan hover:brightness-110 border-2 border-cyan-200",
    purple: "bg-purple-gradient text-white shadow-glow-purple hover:brightness-110 border-2 border-purple-300",
    pink: "bg-pink-gradient text-white shadow-glow-pink hover:brightness-110 border-2 border-pink-300",
    outline: "bg-brand-bg-card/80 text-white border-2 border-brand-purple/50 hover:bg-brand-purple/30 hover:border-brand-cyan"
  };

  const sizes = {
    sm: "px-4 py-1.5 text-sm",
    md: "px-6 py-2.5 text-base sm:text-lg",
    lg: "px-8 py-3.5 text-lg sm:text-xl"
  };

  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
