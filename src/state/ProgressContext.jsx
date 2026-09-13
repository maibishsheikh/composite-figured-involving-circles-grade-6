import React, { createContext, useContext, useState, useEffect } from 'react';
import { stopAudio, setGlobalMute } from '../utils/audio.js';

const ProgressContext = createContext();

const STORAGE_KEY = 'circlecraft:progress:v1';

const initialProgress = {
  xpTotal: 0,
  streak: 0,
  bestStreak: 0,
  hearts: 3,
  currentPhase: 'landing', // 'landing' | 'wonder' | 'story' | 'simulate' | 'practice' | 'reflect'
  selectedWorld: null,
  isMuted: false,
  simulateStations: {
    station1: { completed: false, targets: 0 },
    station2: { completed: false, targets: 0 },
    station3: { completed: false, targets: 0 },
    station4: { completed: false, targets: 0 }
  },
  worlds: {
    1: { unlocked: true, stars: 0, bestAccuracy: 0 },
    2: { unlocked: false, stars: 0, bestAccuracy: 0 },
    3: { unlocked: false, stars: 0, bestAccuracy: 0 },
    4: { unlocked: false, stars: 0, bestAccuracy: 0 },
    5: { unlocked: false, stars: 0, bestAccuracy: 0 },
    6: { unlocked: false, stars: 0, bestAccuracy: 0 },
    7: { unlocked: false, stars: 0, bestAccuracy: 0 },
    8: { unlocked: false, stars: 0, bestAccuracy: 0 },
    9: { unlocked: false, stars: 0, bestAccuracy: 0 },
    10: { unlocked: false, stars: 0, bestAccuracy: 0 }
  },
  badges: [],
  reflectionText: ''
};

export function ProgressProvider({ children }) {
  const [state, setState] = useState(initialProgress);

  // Clear local storage and reset progress whenever user enters the module
  useEffect(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.warn('Failed to clear local progress:', e);
    }
    setState(initialProgress);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('Failed to save progress:', e);
    }
  }, [state]);

  const resetAllProgress = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.warn('Failed to clear local progress:', e);
    }
    setState(initialProgress);
  };

  const addXP = (amount) => {
    setState(prev => ({
      ...prev,
      xpTotal: prev.xpTotal + amount
    }));
  };

  const incrementStreak = () => {
    setState(prev => {
      const newStreak = prev.streak + 1;
      return {
        ...prev,
        streak: newStreak,
        bestStreak: Math.max(prev.bestStreak, newStreak)
      };
    });
  };

  const resetStreak = () => {
    setState(prev => ({ ...prev, streak: 0 }));
  };

  const loseHeart = () => {
    setState(prev => ({
      ...prev,
      hearts: Math.max(0, prev.hearts - 1)
    }));
  };

  const resetHearts = () => {
    setState(prev => ({ ...prev, hearts: 3 }));
  };

  useEffect(() => {
    setGlobalMute(state.isMuted);
    if (state.isMuted) {
      stopAudio();
    }
  }, [state.isMuted]);

  const toggleMute = () => {
    setState(prev => {
      const nextMuted = !prev.isMuted;
      setGlobalMute(nextMuted);
      if (nextMuted) {
        stopAudio();
      }
      return { ...prev, isMuted: nextMuted };
    });
  };

  const setPhase = (phase) => {
    stopAudio();
    setState(prev => ({ ...prev, currentPhase: phase }));
  };

  const updateStationProgress = (stationKey, targetsCompleted) => {
    setState(prev => {
      const updatedStations = {
        ...prev.simulateStations,
        [stationKey]: {
          completed: targetsCompleted >= 3,
          targets: targetsCompleted
        }
      };
      return {
        ...prev,
        simulateStations: updatedStations
      };
    });
  };

  const completeWorld = (worldId, starsEarned, accuracy) => {
    setState(prev => {
      const currentWorld = prev.worlds[worldId] || { stars: 0, bestAccuracy: 0 };
      const newStars = Math.max(currentWorld.stars, starsEarned);
      const newAccuracy = Math.max(currentWorld.bestAccuracy, accuracy);

      const updatedWorlds = {
        ...prev.worlds,
        [worldId]: {
          unlocked: true,
          stars: newStars,
          bestAccuracy: newAccuracy
        }
      };

      // Unlock next world if earned at least 1 star
      if (newStars >= 1 && worldId < 10) {
        updatedWorlds[worldId + 1] = {
          ...updatedWorlds[worldId + 1],
          unlocked: true
        };
      }

      return {
        ...prev,
        worlds: updatedWorlds
      };
    });
  };

  const setReflectionText = (text) => {
    setState(prev => ({ ...prev, reflectionText: text }));
  };

  return (
    <ProgressContext.Provider
      value={{
        ...state,
        resetAllProgress,
        addXP,
        incrementStreak,
        resetStreak,
        loseHeart,
        resetHearts,
        toggleMute,
        setPhase,
        updateStationProgress,
        completeWorld,
        setReflectionText,
        setSelectedWorld: (worldId) => setState(prev => ({ ...prev, selectedWorld: worldId }))
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  return useContext(ProgressContext);
}
