// src/components/phases/ReflectPhase.jsx
import React, { useState, useEffect, useRef } from 'react';
import './ReflectPhase.css';
import { useProgress } from '../../state/ProgressContext.jsx';
import { playAudio, stopAudio } from '../../utils/audio.js';
import { BADGES } from '../../utils/badgeEngine.js';

const REFLECT_QUESTIONS = [
  {
    q: "1. When calculating the PERIMETER of a composite figure with circles, what is the golden rule?",
    options: [
      "Only measure the outside boundary edges — never add internal joining seams!",
      "Add every line inside and outside the shapes together.",
      "Multiply the length of the rectangle by the diameter of the circle.",
    ],
    correct: 0,
  },
  {
    q: "2. Two identical semicircles (each with diameter d) are joined on opposite ends of a rectangle. Combined, their areas equal:",
    options: [
      "One full circle: Area = π × r² (where r = d ÷ 2)",
      "Two full circles: Area = 2 × π × r²",
      "Half a circle: Area = ½ × π × r²",
    ],
    correct: 0,
  },
  {
    q: "3. How do you find the SHADED region area when a circular hole is cut out of a square?",
    options: [
      "Area(Shaded) = Area(Square) − Area(Circle)",
      "Area(Shaded) = Area(Square) + Area(Circle)",
      "Area(Shaded) = Perimeter(Square) ÷ Diameter(Circle)",
    ],
    correct: 0,
  },
];

const QUICK_INSERTS = [
  'Perimeter = Outer boundary edges only (no internal seams!)',
  'Two semicircles combine to form one full circle (πr²)',
  'Shaded Area = Base Area − Cutout Hole Area',
  'Radius is always half of the diameter (r = d ÷ 2)',
];

