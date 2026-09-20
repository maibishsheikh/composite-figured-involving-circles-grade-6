import React, { useEffect } from 'react';
import './KingdomMap.css';
import { useProgress } from '../../state/ProgressContext.jsx';
import { playAudio, stopAudio } from '../../utils/audio.js';

// SVG Icons tailored to match screenshot
function BicycleIcon({ className = "w-8 h-7 text-[#4ade80]" }) {
  return (
    <svg
      viewBox="0 0 32 22"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Rear Wheel */}
      <circle cx="6.5" cy="15" r="4.5" />
      {/* Front Wheel */}
      <circle cx="25.5" cy="15" r="4.5" />
      {/* Bottom Bracket / Crank */}
      <circle cx="14" cy="15" r="1.2" />
      {/* Rear triangle */}
      <path d="M6.5 15 L11.5 7 L14 15 L6.5 15 Z" />
      {/* Top tube & Down tube */}
      <path d="M11.5 7 L21.5 7 L14 15" />
      {/* Front fork */}
      <path d="M21.5 7 L25.5 15" />
      {/* Stem & Handlebar */}
      <path d="M21.5 7 L21.5 4.5 L24 4.5" />
      {/* Seatpost & Saddle */}
      <path d="M11.5 7 L11.5 5.5" />
      <path d="M9.5 5.5 L13.5 5.5" />
    </svg>
  );
}

function GoldLockIcon({ className = "w-7 h-7" }) {
  return (
    <svg viewBox="0 0 24 24" className={className}>
      <defs>
        <linearGradient id="lockShackleGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ca8a04" />
          <stop offset="50%" stopColor="#fef08a" />
          <stop offset="100%" stopColor="#a16207" />
        </linearGradient>
        <linearGradient id="lockBodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#eab308" />
          <stop offset="100%" stopColor="#854d0e" />
        </linearGradient>
      </defs>
      {/* Shackle */}
      <path
        d="M7 10V7a5 5 0 0 1 10 0v3"
        fill="none"
        stroke="url(#lockShackleGrad)"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      {/* Body */}
      <rect
        x="4"
        y="10"
        width="16"
        height="11.5"
        rx="2.5"
        fill="url(#lockBodyGrad)"
        stroke="#713f12"
        strokeWidth="0.5"
      />
      {/* Keyhole */}
      <circle cx="12" cy="14.5" r="1.3" fill="#422006" />
      <path d="M11.2 15 L12.8 15 L12.5 18 L11.5 18 Z" fill="#422006" />
    </svg>
  );
}

function PizzaIcon({ className = "w-7 h-7 text-amber-400" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M15 11h.01" /><path d="M11 15h.01" /><path d="M16 16h.01" /><path d="M2 16l20 6-6-20A20 20 0 0 0 2 16Z" />
    </svg>
  );
}

