import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { generateWorldQuestions } from '../src/core/questions/generateWorld.js';

const ELEVENLABS_API_KEY = 'sk_0af55b573c54fe31387443150c45624fed865ccc914cd486';
const VOICE_ID = 'Xb7hH8MSUJpSbSDYk0k2';
const MODEL_ID = 'eleven_multilingual_v2';

const outputDir = path.join(process.cwd(), 'public', 'assets', 'audio');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

function cleanTextForSpeech(text) {
  let s = text;
  
  // Replace fractions
  s = s.replace(/½/g, ' one half ');
  s = s.replace(/¼/g, ' one quarter ');

  // Replace math symbols
  s = s.replace(/≈/g, ' is approximately ');
  s = s.replace(/÷/g, ' divided by ');
  s = s.replace(/×/g, ' times ');

  // Replace exponents and units
  s = s.replace(/r²/g, ' r squared ');
  s = s.replace(/cm²/g, ' square centimeters ');
  s = s.replace(/m²/g, ' square meters ');

  // Replace pi symbol
  s = s.replace(/π/g, ' pi ');

  // Replace fraction pi representation
  s = s.replace(/22\/7/g, ' 22 over 7 ');

  // Clean up equations for natural reading
  s = s.replace(/\bd = 2r\b/gi, 'd equals 2 times r');
  s = s.replace(/\br = d \/ 2\b/gi, 'r equals d divided by 2');
  s = s.replace(/\bC = 2 × π × r\b/gi, 'C equals 2 times pi times r');
  s = s.replace(/\bC = π × d\b/gi, 'C equals pi times d');
  s = s.replace(/\bArea A = π × r²\b/gi, 'Area A equals pi times r squared');
  s = s.replace(/\bL × W\b/gi, 'length times width');

  // Clean up extra spaces
  s = s.replace(/\s+/g, ' ').trim();

  return s;
}

// 1. Wonder Phase
const phrases = [
  { key: 'wonder_hook', text: "Oliver is designing a running track with two curved semicircle ends and a rectangle middle. How can we find the total distance around without losing track?" },
];

// 2. Story Phase
const STORY_SLIDES = [
  {
    slideNumber: 1,
    question: "How can Oliver and Maya design a track with curved ends without guessing the distance?",
    storyText: "Oliver and Maya are setting up a running track for Grade 6 sports day. The middle section is a rectangle, but both ends are capped with semicircles. How can they calculate the exact boundary length?",
    factBubble: "In math, a composite figure is a shape made by combining two or more basic shapes!"
  },
  {
    slideNumber: 2,
    question: "What is the relationship between the radius and the diameter of a circle?",
    storyText: "Before tackling composite figures, Orbit reminds us of key circle facts: the radius 'r' goes from center to edge, while the diameter 'd' spans all the way across through the center point. Remember: d = 2r!",
    factBubble: "The radius is always half of the diameter (r = d ÷ 2)."
  },
  {
    slideNumber: 3,
    question: "What happens when you combine two identical semicircles together?",
    storyText: "Look closely at the running track ends! Semicircle 1 on the left and Semicircle 2 on the right are identical. When joined together, they form ONE full complete circle!",
    factBubble: "Two halves make a whole! Joining 2 semicircles gives 1 full circle."
  },
  {
    slideNumber: 4,
    question: "How do we calculate the distance around a circle?",
    storyText: "The total distance around any circle is called its Circumference (C). Formula: C = π × d or C = 2 × π × r. We use π ≈ 3.14 or π ≈ 22/7 depending on the given numbers!",
    factBubble: "Circumference is just the math word for a circle's perimeter."
  },
  {
    slideNumber: 5,
    question: "How do we find the area inside a circle compared to a rectangle?",
    storyText: "The area of the middle rectangle is simply length × width. The area of a full circle is π × r². For a semicircle, divide by 2! For a quarter circle, divide by 4!",
    factBubble: "Rectangle Area = L × W. Circle Area = π × r²."
  },
  {
    slideNumber: 6,
    question: "How do we find the total area of the running track?",
    storyText: "To find the total area of a composite figure formed by joining shapes, simply calculate each part's area separately and add them together! Total Area = Rectangle Area + Circle Area.",
    factBubble: "Composite Area = Add the individual shape areas together!"
  },
  {
    slideNumber: 7,
    question: "What is the key rule when finding the perimeter of a composite figure?",
    storyText: "Warning! When calculating the total perimeter around the outer boundary, ONLY add outer straight edges and outer curved arcs. NEVER double count internal joining edges!",
    factBubble: "Perimeter TRAP: Internal edges where shapes attach are excluded!"
  },
  {
    slideNumber: 8,
    question: "What are the three steps to master any composite figure?",
    storyText: "Oliver, Maya, and Orbit are ready for victory! Master composite figures in 3 simple steps: 1. Split the figure into basic shapes. 2. Solve each part. 3. Combine by adding or subtracting!",
    factBubble: "Split, Solve, Combine — you're ready for Simulate!"
  }
];

STORY_SLIDES.forEach(s => {
  const combined = `${s.question} ${s.storyText}`;
  phrases.push({ key: `story_${s.slideNumber}_combined`, text: combined });
  phrases.push({ key: `story_${s.slideNumber}_q`, text: s.question });
  phrases.push({ key: `story_${s.slideNumber}_f`, text: s.factBubble });
});