export default function ReflectPhase() {
  const {
    xpTotal,
    bestStreak,
    worlds,
    reflectionText,
    setReflectionText,
    isMuted,
    setPhase,
    resetAllProgress,
    badges
  } = useProgress();

  const [answers, setAnswers] = useState({});
  const [journal, setJournal] = useState(reflectionText || '');
  const [submitted, setSubmitted] = useState(false);
  const narrated = useRef(false);

  const totalCorrect = Object.values(worlds || {}).reduce((acc, w) => acc + (w.bestAccuracy ? Math.round(w.bestAccuracy / 10) : (w.stars > 0 ? 8 : 0)), 0);
  const totalStars = Object.values(worlds || {}).reduce((acc, w) => acc + (w.stars || 0), 0);

  const earnedBadges = (BADGES || []).filter(b => (badges || []).includes(b.id));

  useEffect(() => {
    if (!narrated.current) {
      narrated.current = true;
      playAudio("Welcome to the reflect phase! Review key circle composite concepts and check your trophy scorecard.", isMuted);
    }
    return () => stopAudio();
  }, [isMuted]);

  const handleSelectOption = (qIdx, optIdx) => {
    setAnswers(prev => ({ ...prev, [qIdx]: optIdx }));
  };

  const handleSubmit = () => {
    setSubmitted(true);
    stopAudio();
    playAudio("Outstanding! You have mastered composite figures involving circles!", isMuted);
    if (setReflectionText) {
      setReflectionText(journal);
    }
  };

  const handlePlayAgain = () => {
    stopAudio();
    resetAllProgress();
    setPhase('landing');
  };

  const handleGoHome = () => {
    stopAudio();
    setPhase('landing');
  };

  if (submitted) {
    return (
      <div className="reflect-wrap">
        <div className="trophy-card glass-card anim-bounce-in">
          <div className="trophy-icon">🏆</div>
          <h1 className="trophy-title headline">You're a CircleCraft Grand Master!</h1>
          <p className="trophy-sub subheadline" style={{ color: '#ffb800' }}>
            Composite Figures Involving Circles Mastery Complete ✅
          </p>

          {/* Stats Breakdown */}
          <div className="trophy-stats">
            <div className="trophy-stat">
              <span className="stat-value number-display">{totalCorrect}</span>
              <span className="stat-label label-text">Challenges Solved 🎯</span>
            </div>
            <div className="trophy-stat">
              <span className="stat-value number-display">{xpTotal || 1200}</span>
              <span className="stat-label label-text">XP Earned ⭐</span>
            </div>
            <div className="trophy-stat">
              <span className="stat-value number-display">{bestStreak || 7}</span>
              <span className="stat-label label-text">Best Streak 🔥</span>
            </div>
          </div>

          {/* Stars Row */}
          <div className="trophy-stars">
            {[...Array(Math.max(totalStars || 12, 5))].slice(0, 15).map((_, i) => (
              <span key={i} style={{ fontSize: '1.4rem' }} className="anim-bounce-in">
                ⭐
              </span>
            ))}
          </div>

          {/* Badges List */}
          <div className="trophy-badges">
            <p className="label-text" style={{ color: 'rgba(255, 255, 255, 0.6)', textAlign: 'center', marginBottom: '6px' }}>
              Badges &amp; Skills Unlocked
            </p>
            <div className="badge-list">
              <div className="badge-pill">
                <span style={{ fontSize: '1.4rem' }}>📐</span>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <span style={{ fontWeight: 800 }}>Decomposition Pro</span>
                  <span className="badge-desc label-text">Splits complex shapes into circles &amp; rectangles</span>
                </div>
              </div>
              <div className="badge-pill">
                <span style={{ fontSize: '1.4rem' }}>📏</span>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <span style={{ fontWeight: 800 }}>Boundary Master</span>
                  <span className="badge-desc label-text">Never counts internal seams in outer perimeters</span>
                </div>
              </div>
              <div className="badge-pill">
                <span style={{ fontSize: '1.4rem' }}>✂️</span>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <span style={{ fontWeight: 800 }}>Shaded Region Ace</span>
                  <span className="badge-desc label-text">Solves cutout subtraction problems with precision</span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="trophy-actions">
            <button className="btn btn-primary trophy-cta" onClick={handlePlayAgain}>
              🔄 Play Again
            </button>
            <button className="btn btn-outline" onClick={handleGoHome}>
              🏠 Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="reflect-wrap">
      <div className="reflect-card glass-card anim-slide-up">
        <div className="reflect-header">
          <span className="reflect-badge">📓 Learning Reflection &amp; Scorecard</span>
          <h2 className="reflect-title subheadline">Reflect on Your Composite Circles Journey</h2>
        </div>

        {/* Mascot Message */}
        <div className="reflect-mascot-row">
          <div className="reflect-mascot-circle">🧭</div>
          <div className="reflect-speech-bubble">
            Let's check your key takeaways and review your scorecard! 📐
          </div>
        </div>

        {/* Self-Assessment Concept Questions */}
        <div className="reflect-quiz-container">
          <p className="body-text" style={{ color: '#ffb800', fontWeight: 800 }}>
            🧠 Circle Composite Concept Reflection Check:
          </p>
          {REFLECT_QUESTIONS.map((qObj, qIdx) => (
            <div key={qIdx} className="reflect-q-item">
              <p className="reflect-q-text">{qObj.q}</p>
              <div className="reflect-opt-row">
                {qObj.options.map((opt, oIdx) => {
                  const isSelected = answers[qIdx] === oIdx;
                  return (
                    <button
                      key={oIdx}
                      className={`option-btn ${isSelected ? 'selected' : ''}`}
                      onClick={() => handleSelectOption(qIdx, oIdx)}
                      style={{ textAlign: 'left', minHeight: '40px', fontSize: '0.95rem', padding: '8px 14px' }}
                    >
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Learning Journal Entry */}
        <div className="reflect-journal">
          <label className="reflect-label body-text" htmlFor="journal-input">
            Write one key composite circle formula or rule you mastered:
          </label>
          <textarea
            id="journal-input"
            className="reflect-textarea"
            placeholder="e.g. Perimeter is only outer edges! Two semicircles combine to form 1 full circle with Area = πr²."
            value={journal}
            onChange={e => setJournal(e.target.value)}
            rows={2}
            aria-label="Learning journal entry"
          />

          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '6px' }}>
            <span style={{ fontSize: '0.8rem', color: '#a0a0b8', alignSelf: 'center' }}>Quick insert:</span>
            {QUICK_INSERTS.map(ex => (
              <button
                key={ex}
                type="button"
                onClick={() => setJournal(ex)}
                className="quick-insert-btn"
              >
                ✨ {ex}
              </button>
            ))}
          </div>
        </div>

        {/* Performance Snapshot */}
        <div className="reflect-stats">
          <div className="reflect-stat-pill">⭐ {xpTotal || 850} XP Earned</div>
          <div className="reflect-stat-pill">✅ 100% Core Competencies</div>
          <div className="reflect-stat-pill">🔥 Best Streak: {bestStreak || 5}</div>
        </div>

        <div className="reflect-actions">
          <button className="btn btn-primary btn-lg" onClick={handleSubmit}>
            🌟 Submit Reflection &amp; View Trophy Scorecard!
          </button>
        </div>
      </div>
    </div>
  );
}