function ClockIcon({ className = "w-7 h-7 text-indigo-400" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function FerrisWheelIcon({ className = "w-7 h-7 text-pink-400" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="11" r="8" />
      <circle cx="12" cy="11" r="2" />
      <path d="M12 3v16" />
      <path d="M4 11h16" />
      <path d="M6.3 5.3l11.4 11.4" />
      <path d="M17.7 5.3L6.3 16.7" />
      <path d="M8 21l4-2 4 2" />
    </svg>
  );
}

function TrackIcon({ className = "w-7 h-7 text-purple-400" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="3" y="6" width="18" height="12" rx="6" />
      <line x1="9" y1="6" x2="9" y2="18" />
      <line x1="15" y1="6" x2="15" y2="18" />
    </svg>
  );
}

function CoinIcon({ className = "w-7 h-7 text-yellow-400" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="8" cy="8" r="6" />
      <path d="M18.09 10.37A6 6 0 1 1 10.34 18" />
      <path d="M7 6h2v4H7z" />
    </svg>
  );
}

function ReefIcon({ className = "w-7 h-7 text-teal-400" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 2v10" />
      <circle cx="12" cy="12" r="3" />
      <path d="M5 12a7 7 0 0 0 14 0" />
      <path d="M12 15v7" />
      <path d="M9 22h6" />
    </svg>
  );
}

function FlowerIcon({ className = "w-7 h-7 text-rose-400" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 16.5A4.5 4.5 0 1 1 7.5 12 4.5 4.5 0 1 1 12 7.5a4.5 4.5 0 1 1 4.5 4.5 4.5 4.5 0 1 1-4.5 4.5" />
    </svg>
  );
}

function SatelliteIcon({ className = "w-7 h-7 text-cyan-400" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="4" />
      <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(-30 12 12)" />
    </svg>
  );
}

function MedalIcon({ className = "w-7 h-7 text-amber-400" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="8" r="6" />
      <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
    </svg>
  );
}

const WORLDS_CONFIG = [
  { id: 1, name: "Bicycle Wheels", displayName: "Bicycle Wheel...", iconType: "bike", qRange: "Q1–10" },
  { id: 2, name: "Pizza Planet", displayName: "Pizza Planet", iconType: "pizza", qRange: "Q11–20" },
  { id: 3, name: "Clockwork Tower", displayName: "Clockwork Tower", iconType: "clock", qRange: "Q21–30" },
  { id: 4, name: "Ferris Wheel", displayName: "Ferris Wheel...", iconType: "ferris", qRange: "Q31–40" },
  { id: 5, name: "Track & Field", displayName: "Track & Field...", iconType: "track", qRange: "Q41–50" },
  { id: 6, name: "Coin Vault", displayName: "Coin Vault", iconType: "coins", qRange: "Q51–60" },
  { id: 7, name: "Sunken Plate Reef", displayName: "Sunken Plate Reef", iconType: "reef", qRange: "Q61–70" },
  { id: 8, name: "Flower Bed Garden", displayName: "Flower Bed Garden", iconType: "garden", qRange: "Q71–80" },
  { id: 9, name: "Orbiting Satellites", displayName: "Orbiting Satellites", iconType: "satellite", qRange: "Q81–90" },
  { id: 10, name: "Golden Medals", displayName: "Golden Medal...", iconType: "medal", qRange: "Q91–100" }
];

function renderActiveWorldIcon(type) {
  switch (type) {
    case 'bike':
      return <BicycleIcon className="w-8 h-7 text-[#4ade80]" />;
    case 'pizza':
      return <PizzaIcon className="w-7 h-7 text-amber-400" />;
    case 'clock':
      return <ClockIcon className="w-7 h-7 text-indigo-400" />;
    case 'ferris':
      return <FerrisWheelIcon className="w-7 h-7 text-pink-400" />;
    case 'track':
      return <TrackIcon className="w-7 h-7 text-purple-400" />;
    case 'coins':
      return <CoinIcon className="w-7 h-7 text-yellow-400" />;
    case 'reef':
      return <ReefIcon className="w-7 h-7 text-teal-400" />;
    case 'garden':
      return <FlowerIcon className="w-7 h-7 text-rose-400" />;
    case 'satellite':
      return <SatelliteIcon className="w-7 h-7 text-cyan-400" />;
    case 'medal':
      return <MedalIcon className="w-7 h-7 text-amber-400" />;
    default:
      return <BicycleIcon className="w-8 h-7 text-[#4ade80]" />;
  }
}

export default function KingdomMap({ onSelectWorld }) {
  const { worlds, isMuted } = useProgress();

  useEffect(() => {
    playAudio("Practice — Choose Your World! Answer questions in each world. Earn stars and XP!", isMuted);
    return () => stopAudio();
  }, [isMuted]);

  const totalStars = Object.values(worlds || {}).reduce((sum, w) => sum + (w?.stars || 0), 0);

  return (
    <div className="practice-worlds-wrapper">
      <div className="practice-worlds-panel">
        {/* Glowing Top Center Pill Handle */}
        <div className="practice-top-pill" />

        {/* Header Row: Title & Subtitle + Star Badge */}
        <div className="practice-header-row">
          <div>
            <h2 className="practice-header-title">
              Circumference Game Worlds
            </h2>
            <p className="practice-header-subtitle">
              10 Themed Worlds · Need 4/10 Correct to Unlock Next World
            </p>
          </div>

          <div className="practice-star-badge">
            <span className="text-yellow-400 leading-none">★</span>
            <span>{totalStars} / 30</span>
          </div>
        </div>

        {/* 10 Worlds Grid (2 rows x 5 columns) */}
        <div className="practice-grid">
          {WORLDS_CONFIG.map((world) => {
            const worldState = worlds?.[world.id] || { unlocked: world.id === 1, stars: 0 };
            const isUnlocked = !!worldState.unlocked;

            return (
              <div
                key={world.id}
                onClick={() => isUnlocked && onSelectWorld && onSelectWorld(world.id)}
                className={`practice-card ${isUnlocked ? 'unlocked' : 'locked'}`}
              >
                {/* Card Top Row: W Badge & Q-Range */}
                <div className="practice-card-top">
                  <span className="practice-card-tag">W{world.id}</span>
                  <span className="practice-card-qrange">{world.qRange}</span>
                </div>

                {/* Card Center: Icon & Title */}
                <div className="practice-card-center">
                  <div className="practice-card-icon-slot">
                    {isUnlocked ? renderActiveWorldIcon(world.iconType) : <GoldLockIcon className="w-7 h-7" />}
                  </div>

                  <span className="practice-card-title" title={world.name}>
                    {world.displayName}
                  </span>
                </div>

                {/* Card Bottom: Action */}
                <div className="practice-card-bottom">
                  {isUnlocked ? (
                    <span className="practice-card-action-play">
                      Play →
                    </span>
                  ) : (
                    <span className="practice-card-action-locked">
                      Locked
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export { KingdomMap };