// 3. Simulate Phase
phrases.push(
  { key: 'sim_station1', text: "Welcome to Shape Splitter Table! Drag or tap shapes to assemble the target composite figure matching labelled dimensions." },
  { key: 'sim_station2', text: "Welcome to Circle Slicer Bench! Slice the circle into halves and quarters to observe area and perimeter fractions." },
  { key: 'sim_station3', text: "Welcome to Perimeter Path Tracer! Trace the outer perimeter step by step. Remember to skip internal joining edges!" }
);

// 4. World Select & Intros
phrases.push({ key: 'world_select_header', text: "Practice — Choose Your World! Answer questions in each world. Earn stars and XP!" });

const WORLD_INTRO_TEXTS = {
  1: "World 1: Round Table Yard. Master radius, diameter, and full circle circumference!",
  2: "World 2: Garden Path Grove. Calculate the area of full circles with ease!",
  3: "World 3: Wheel Works. Discover perimeter and area of semicircles!",
  4: "World 4: Pizza Palace. Explore quarter circles and slice through perimeters and areas!",
  5: "World 5: Window Wonderland. Solve composite areas formed by adding shape plus circle part!",
  6: "World 6: Coin Cove. Master composite area subtraction — removing circular cutouts!",
  7: "World 7: Running Track Raceway. Calculate total composite perimeters without double counting inside edges!",
  8: "World 8: Clock Tower City. Learn when to use pi as 3.14 or 22 over 7 for fast computation!",
  9: "World 9: Word Problem Woods. Solve multi-step real world story problems with circles!",
  10: "World 10: Challenge Colosseum. Conquer mixed multi-shape composite figures in the ultimate arena!"
};

for (let w = 1; w <= 10; w++) {
  phrases.push({ key: `world_intro_${w}`, text: WORLD_INTRO_TEXTS[w] });
}

// 5. 10 Worlds x 10 Questions + Hints
for (let w = 1; w <= 10; w++) {
  const qs = generateWorldQuestions(w);
  qs.forEach((q, idx) => {
    const qNum = idx + 1;
    phrases.push({ key: `w${w}_q${qNum}_prompt`, text: q.prompt });
    if (q.hint) {
      phrases.push({ key: `w${w}_q${qNum}_hint_raw`, text: q.hint });
      phrases.push({ key: `w${w}_q${qNum}_hint_prefixed`, text: `Hint: ${q.hint}` });
    }
  });
}

// 6. Reflect Phase
phrases.push({ key: 'reflect_prompt', text: "What did you learn about composite figures with circles? Explain it to Maya with an example!" });

async function generateSpeech(rawText, filename) {
  const filePath = path.join(outputDir, filename);
  const speechText = cleanTextForSpeech(rawText);

  // If file exists and size > 1000 bytes, skip
  if (fs.existsSync(filePath) && fs.statSync(filePath).size > 1000) {
    console.log(`[SKIP] Exists: ${filename}`);
    return `/assets/audio/${filename}`;
  }

  console.log(`[GENERATING ALICE VOICE] ${filename} -> "${speechText.substring(0, 40)}..."`);
  try {
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': ELEVENLABS_API_KEY
      },
      body: JSON.stringify({
        text: speechText,
        model_id: MODEL_ID,
        voice_settings: {
          stability: 0.40,
          similarity_boost: 0.80,
          style: 0.35,
          use_speaker_boost: true
        }
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error(`[ERROR] ElevenLabs failed for ${filename}: ${response.status} ${errText}`);
      return null;
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    fs.writeFileSync(filePath, buffer);
    console.log(`[SUCCESS] Saved ${filename} (${buffer.length} bytes)`);
    return `/assets/audio/${filename}`;
  } catch (err) {
    console.error(`[EXCEPT] Failed generation for ${filename}:`, err);
    return null;
  }
}

async function main() {
  console.log(`Total phrases to process: ${phrases.length}`);
  const audioMap = {};
  let successCount = 0;

  for (let i = 0; i < phrases.length; i++) {
    const item = phrases[i];
    // Sanitize key name
    const sanitizedKey = item.key.replace(/[^a-zA-Z0-9_]/g, '_');
    const filename = `${sanitizedKey}.mp3`;
    
    const url = await generateSpeech(item.text, filename);
    if (url) {
      audioMap[item.text] = url;
      successCount++;
    }
    
    // Small delay between requests to be gentle on rate limits
    await new Promise(r => setTimeout(r, 120));
  }

  // Write audioMap.js
  const mapPath = path.join(process.cwd(), 'src', 'utils', 'audioMap.js');
  const fileContent = `// Auto-generated Audio Map with Alice Voice ID
export const AUDIO_MAP = ${JSON.stringify(audioMap, null, 2)};
`;

  fs.writeFileSync(mapPath, fileContent);
  console.log(`\n========================================`);
  console.log(`[DONE] Processed ${successCount}/${phrases.length} audio files with phonetically cleaned ALICE Voice ID.`);
  console.log(`[DONE] Saved mapping file to ${mapPath}`);
  console.log(`========================================\n`);
}

main();
