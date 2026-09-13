import { useState, useCallback } from 'react';
import { playAudio, stopAudio } from '../utils/audio.js';

export function useAudio(initialEnabled = true) {
  const [enabled, setEnabled] = useState(initialEnabled);

  const narrate = useCallback((text) => {
    if (!enabled || !text) return;
    playAudio(text, false);
  }, [enabled]);

  const stopAll = useCallback(() => {
    stopAudio();
  }, []);

  return { narrate, stopAll, enabled, setEnabled };
}
export default useAudio;
