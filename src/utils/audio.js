import { AUDIO_MAP } from './audioMap.js';

let currentAudio = null;
let playSequenceId = 0;
let isGlobalMuted = false;

export function setGlobalMute(muted) {
  isGlobalMuted = Boolean(muted);
  if (isGlobalMuted) {
    stopAudio();
  }
}

export function getGlobalMute() {
  return isGlobalMuted;
}

export function stopAudio() {
  // Increment sequence ID so any pending async play promises are cancelled
  playSequenceId++;

  if (currentAudio) {
    try {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      currentAudio.onended = null;
      currentAudio.onerror = null;
      currentAudio.oncanplay = null;
    } catch (e) {
      console.warn('Error stopping HTML5 audio:', e);
    }
    currentAudio = null;
  }

  // Cancel any browser WebSpeech synthesis that might be lingering
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch (e) {
      console.warn('Error canceling speechSynthesis:', e);
    }
  }
}

export function playAudio(text, isMuted = false) {
  // Always stop existing audio first to prevent voice overlap
  stopAudio();

  if (isMuted || isGlobalMuted || !text) {
    return;
  }

  const cleanText = text.trim();
  const currentToken = ++playSequenceId;

  // Lookup in pre-generated ALICE Voice MP3 map
  const mappedUrl = AUDIO_MAP[cleanText] || AUDIO_MAP[text];

  if (mappedUrl) {
    try {
      const audio = new Audio(mappedUrl);
      currentAudio = audio;

      audio.play().then(() => {
        // If a new audio was requested while this one was loading, stop this one!
        if (currentToken !== playSequenceId) {
          try {
            audio.pause();
            audio.currentTime = 0;
          } catch (e) {
            // ignore
          }
        }
      }).catch(err => {
        console.warn('ALICE Voice Audio play error:', err);
        if (currentAudio === audio) {
          currentAudio = null;
        }
      });
    } catch (e) {
      console.warn('Failed to create HTML5 Audio object:', e);
      currentAudio = null;
    }
  } else {
    console.warn(`[Audio Warning] No pre-generated ALICE voice MP3 found for text: "${cleanText.substring(0, 50)}..."`);
  }
}
