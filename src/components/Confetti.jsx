import { useEffect } from 'react';
import confetti from 'canvas-confetti';

export function Confetti() {
  useEffect(() => {
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      console.warn('Confetti effect failed:', e);
    }
  }, []);

  return null;
}
