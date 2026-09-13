import React, { useState, useEffect } from 'react';
import { CircleSVG } from '../../components/shapes/CircleSVG.jsx';
import { SemicircleSVG } from '../../components/shapes/SemicircleSVG.jsx';
import { QuarterCircleSVG } from '../../components/shapes/QuarterCircleSVG.jsx';
import { CompositeFigureSVG } from '../../components/shapes/CompositeFigureSVG.jsx';
import { playAudio, stopAudio } from '../../utils/audio.js';
import { useProgress } from '../../state/ProgressContext.jsx';
import { HelpCircle, Volume2, Sparkles } from 'lucide-react';

export function QuestionCard({ question, onAnswer }) {
  const { isMuted } = useProgress();
  const [showHint, setShowHint] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => {
    setShowHint(false);
    setSelectedOption(null);
    if (question && (question.questionNumber > 1 || !question.questionNumber)) {
      playAudio(question.prompt, isMuted);
    }
    return () => stopAudio();
  }, [question, isMuted]);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    const isCorrect = option === question.correctAnswer;
    onAnswer(isCorrect, option);
  };

  const renderVisualShape = () => {
    if (question.visual === 'circle') {
      return <CircleSVG radius={question.radius || 7} showRadius={true} className="w-28 h-28 sm:w-36 sm:h-36 drop-shadow-md" />;
    }
    if (question.visual === 'semicircle') {
      return <SemicircleSVG radius={question.radius || 7} className="w-28 h-28 sm:w-36 sm:h-36 drop-shadow-md" />;
    }
    if (question.visual === 'quarter') {
      return <QuarterCircleSVG radius={question.radius || 7} className="w-28 h-28 sm:w-36 sm:h-36 drop-shadow-md" />;
    }
    if (question.visual && question.visual.startsWith('composite')) {
      return (
        <CompositeFigureSVG
          type={question.visual}
          length={question.length || 20}
          width={question.width || 10}
          radius={question.radius || 7}
          className="w-40 h-28 sm:w-52 sm:h-36 drop-shadow-md"
        />
      );
    }
    return null;
  };

  return (
    <div className="w-full h-full max-h-full min-h-0 bg-[#180e3c]/92 border-1.5 border-[#7c4dff]/35 shadow-[0_16px_45px_rgba(0,0,0,0.45)] rounded-3xl p-3 sm:p-4 flex flex-col items-center justify-between backdrop-blur-xl relative overflow-hidden select-none box-border flex-1">
      {/* Category Pill Badge */}
      <div className="bg-[#ffc700] text-[#1a0f3d] font-black text-[10px] sm:text-xs px-3.5 py-0.5 rounded-full shadow-sm uppercase tracking-wider flex items-center justify-center gap-1 mb-1 shrink-0 font-display">
        <Sparkles className="w-3.5 h-3.5 fill-current text-[#1a0f3d]" />
        <span>✦ {question.category || 'COMPOSITE FIGURES'} ✦</span>
      </div>

      {/* Main Inner Question Prompt Box */}
      <div className="w-full bg-[#0c051f] border border-[#2e185e] rounded-2xl p-2.5 sm:p-4 text-center my-0.5 flex flex-col items-center justify-center flex-1 min-h-0 overflow-hidden relative">
        {/* Render Visual SVG diagram if present */}
        {question.visual && (
          <div className="mb-1.5 shrink-0 flex items-center justify-center">
            {renderVisualShape()}
          </div>
        )}

        {/* Prompt Text */}
        <p className="text-sm sm:text-lg lg:text-xl font-black text-white leading-snug text-center font-display drop-shadow-sm px-2 my-auto">
          {question.prompt}
        </p>

        {/* Audio Read-Aloud Button */}
        <button
          onClick={() => playAudio(question.prompt, isMuted)}
          className="absolute right-2.5 top-2.5 p-1.5 rounded-full bg-[#24154e] text-[#35d0f5] hover:bg-[#321c6b] transition-all cursor-pointer shadow border border-[#35d0f5]/30"
          title="Listen to Question"
        >
          <Volume2 className="w-4 h-4" />
        </button>

        {/* Hint Dropdown Callout */}
        {showHint ? (
          <div className="w-full mt-1.5 p-2 rounded-xl bg-[#211147] border border-[#ffc700]/60 text-[#ffc700] text-xs font-black animate-fade-in shrink-0 flex items-center justify-between gap-2">
            <span>💡 Hint: {question.hint}</span>
            <button
              onClick={() => playAudio(`Hint: ${question.hint}`, isMuted)}
              className="p-1 rounded-full bg-[#271550] text-[#ffc700] hover:bg-[#381c73] shrink-0 cursor-pointer shadow transition-all"
              title="Listen to Hint"
            >
              <Volume2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => {
              setShowHint(true);
              if (question.hint) {
                playAudio(`Hint: ${question.hint}`, isMuted);
              }
            }}
            className="mt-0.5 text-[11px] sm:text-xs font-black text-[#ffc700] hover:underline flex items-center gap-1 cursor-pointer transition-all shrink-0"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Need a Hint?</span>
          </button>
        )}
      </div>

      {/* 2x2 Options Grid matching reference QuestionRenderer.css */}
      <div className="options-grid mt-1 shrink-0">
        {question.options.map((option, idx) => {
          const isSelected = selectedOption === option;
          return (
            <button
              key={idx}
              onClick={() => handleOptionClick(option)}
              className={`option-btn ${isSelected ? 'selected' : ''}`}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}
