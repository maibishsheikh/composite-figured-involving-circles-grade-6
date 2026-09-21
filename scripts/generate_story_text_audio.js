import fs from 'fs';
import path from 'path';
import { AUDIO_MAP } from '../src/utils/audioMap.js';

function getApiKey() {
  if (process.env.VITE_ELEVENLABS_API_KEY) return process.env.VITE_ELEVENLABS_API_KEY.trim();
  if (process.env.ELEVENLABS_API_KEY) return process.env.ELEVENLABS_API_KEY.trim();
  const envLocalPath = path.join(process.cwd(), '.env.local');
  if (fs.existsSync(envLocalPath)) {
    const content = fs.readFileSync(envLocalPath, 'utf8');
    const match = content.match(/VITE_ELEVENLABS_API_KEY\s*=\s*(.+)/);
    if (match) return match[1].trim().replace(/^["']|["']$/g, '');
  }
  return 'sk_0af55b573c54fe31387443150c45624fed865ccc914cd486';
}

const ELEVENLABS_API_KEY = getApiKey();
const VOICE_ID = 'Xb7hH8MSUJpSbSDYk0k2';
const MODEL_ID = 'eleven_multilingual_v2';

const outputDir = path.join(process.cwd(), 'public', 'assets', 'audio');

const STORY_SLIDES = [
  {
    slideNumber: 1,
    storyText: "Oliver and Maya are setting up a running track for Grade 6 sports day. The middle section is a rectangle, but both ends are capped with semicircles. How can they calculate the exact boundary length?"
  },
  {
    slideNumber: 2,
    storyText: "Before tackling composite figures, Orbit reminds us of key circle facts: the radius 'r' goes from center to edge, while the diameter 'd' spans all the way across through the center point. Remember: d = 2r!"
  },
  {
    slideNumber: 3,
    storyText: "Look closely at the running track ends! Semicircle 1 on the left and Semicircle 2 on the right are identical. When joined together, they form ONE full complete circle!"
  },
  {
    slideNumber: 4,
    storyText: "The total distance around any circle is called its Circumference (C). Formula: C = π × d or C = 2 × π × r. We use π ≈ 3.14 or π ≈ 22/7 depending on the given numbers!"
  },
  {
    slideNumber: 5,
    storyText: "The area of the middle rectangle is simply length × width. The area of a full circle is π × r². For a semicircle, divide by 2! For a quarter circle, divide by 4!"
  },
  {
    slideNumber: 6,
    storyText: "To find the total area of a composite figure formed by joining shapes, simply calculate each part's area separately and add them together! Total Area = Rectangle Area + Circle Area."
  },
  {
    slideNumber: 7,
    storyText: "Warning! When calculating the total perimeter around the outer boundary, ONLY add outer straight edges and outer curved arcs. NEVER double count internal joining edges!"
  },
  {
    slideNumber: 8,
    storyText: "Oliver, Maya, and Orbit are ready for victory! Master composite figures in 3 simple steps: 1. Split the figure into basic shapes. 2. Solve each part. 3. Combine by adding or subtracting!"
  }
];

function cleanTextForSpeech(text) {
  let s = text;
  s = s.replace(/½/g, ' one half ');
  s = s.replace(/¼/g, ' one quarter ');
  s = s.replace(/≈/g, ' is approximately ');
  s = s.replace(/÷/g, ' divided by ');
  s = s.replace(/×/g, ' times ');
  s = s.replace(/r²/g, ' r squared ');
  s = s.replace(/cm²/g, ' square centimeters ');
  s = s.replace(/m²/g, ' square meters ');
  s = s.replace(/π/g, ' pi ');
  s = s.replace(/22\/7/g, ' 22 over 7 ');
  s = s.replace(/\bd = 2r\b/gi, 'd equals 2 times r');
  s = s.replace(/\br = d \/ 2\b/gi, 'r equals d divided by 2');
  s = s.replace(/\bC = 2 × π × r\b/gi, 'C equals 2 times pi times r');
  s = s.replace(/\bC = π × d\b/gi, 'C equals pi times d');
  s = s.replace(/\bArea A = π × r²\b/gi, 'Area A equals pi times r squared');
  s = s.replace(/\bL × W\b/gi, 'length times width');
  return s.replace(/\s+/g, ' ').trim();
}

async function generateSpeech(rawText, filename) {
  const filePath = path.join(outputDir, filename);
  const speechText = cleanTextForSpeech(rawText);

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
  const updatedMap = { ...AUDIO_MAP };

  for (const item of STORY_SLIDES) {
    const filename = `story_${item.slideNumber}_text.mp3`;
    const url = await generateSpeech(item.storyText, filename);
    if (url) {
      updatedMap[item.storyText] = url;
    }
    await new Promise(r => setTimeout(r, 150));
  }

  const mapPath = path.join(process.cwd(), 'src', 'utils', 'audioMap.js');
  const fileContent = `// Auto-generated Audio Map with Alice Voice ID
export const AUDIO_MAP = ${JSON.stringify(updatedMap, null, 2)};
`;

  fs.writeFileSync(mapPath, fileContent);
  console.log(`[DONE] Updated audio map at ${mapPath}`);
}

main();
