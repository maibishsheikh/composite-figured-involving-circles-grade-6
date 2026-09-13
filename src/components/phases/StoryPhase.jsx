import React, { useState, useEffect } from 'react';
import './StoryPhase.css';
import { useProgress } from '../../state/ProgressContext.jsx';
import { playAudio, stopAudio } from '../../utils/audio.js';
import { Compass, Sparkles } from 'lucide-react';

const STORY_SLIDES = [
  {
    slideNumber: 1,
    title: "Oliver's Running Track",
    image: '/assets/story/story_1.png',
    question: "How can Oliver and Maya design a track with curved ends without guessing the distance?",
    storyText: "Oliver and Maya are setting up a running track for Grade 6 sports day. The middle section is a rectangle, but both ends are capped with semicircles. How can they calculate the exact boundary length?",
    factBubble: "In math, a composite figure is a shape made by combining two or more basic shapes!"
  },
  {
    slideNumber: 2,
    title: "Radius & Diameter Facts",
    image: '/assets/story/story_2.png',
    question: "What is the relationship between the radius and the diameter of a circle?",
    storyText: "Before tackling composite figures, Orbit reminds us of key circle facts: the radius 'r' goes from center to edge, while the diameter 'd' spans all the way across through the center point. Remember: d = 2r!",
    factBubble: "The radius is always half of the diameter (r = d ÷ 2)."
  },
  {
    slideNumber: 3,
    title: "Combining Semicircles",
    image: '/assets/story/story_3.png',
    question: "What happens when you combine two identical semicircles together?",
    storyText: "Look closely at the running track ends! Semicircle 1 on the left and Semicircle 2 on the right are identical. When joined together, they form ONE full complete circle!",
    factBubble: "Two halves make a whole! Joining 2 semicircles gives 1 full circle."
  },
  {
    slideNumber: 4,
    title: "Distance Around a Circle",
    image: '/assets/story/story_4.png',
    question: "How do we calculate the distance around a circle?",
    storyText: "The total distance around any circle is called its Circumference (C). Formula: C = π × d or C = 2 × π × r. We use π ≈ 3.14 or π ≈ 22/7 depending on the given numbers!",
    factBubble: "Circumference is just the math word for a circle's perimeter."
  },
  {
    slideNumber: 5,
    title: "Area Inside a Circle",
    image: '/assets/story/story_5.png',
    question: "How do we find the area inside a circle compared to a rectangle?",
    storyText: "The area of the middle rectangle is simply length × width. The area of a full circle is π × r². For a semicircle, divide by 2! For a quarter circle, divide by 4!",
    factBubble: "Rectangle Area = L × W. Circle Area = π × r²."
  },
  {
    slideNumber: 6,
    title: "Total Composite Area",
    image: '/assets/story/story_6.png',
    question: "How do we find the total area of the running track?",
    storyText: "To find the total area of a composite figure formed by joining shapes, simply calculate each part's area separately and add them together! Total Area = Rectangle Area + Circle Area.",
    factBubble: "Composite Area = Add the individual shape areas together!"
  },
  {
    slideNumber: 7,
    title: "Perimeter Outer Boundary",
    image: '/assets/story/story_7.png',
    question: "What is the key rule when finding the perimeter of a composite figure?",
    storyText: "Warning! When calculating the total perimeter around the outer boundary, ONLY add outer straight edges and outer curved arcs. NEVER double count internal joining edges!",
    factBubble: "Perimeter TRAP: Internal edges where shapes attach are excluded!"
  },
  {
    slideNumber: 8,
    title: "Split, Solve & Combine",
    image: '/assets/story/story_8.png',
    question: "What are the three steps to master any composite figure?",
    storyText: "Oliver, Maya, and Orbit are ready for victory! Master composite figures in 3 simple steps: 1. Split the figure into basic shapes. 2. Solve each part. 3. Combine by adding or subtracting!",
    factBubble: "Split, Solve, Combine — you're ready for Simulate!"
  }
];

export default function StoryPhase() {
  const { setPhase, isMuted } = useProgress();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slide = STORY_SLIDES[currentSlide];
  const progressPercent = ((currentSlide + 1) / STORY_SLIDES.length) * 100;

  useEffect(() => {
    playAudio(slide.storyText, isMuted);
    return () => stopAudio();
  }, [currentSlide, isMuted]);

  const handleNext = () => {
    if (currentSlide < STORY_SLIDES.length - 1) {
      setCurrentSlide(prev => prev + 1);
    } else {
      setPhase('simulate');
    }
  };

  const handleBack = () => {
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
    }
  };

  return (
    <div className="story-wrap select-none">
      <div className="story-container">
        {/* Top Progress Bar & Counter */}
        <div className="story-progress-bar-row">
          <div className="story-track">
            <div
              className="story-fill"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="story-counter-text">
            {currentSlide + 1} / {STORY_SLIDES.length}
          </span>
        </div>

        {/* Main Story Card */}
        <div className="story-main-card">
          {/* Left Illustration */}
          <div className="story-image-section">
            <div className="story-image-container">
              <img
                src={slide.image}
                alt={`Story Slide ${slide.slideNumber}`}
                className="story-full-img"
              />
            </div>
          </div>

          {/* Right Narrative */}
          <div className="story-content-section">
            <h2 className="story-title">
              {slide.title}
            </h2>

            <p className="story-text">
              {slide.storyText}
            </p>

            <div className="story-prompt-pill">
              <Sparkles className="w-4 h-4 text-[#ffc700] shrink-0" />
              <span>"{slide.question}"</span>
            </div>

            <div className="bg-white text-gray-900 rounded-2xl px-3.5 py-2 shadow-md flex items-center gap-2.5 border-2 border-white shrink-0">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#ffb800] border border-amber-300 flex items-center justify-center shrink-0 shadow">
                <Compass className="w-4 h-4 sm:w-5 sm:h-5 text-[#1a0f3d]" />
              </div>
              <p className="text-xs sm:text-sm font-black text-gray-900 leading-tight">
                {slide.factBubble}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Footer Navigation */}
        <div className="story-footer-nav">
          <button
            disabled={currentSlide === 0}
            onClick={handleBack}
            className="btn btn-outline btn-sm"
          >
            ← Back
          </button>

          <div className="bg-[#13082e] border border-white/15 rounded-full px-3 py-1.5 flex items-center gap-2">
            {STORY_SLIDES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`transition-all duration-300 cursor-pointer ${
                  idx === currentSlide
                    ? 'w-6 h-2.5 bg-[#ffc700] rounded-full shadow-[0_0_8px_#ffc700]'
                    : 'w-2.5 h-2.5 bg-white/25 hover:bg-white/40 rounded-full'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="btn btn-primary btn-sm"
          >
            {currentSlide === STORY_SLIDES.length - 1 ? 'Go to Simulate! 🧩' : 'Next →'}
          </button>
        </div>
      </div>
    </div>
  );
}

export { StoryPhase };
