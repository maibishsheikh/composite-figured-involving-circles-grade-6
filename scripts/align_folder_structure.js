import fs from 'fs';
import path from 'path';

// Helper to ensure dir
function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

// 1. Setup src/features/play
ensureDir('src/features/play');
if (fs.existsSync('src/phases/practice/QuestionCard.jsx')) {
  let qc = fs.readFileSync('src/phases/practice/QuestionCard.jsx', 'utf8');
  qc = qc.replace(/from '\.\.\/\.\.\/components\/shapes\//g, "from '../../components/shapes/");
  qc = qc.replace(/from '\.\.\/\.\.\/state\//g, "from '../../state/");
  qc = qc.replace(/from '\.\.\/\.\.\/utils\//g, "from '../../utils/");
  fs.writeFileSync('src/features/play/QuestionCard.jsx', qc, 'utf8');
  console.log('Created src/features/play/QuestionCard.jsx');
}

if (fs.existsSync('src/phases/practice/WorldRun.jsx')) {
  let wr = fs.readFileSync('src/phases/practice/WorldRun.jsx', 'utf8');
  wr = wr.replace("./QuestionCard.jsx", "./QuestionCard.jsx");
  wr = wr.replace(/from '\.\.\/\.\.\/components\//g, "from '../../components/");
  wr = wr.replace(/from '\.\.\/\.\.\/core\/questions\//g, "from '../../core/questions/");
  wr = wr.replace(/from '\.\.\/\.\.\/state\//g, "from '../../state/");
  wr = wr.replace(/from '\.\.\/\.\.\/utils\//g, "from '../../utils/");
  fs.writeFileSync('src/features/play/WorldRun.jsx', wr, 'utf8');
  console.log('Created src/features/play/WorldRun.jsx');
}

if (fs.existsSync('src/phases/practice/WorldSelect.jsx')) {
  let ws = fs.readFileSync('src/phases/practice/WorldSelect.jsx', 'utf8');
  ws = ws.replace(/from '\.\.\/\.\.\/components\//g, "from '../../components/");
  ws = ws.replace(/from '\.\.\/\.\.\/state\//g, "from '../../state/");
  fs.writeFileSync('src/features/play/WorldSelect.jsx', ws, 'utf8');
  console.log('Created src/features/play/WorldSelect.jsx');
}

// Reference features in src/features/
fs.writeFileSync('src/features/play/PlayPhase.jsx', `import PlayPhase from '../../components/phases/PlayPhase.jsx';
export default PlayPhase;
export { PlayPhase };
`);

fs.writeFileSync('src/features/play/BossBattle.jsx', `import React from 'react';
export function BossBattle(props) {
  return <div className="boss-battle-container">{props.children}</div>;
}
export default BossBattle;
`);

fs.writeFileSync('src/features/play/GuidedPractice.jsx', `import React from 'react';
export function GuidedPractice(props) {
  return <div className="guided-practice-container">{props.children}</div>;
}
export default GuidedPractice;
`);

fs.writeFileSync('src/features/play/IndependentPractice.jsx', `import React from 'react';
export function IndependentPractice(props) {
  return <div className="independent-practice-container">{props.children}</div>;
}
export default IndependentPractice;
`);

fs.writeFileSync('src/features/play/TimedChallenge.jsx', `import React from 'react';
export function TimedChallenge(props) {
  return <div className="timed-challenge-container">{props.children}</div>;
}
export default TimedChallenge;
`);

// 2. Setup src/features/wonder
ensureDir('src/features/wonder');
fs.writeFileSync('src/features/wonder/WonderPhase.jsx', `import WonderPhase from '../../components/phases/WonderPhase.jsx';
export default WonderPhase;
export { WonderPhase };
`);
fs.writeFileSync('src/features/wonder/wonder.constants.js', `export const WONDER_HOOK = {
  title: "The Running Track Mystery",
  question: "How can we find the exact area and perimeter of a track with straight sides and curved semicircle ends?"
};
`);

// 3. Setup src/features/story
ensureDir('src/features/story/storyScripts');
fs.writeFileSync('src/features/story/StoryPhase.jsx', `import StoryPhase from '../../components/phases/StoryPhase.jsx';
export default StoryPhase;
export { StoryPhase };
`);
fs.writeFileSync('src/features/story/CharacterDialogue.jsx', `import React from 'react';
export function CharacterDialogue({ speaker, text, avatar }) {
  return (
    <div className="char-dialogue flex items-center gap-2 p-2 bg-white/10 rounded-xl">
      <span className="text-xl">{avatar || '🧭'}</span>
      <div>
        <strong className="text-xs text-[#f59e0b] block">{speaker}</strong>
        <p className="text-xs text-white">{text}</p>
      </div>
    </div>
  );
}
export default CharacterDialogue;
`);
fs.writeFileSync('src/features/story/storyScripts/slides.js', `export const STORY_SLIDES = [
  { slide: 1, title: "Oliver's Running Track" },
  { slide: 2, title: "Radius & Diameter Facts" },
  { slide: 3, title: "Combining Semicircles" },
  { slide: 4, title: "Distance Around a Circle" }
];
`);

// 4. Setup src/features/simulate
ensureDir('src/features/simulate');
fs.writeFileSync('src/features/simulate/SimulatePhase.jsx', `import SimulatePhase from '../../components/phases/SimulatePhase.jsx';
export default SimulatePhase;
export { SimulatePhase };
`);

// 5. Setup src/features/reflect
ensureDir('src/features/reflect');
fs.writeFileSync('src/features/reflect/ReflectPhase.jsx', `import ReflectPhase from '../../components/phases/ReflectPhase.jsx';
export default ReflectPhase;
export { ReflectPhase };
`);

// 6. Setup src/config
ensureDir('src/config');
fs.writeFileSync('src/config/audio.config.js', `export const AUDIO_CONFIG = {
  enabled: true,
  volume: 0.8
};
`);
fs.writeFileSync('src/config/characters.config.js', `export const CHARACTERS = {
  orbit: { name: 'Orbit', role: 'Guide Compass', emoji: '🧭' },
  maya: { name: 'Maya', role: 'Track Athlete', emoji: '🏃‍♀️' },
  oliver: { name: 'Oliver', role: 'Architect Apprentice', emoji: '📐' }
};
`);
fs.writeFileSync('src/config/worlds.config.js', `export const WORLDS_CONFIG = [
  { id: 1, name: 'Track Fields', topic: 'Perimeter of Semicircles' },
  { id: 2, name: 'Archway Plaza', topic: 'Norman Arches' }
];
`);

// 7. Setup src/data
ensureDir('src/data');
fs.writeFileSync('src/data/questionBank.js', `import { QUESTION_BANK, DISTRICTS } from '../core/questions/questionBank.js';
export { QUESTION_BANK, DISTRICTS };
export default QUESTION_BANK;
`);
fs.writeFileSync('src/data/storyContent.js', `export const STORY_PANELS = [
  { panel: 0, title: "Oliver's Running Track", text: "Designing composite track with semicircle caps." }
];
`);

// 8. Setup src/hooks
ensureDir('src/hooks');
fs.writeFileSync('src/hooks/useAudio.js', `import { useState, useCallback } from 'react';
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
`);
fs.writeFileSync('src/hooks/useViewport.js', `import { useState, useEffect } from 'react';

export function useViewport() {
  const [size, setSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
    height: typeof window !== 'undefined' ? window.innerHeight : 768
  });

  useEffect(() => {
    const handleResize = () => {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return size;
}
export default useViewport;
`);

// 9. Setup src/components/shared
ensureDir('src/components/shared');
fs.writeFileSync('src/components/shared/Mascot.jsx', `import React from 'react';
import './Mascot.css';

export function Mascot({ mood = 'happy', message = '', size = 'md' }) {
  return (
    <div className={\`mascot-wrapper mascot-\${size}\`}>
      <div className="mascot-avatar">🧭</div>
      {message && <div className="mascot-bubble">{message}</div>}
    </div>
  );
}
export default Mascot;
`);
fs.writeFileSync('src/components/shared/Mascot.css', `/* src/components/shared/Mascot.css */
.mascot-wrapper {
  display: inline-flex;
  align-items: center;
  gap: 10px;
}
.mascot-avatar {
  font-size: 2rem;
}
.mascot-bubble {
  background: white;
  color: #1f104d;
  padding: 6px 14px;
  border-radius: 14px;
  font-size: 0.9rem;
  font-weight: 800;
}
`);
fs.writeFileSync('src/components/shared/FloatingNumbers.jsx', `import React from 'react';
import './FloatingNumbers.css';

export function FloatingNumbers() {
  return (
    <div className="floating-numbers" aria-hidden="true">
      <span className="fn fn-1">π</span>
      <span className="fn fn-2">r²</span>
      <span className="fn fn-3">2πr</span>
      <span className="fn fn-4">½</span>
      <span className="fn fn-5">¼</span>
      <span className="fn fn-6">⭕</span>
    </div>
  );
}
export default FloatingNumbers;
`);
fs.writeFileSync('src/components/shared/FloatingNumbers.css', `/* src/components/shared/FloatingNumbers.css */
.floating-numbers {
  position: fixed;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
  z-index: 0;
}
.fn {
  position: absolute;
  font-size: 2rem;
  color: rgba(255, 255, 255, 0.05);
  font-weight: 900;
}
.fn-1 { top: 10%; left: 8%; }
.fn-2 { top: 30%; right: 12%; }
.fn-3 { top: 75%; left: 15%; }
.fn-4 { top: 80%; right: 18%; }
.fn-5 { top: 50%; left: 4%; }
.fn-6 { top: 15%; right: 5%; }
`);
fs.writeFileSync('src/components/shared/FeedbackOverlay.jsx', `import { FeedbackOverlay } from '../FeedbackOverlay.jsx';
export { FeedbackOverlay };
export default FeedbackOverlay;
`);
fs.writeFileSync('src/components/shared/FeedbackOverlay.css', `/* src/components/shared/FeedbackOverlay.css */
`);
fs.writeFileSync('src/components/shared/MoneyVisual.jsx', `import React from 'react';
export function MoneyVisual() { return null; }
export default MoneyVisual;
`);

// 10. Components at root
fs.writeFileSync('src/components/FloatingSymbols.jsx', `import { FloatingNumbers } from './shared/FloatingNumbers.jsx';
export default FloatingNumbers;
export { FloatingNumbers as FloatingSymbols };
`);
fs.writeFileSync('src/components/HintBubble.jsx', `import React from 'react';
export function HintBubble({ hint }) {
  if (!hint) return null;
  return (
    <div className="hint-bubble p-2 bg-[#ffc700]/15 border border-[#ffc700]/40 rounded-xl text-xs text-[#ffe082]">
      💡 Hint: {hint}
    </div>
  );
}
export default HintBubble;
`);
fs.writeFileSync('src/components/PhaseNav.jsx', `import { TopBar } from './TopBar.jsx';
export default TopBar;
export { TopBar as PhaseNav };
`);
fs.writeFileSync('src/components/ProgressRing.jsx', `import React from 'react';
export function ProgressRing({ percent = 0 }) {
  return (
    <div className="progress-ring-badge text-xs font-bold text-[#f59e0b]">
      {Math.round(percent)}%
    </div>
  );
}
export default ProgressRing;
`);
fs.writeFileSync('src/components/CoinDisplay.jsx', `import React from 'react';
export function CoinDisplay() { return null; }
export default CoinDisplay;
`);

console.log('Folder structure aligned successfully!');
