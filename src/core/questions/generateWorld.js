import { QUESTION_TEMPLATES } from './questionBank.js';
import { createSeededRng } from '../rng/seededRng.js';

export function generateWorldQuestions(worldId, seed = 2026) {
  const rng = createSeededRng(seed + worldId * 777);
  
  // Find templates suitable for this world
  let suitableTemplates = QUESTION_TEMPLATES.filter(t => t.worlds.includes(worldId));
  if (suitableTemplates.length === 0) {
    suitableTemplates = QUESTION_TEMPLATES; // fallback
  }

  const questions = [];
  const usedKeys = new Set();

  for (let i = 0; i < 10; i++) {
    let q = null;
    let key = '';
    let attempts = 0;

    while (attempts < 20) {
      const templateIndex = Math.floor(rng() * suitableTemplates.length);
      const template = suitableTemplates[templateIndex];
      q = template.generate(rng);
      key = `${q.prompt}_${q.correctAnswer}`;
      
      if (!usedKeys.has(key)) {
        usedKeys.add(key);
        break;
      }
      attempts++;
    }

    questions.push({
      id: `q_${worldId}_${i + 1}`,
      questionNumber: i + 1,
      ...q
    });
  }

  return questions;
}
