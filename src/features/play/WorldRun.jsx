import React, { useState, useEffect } from 'react';
import { generateWorldQuestions } from '../../core/questions/generateWorld.js';
import { useProgress } from '../../state/ProgressContext.jsx';
import { QuestionCard } from './QuestionCard.jsx';
import { FeedbackOverlay } from '../../components/FeedbackOverlay.jsx';
import { Confetti } from '../../components/Confetti.jsx';
import { ArrowLeft, Star, Flame, Heart } from 'lucide-react';
import { playAudio, stopAudio } from '../../utils/audio.js';

const WORLD_NAMES = {
  1: "Bicycle Wheels",
  2: "Pizza Planet",
  3: "Clockwork Tower",
  4: "Ferris Wheel",
  5: "Track & Field",
  6: "Coin Vault",
  7: "Sunken Plate Reef",
  8: "Flower Bed Garden",
  9: "Orbiting Satellites",
  10: "Golden Medals"
};

const WORLD_INTRO_TEXTS = {
  1: "World 1: Round Table Yard. Master radius, diameter, and full circle circumference!",
  2: "World 2: Garden Path Grove. Calculate the area of full circles with ease!",
  3: "World 3: Wheel Works. Discover perimeter and area of semicircles!",
  4: "World 4: Pizza Palace. Explore quarter circles and slice through perimeters and areas!",
  5: "World 5: Window Wonderland. Solve composite areas formed by adding shape plus circle part!",
  6: "World 6: Coin Cove. Master composite area subtraction — removing circular cutouts!",
  7: "World 7: Running Track Raceway. Calculate total composite perimeters without double counting inside edges!",
  8: "World 8: Clock Tower City. Learn when to use pi as 3.14 or 22 over 7 for fast computation!",
  9: "World 9: Word Problem Woods. Solve multi-step real world story problems with circles!",
  10: "World 10: Challenge Colosseum. Conquer mixed multi-shape composite figures in the ultimate arena!"
};

