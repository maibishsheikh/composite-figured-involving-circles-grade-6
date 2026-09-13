// src/App.jsx
import React, { useState, useEffect } from 'react';
import './App.css';
import { ProgressProvider, useProgress } from './state/ProgressContext.jsx';
import { stopAudio } from './utils/audio.js';
import { BackgroundGlyphs } from './components/BackgroundGlyphs.jsx';
import { TopBar } from './components/TopBar.jsx';
import IntroScreen from './components/IntroScreen.jsx';
import WonderPhase from './components/phases/WonderPhase.jsx';
import StoryPhase from './components/phases/StoryPhase.jsx';
import SimulatePhase from './components/phases/SimulatePhase.jsx';
import PlayPhase from './components/phases/PlayPhase.jsx';
import ReflectPhase from './components/phases/ReflectPhase.jsx';

function MainContent() {
  const { currentPhase } = useProgress();
  const [activeWorldId, setActiveWorldId] = useState(null);

  useEffect(() => {
    if (currentPhase !== 'practice') {
      setActiveWorldId(null);
    }
  }, [currentPhase]);

  const handleSelectWorld = (worldId) => {
    stopAudio();
    setActiveWorldId(worldId);
  };

  const handleBackToWorlds = () => {
    stopAudio();
    setActiveWorldId(null);
  };

  const isIntro = currentPhase === 'landing' || currentPhase === 'intro';

  return (
    <div className="app-shell bg-[#150c2b] text-white">
      <BackgroundGlyphs />
      {!isIntro && <TopBar />}

      <main className={`phase-content ${isIntro ? 'intro-phase-content' : ''}`}>
        {isIntro && <IntroScreen />}
        {currentPhase === 'wonder' && <WonderPhase />}
        {currentPhase === 'story' && <StoryPhase />}
        {currentPhase === 'simulate' && <SimulatePhase />}
        {currentPhase === 'practice' && (
          <PlayPhase
            activeWorldId={activeWorldId}
            onSelectWorld={handleSelectWorld}
            onBackToWorlds={handleBackToWorlds}
          />
        )}
        {currentPhase === 'reflect' && <ReflectPhase />}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <ProgressProvider>
      <MainContent />
    </ProgressProvider>
  );
}
