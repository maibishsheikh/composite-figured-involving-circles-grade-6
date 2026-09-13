// src/components/phases/SimulatePhase.jsx
import React, { useState, useEffect } from 'react';
import './SimulatePhase.css';
import { useProgress } from '../../state/ProgressContext.jsx';
import { ShapeSplitterStation } from '../simulations/ShapeSplitterStation.jsx';
import { CircleSlicerStation } from '../simulations/CircleSlicerStation.jsx';
import { PerimeterTracerStation } from '../simulations/PerimeterTracerStation.jsx';
import { ShadedRegionStation } from '../simulations/ShadedRegionStation.jsx';
import { playAudio, stopAudio } from '../../utils/audio.js';
import { CheckCircle2, ArrowRight, ArrowLeft, Volume2 } from 'lucide-react';

const STATIONS = [
  { id: 1, key: 'station1', icon: '🧱', name: 'Shape Splitter', subtitle: 'Decompose Figures' },
  { id: 2, key: 'station2', icon: '🍕', name: 'Circle Slicer', subtitle: 'Sectors & Fractions' },
  { id: 3, key: 'station3', icon: '📏', name: 'Boundary Tracer', subtitle: 'Outer Perimeter Only' },
  { id: 4, key: 'station4', icon: '✂️', name: 'Shaded Detective', subtitle: 'Area by Subtraction' },
];

const STATION_AUDIO_TEXTS = {
  1: "Welcome to Shape Splitter Table! Decompose composite figures into rectangles and circles, then add their areas together.",
  2: "Welcome to Circle Slicer Bench! Slice circles into halves, quarters, and three-quarters to observe exact fraction areas.",
  3: "Welcome to Boundary Path Tracer! Trace the outer perimeter. Remember to skip internal joining seams!",
  4: "Welcome to Shaded Region Detective! Remove circular cutouts to calculate shaded areas by subtraction."
};

export default function SimulatePhase() {
  const { setPhase, simulateStations, updateStationProgress, isMuted } = useProgress();
  const [activeStation, setActiveStation] = useState(1);

  const isStation1Done = simulateStations?.station1?.completed;
  const isStation2Done = simulateStations?.station2?.completed;
  const isStation3Done = simulateStations?.station3?.completed;
  const isStation4Done = simulateStations?.station4?.completed;
  const allStationsDone = isStation1Done && isStation2Done && isStation3Done && isStation4Done;

  useEffect(() => {
    const text = STATION_AUDIO_TEXTS[activeStation];
    if (text) {
      playAudio(text, isMuted);
    }
    return () => stopAudio();
  }, [activeStation, isMuted]);

  const handlePrevStation = () => {
    setActiveStation(prev => Math.max(prev - 1, 1));
  };

  const handleNextStation = () => {
    if (activeStation < 4) {
      setActiveStation(prev => prev + 1);
    } else {
      setPhase('practice');
    }
  };

  const handleCompleteStation = (stationKey) => {
    if (updateStationProgress) {
      updateStationProgress(stationKey, { completed: true });
    }
  };

  return (
    <div className="sim-wrap select-none">
      <div className="sim-card">
        {/* Top Station Tabs */}
        <div className="sim-tabs flex-wrap sm:flex-nowrap justify-between">
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
            {STATIONS.map((station) => {
              const isActive = activeStation === station.id;
              const isDone = simulateStations?.[station.key]?.completed;

              return (
                <button
                  key={station.id}
                  onClick={() => setActiveStation(station.id)}
                  className={`station-tab ${isActive ? 'active' : ''}`}
                >
                  <span className="station-tab-icon">{station.icon}</span>
                  <div className="text-left leading-tight hidden xs:block">
                    <span className="station-tab-label block">{station.name}</span>
                    <span className="text-[10px] text-white/50 block">{station.subtitle}</span>
                  </div>
                  {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-[#22c55e] ml-1 shrink-0" />}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 mt-2 sm:mt-0">
            <button
              onClick={() => playAudio(STATION_AUDIO_TEXTS[activeStation], isMuted)}
              className="audio-btn w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all border border-white/15"
              title="Repeat instructions"
            >
              <Volume2 className="w-4 h-4 text-[#35d0f5]" />
            </button>
          </div>
        </div>

        {/* Station Content Viewport */}
        <div className="station-viewport">
          {activeStation === 1 && (
            <ShapeSplitterStation
              onStationComplete={() => handleCompleteStation('station1')}
              onComplete={() => handleCompleteStation('station1')}
              audioEnabled={!isMuted}
            />
          )}
          {activeStation === 2 && (
            <CircleSlicerStation
              onStationComplete={() => handleCompleteStation('station2')}
              onComplete={() => handleCompleteStation('station2')}
              audioEnabled={!isMuted}
            />
          )}
          {activeStation === 3 && (
            <PerimeterTracerStation
              onStationComplete={() => handleCompleteStation('station3')}
              onComplete={() => handleCompleteStation('station3')}
              audioEnabled={!isMuted}
            />
          )}
          {activeStation === 4 && (
            <ShadedRegionStation
              onStationComplete={() => handleCompleteStation('station4')}
              onComplete={() => handleCompleteStation('station4')}
              audioEnabled={!isMuted}
            />
          )}
        </div>

        {/* Bottom Station Navigation Bar */}
        <div className="station-footer flex items-center justify-between border-t border-white/10 pt-2 px-1">
          <button
            onClick={handlePrevStation}
            disabled={activeStation === 1}
            className="btn btn-outline btn-sm flex items-center gap-1.5 disabled:opacity-30"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Prev Lab</span>
          </button>

          <div className="flex items-center gap-1">
            {STATIONS.map((s) => (
              <span
                key={s.id}
                className={`w-2 h-2 rounded-full transition-all ${
                  activeStation === s.id ? 'bg-[#ffc700] w-5' : 'bg-white/20'
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleNextStation}
            className="btn btn-primary btn-sm flex items-center gap-1.5"
          >
            <span>{activeStation < 4 ? 'Next Lab' : 'Finish to Practice'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
