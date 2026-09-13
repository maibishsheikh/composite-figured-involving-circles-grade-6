// src/components/IntroScreen.jsx
import React, { useEffect } from 'react';
import './IntroScreen.css';
import { useProgress } from '../state/ProgressContext.jsx';
import { stopAudio } from '../utils/audio.js';

const JOURNEY = [
  { num: '01', icon: '✨', label: 'Wonder',   desc: 'Mystery hook', phaseKey: 'wonder' },
  { num: '02', icon: '📖', label: 'Story',    desc: 'Circles in action', phaseKey: 'story' },
  { num: '03', icon: '🧪', label: 'Simulate', desc: '4 Active labs', phaseKey: 'simulate' },
  { num: '04', icon: '🎮', label: 'Practice', desc: '100 challenges', phaseKey: 'practice' },
  { num: '05', icon: '📝', label: 'Reflect',  desc: 'Review & scorecard', phaseKey: 'reflect' },
];

export default function IntroScreen() {
  const { setPhase, resetAllProgress } = useProgress();

  useEffect(() => {
    stopAudio();
  }, []);

  const handleStart = () => {
    resetAllProgress();
    setPhase('wonder');
  };

  const handleSelectPhase = (phaseKey) => {
    stopAudio();
    setPhase(phaseKey);
  };

  return (
    <div className="intro-wrap">
      {/* Top Badge */}
      <div className="intro-top-badge">
        ✨ Curriculum · Grade 6 Math: Composite Figures
      </div>

      {/* Main Title */}
      <h1 className="intro-title">
        <span className="text-orange">Composite Figures</span> <span className="text-white">Involving Circles</span>
      </h1>
      <h2 className="intro-subtitle">CircleCraft · Master Area, Perimeter &amp; Subtraction</h2>

      {/* Mascot Row */}
      <div className="intro-mascot-row">
        <div className="intro-mascot-circle">🧭</div>
        <div className="intro-speech-bubble">
          Hi! I'm Orbit. Ready to build, slice, and measure composite circles? 🧭📐
        </div>
      </div>

      {/* Description */}
      <p className="intro-desc">
        Discover how to decompose composite figures into <span className="text-yellow">circles, semicircles, and polygons</span>, trace outer perimeters, and master shaded region subtractions!
      </p>

      {/* Journey Card */}
      <div className="journey-card">
        <div className="journey-card-title">YOUR LEARNING JOURNEY · CLICK ANY PHASE TO JUMP IN</div>

        <div className="journey-steps-container">
          {JOURNEY.map((j, i) => (
            <React.Fragment key={j.num}>
              <div
                className="journey-step-item clickable-step"
                onClick={() => handleSelectPhase(j.phaseKey)}
                role="button"
                tabIndex={0}
                title={`Click to open ${j.label} phase`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleSelectPhase(j.phaseKey);
                  }
                }}
              >
                <span className="journey-icon-circle">{j.icon}</span>
                <div className="journey-text-col">
                  <span className="journey-item-title">{j.label}</span>
                  <span className="journey-item-desc">{j.desc}</span>
                </div>
              </div>
              {i < JOURNEY.length - 1 && <span className="journey-arrow">→</span>}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="intro-ctas">
        <button className="btn btn-primary btn-lg intro-cta-main" onClick={handleStart}>
          🚀 Begin Your Journey!
        </button>
      </div>

      {/* Bottom Cards */}
      <div className="intro-bottom-cards">
        <div className="bottom-card">
          <div className="bottom-card-icon" style={{ color: '#ff6b6b' }}>🎯</div>
          <div>100 Questions</div>
        </div>
        <div className="bottom-card">
          <div className="bottom-card-icon" style={{ color: '#feca57' }}>⭕</div>
          <div>Circles &amp; Polygons</div>
        </div>
        <div className="bottom-card">
          <div className="bottom-card-icon" style={{ color: '#66bb6a' }}>✨</div>
          <div>Badges &amp; XP</div>
        </div>
      </div>
    </div>
  );
}