export function WorldRun({ worldId, onBackToWorlds }) {
  const {
    addXP,
    incrementStreak,
    resetStreak,
    loseHeart,
    hearts,
    resetHearts,
    completeWorld,
    streak,
    worlds,
    isMuted
  } = useProgress();

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    resetHearts();
    const generated = generateWorldQuestions(worldId);
    setQuestions(generated);
    setCurrentIndex(0);
    setScore(0);
    setIsFinished(false);
    if (WORLD_INTRO_TEXTS[worldId]) {
      playAudio(WORLD_INTRO_TEXTS[worldId], isMuted);
    }
    return () => stopAudio();
  }, [worldId, isMuted]);

  if (questions.length === 0) return null;

  const currentQ = questions[currentIndex];
  const worldName = WORLD_NAMES[worldId] || `World ${worldId}`;
  const totalStars = Object.values(worlds).reduce((acc, w) => acc + (w.stars || 0), 0);

  const handleAnswer = (isCorrect) => {
    if (isCorrect) {
      setScore(prev => prev + 1);
      addXP(25);
      incrementStreak();
      setFeedback({
        isCorrect: true,
        explanation: currentQ.explanation
      });
    } else {
      loseHeart();
      resetStreak();
      setFeedback({
        isCorrect: false,
        explanation: `Incorrect. ${currentQ.explanation}`
      });
    }
  };

  const handleNextQuestion = () => {
    setFeedback(null);

    if (currentIndex < questions.length - 1 && hearts > 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      const accuracy = score / 10;
      const starsEarned = accuracy >= 0.9 ? 3 : accuracy >= 0.7 ? 2 : accuracy >= 0.5 ? 1 : 0;
      completeWorld(worldId, starsEarned, accuracy);
      setIsFinished(true);
    }
  };

  if (isFinished) {
    const accuracy = Math.round((score / 10) * 100);
    const starsEarned = accuracy >= 90 ? 3 : accuracy >= 70 ? 2 : accuracy >= 50 ? 1 : 0;

    return (
      <div className="flex-1 flex flex-col items-center justify-center p-4 text-center max-w-md mx-auto h-full overflow-hidden select-none box-border my-auto">
        {starsEarned > 0 && <Confetti />}

        <h2 className="text-3xl sm:text-4xl font-black text-[#ffc700] drop-shadow-md font-display mb-2">
          {worldName} Complete! 🏆
        </h2>

        <div className="flex items-center justify-center gap-2 mb-3">
          {[1, 2, 3].map((starNum) => (
            <span
              key={starNum}
              className={`text-4xl transition-all ${
                starNum <= starsEarned ? 'text-[#ffc700] animate-bounce' : 'text-gray-700 opacity-40'
              }`}
            >
              ⭐
            </span>
          ))}
        </div>

        <div className="bg-[#180e3c]/95 p-4 rounded-2xl border-1.5 border-[#7c4dff]/40 shadow-xl w-full space-y-2 text-sm sm:text-base font-black text-white mb-4">
          <p className="text-[#35d0f5]">Score: {score} / 10 Correct ({accuracy}%)</p>
          <p className="text-[#ffc700]">Stars Earned: {starsEarned} / 3</p>
          <p className="text-[#ff007f]">Total XP Earned: +{score * 25} XP</p>
        </div>

        <button
          onClick={onBackToWorlds}
          className="btn-primary w-full py-3 rounded-xl text-base shadow-xl active:scale-95 transition-all cursor-pointer"
        >
          Back to Worlds Grid 🗺️
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full h-full max-h-full min-h-0 flex flex-col items-center justify-between p-2 sm:p-3 overflow-hidden select-none box-border max-w-[840px] mx-auto">
      {/* Sleek Unified Top HUD Bar matching reference .play-top-bar */}
      <div className="w-full bg-[#180e3c]/85 border border-white/15 rounded-full px-3 py-1.5 flex items-center justify-between gap-2 shrink-0 backdrop-blur-md shadow-md flex-wrap sm:flex-nowrap">
        {/* Left: Back Button + World Pill */}
        <div className="flex items-center gap-2">
          <button
            onClick={onBackToWorlds}
            className="bg-white/10 hover:bg-white/20 text-white font-black text-xs px-3 py-1 rounded-full flex items-center gap-1 cursor-pointer transition-all border border-white/10 shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Worlds</span>
          </button>

          <div className="bg-gradient-to-r from-[#ff007f] to-[#e60067] text-white px-3 py-0.5 rounded-full font-black text-xs border border-pink-400/40 flex items-center gap-1.5 shrink-0">
            <span>⭕</span>
            <span className="truncate max-w-[130px] sm:max-w-[200px]">{worldName}</span>
          </div>
        </div>

        {/* Center: Hearts */}
        <div className="flex items-center gap-1.5 shrink-0">
          {[1, 2, 3].map((hIndex) => (
            <Heart
              key={hIndex}
              className={`w-5 h-5 transition-all ${
                hIndex <= hearts
                  ? 'text-[#ff0055] fill-[#ff0055] drop-shadow-[0_0_6px_#ff0055]'
                  : 'text-gray-700 fill-gray-800 opacity-40'
              }`}
            />
          ))}
        </div>

        {/* Right: Streak + Stars + Q Counter */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="bg-white/8 border border-white/12 text-[#ff7a1a] text-xs font-black px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 fill-current" />
            <span>{streak}x</span>
          </div>

          <div className="bg-white/8 border border-white/12 text-[#ffb800] text-xs font-black px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span>{totalStars}</span>
          </div>

          <div className="bg-[#ffc700]/20 border border-[#ffc700]/40 text-[#ffc700] text-xs font-black px-2.5 py-0.5 rounded-full">
            {currentIndex + 1}/10
          </div>
        </div>
      </div>

      {/* Sleek Progress Line */}
      <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden my-1 shrink-0">
        <div
          className="h-full bg-gradient-to-r from-[#35d0f5] to-[#7c4dff] rounded-full transition-all duration-300 shadow-[0_0_8px_#35d0f5]"
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Main Question Card Component */}
      <QuestionCard question={currentQ} onAnswer={handleAnswer} />

      {/* Feedback Overlay */}
      {feedback && (
        <FeedbackOverlay
          isCorrect={feedback.isCorrect}
          explanation={feedback.explanation}
          onNext={handleNextQuestion}
          isLastQuestion={currentIndex === 9 || hearts === 0}
        />
      )}
    </div>
  );
}
