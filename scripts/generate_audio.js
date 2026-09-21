import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

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
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Audio lines to pre-generate
const phrases = [
  // Wonder Hook
  { key: 'wonder_hook', text: "Oliver is designing a running track shaped like a rectangle with a semicircle at each end. How can we find its total distance around — even though part of it curves?" },
  
  // Story Slides
  { key: 'story_1_q', text: "How can Oliver and Maya design a track with curved ends without guessing the distance?" },
  { key: 'story_1_f', text: "In math, a composite figure is a shape made by combining two or more basic shapes!" },
  { key: 'story_2_q', text: "What is the relationship between the radius and the diameter of a circle?" },
  { key: 'story_2_f', text: "The radius 'r' goes from center to edge, while diameter 'd' goes all the way across. Remember d = 2r!" },
  { key: 'story_3_q', text: "What happens when you combine two identical semicircles together?" },
  { key: 'story_3_f', text: "Two halves make a whole! Joining two identical semicircles creates one complete circle." },
  { key: 'story_4_q', text: "How do we calculate the distance around a circle?" },
  { key: 'story_4_f', text: "Circumference C equals pi times diameter, or 2 times pi times radius!" },
  { key: 'story_5_q', text: "How do we find the area inside a circle compared to a rectangle?" },
  { key: 'story_5_f', text: "Rectangle area is length times width. Circle area is pi times r squared!" },
  { key: 'story_6_q', text: "How do we find the total area of the running track?" },
  { key: 'story_6_f', text: "Add the parts! Total area equals the area of the rectangle plus the area of the full circle." },
  { key: 'story_7_q', text: "What is the key rule when finding the perimeter of a composite figure?" },
  { key: 'story_7_f', text: "Never double count inside edges! Only add outer straight edges and outer curved arcs." },
  { key: 'story_8_q', text: "What are the three steps to master any composite figure?" },
  { key: 'story_8_f', text: "Split the shape, solve each part, then combine by adding or subtracting!" },

  // Simulate Intros
  { key: 'sim_station1', text: "Welcome to Shape Splitter Table! Drag or tap shapes to assemble the target composite figure matching labelled dimensions." },
  { key: 'sim_station2', text: "Welcome to Circle Slicer Bench! Slice the circle into halves and quarters to observe area and perimeter fractions." },
  { key: 'sim_station3', text: "Welcome to Perimeter Path Tracer! Trace the outer perimeter step by step. Remember to skip internal joining edges!" },

  // Reflect
  { key: 'reflect_prompt', text: "What did you learn about composite figures with circles? Explain it to Maya with an example!" },

  // Practice Worlds Intros (1-10)
  { key: 'world_1', text: "World 1: Round Table Yard. Master radius, diameter, and full circle circumference!" },
  { key: 'world_2', text: "World 2: Garden Path Grove. Calculate the area of full circles with ease!" },
  { key: 'world_3', text: "World 3: Wheel Works. Discover perimeter and area of semicircles!" },
  { key: 'world_4', text: "World 4: Pizza Palace. Explore quarter circles and slice through perimeters and areas!" },
  { key: 'world_5', text: "World 5: Window Wonderland. Solve composite areas formed by adding shape plus circle part!" },
  { key: 'world_6', text: "World 6: Coin Cove. Master composite area subtraction — removing circular cutouts!" },
  { key: 'world_7', text: "World 7: Running Track Raceway. Calculate total composite perimeters without double counting inside edges!" },
  { key: 'world_8', text: "World 8: Clock Tower City. Learn when to use pi as 3.14 or 22 over 7 for fast computation!" },
  { key: 'world_9', text: "World 9: Word Problem Woods. Solve multi-step real world story problems with circles!" },
  { key: 'world_10', text: "World 10: Challenge Colosseum. Conquer mixed multi-shape composite figures in the ultimate arena!" }
];

async function generateSpeech(text, filename) {
  const filePath = path.join(outputDir, filename);
  if (fs.existsSync(filePath)) {
    console.log(`[SKIP] Already exists: ${filename}`);
    return `/assets/audio/${filename}`;
  }

  console.log(`[GENERATING] ${filename} -> "${text.substring(0, 30)}..."`);
  try {
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': ELEVENLABS_API_KEY
      },
      body: JSON.stringify({
        text: text,
        model_id: MODEL_ID,
        voice_settings: {
          stability: 0.20,
          similarity_boost: 0.55,
          style: 0.50,
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
  const audioMap = {};

  for (const item of phrases) {
    const filename = `${item.key}.mp3`;
    const url = await generateSpeech(item.text, filename);
    if (url) {
      audioMap[item.text] = url;
    }
    // Small delay between API requests
    await new Promise(r => setTimeout(r, 200));
  }

  // Write audioMap.js
  const mapPath = path.join(process.cwd(), 'src', 'utils', 'audioMap.js');
  const mapDir = path.dirname(mapPath);
  if (!fs.existsSync(mapDir)) {
    fs.mkdirSync(mapDir, { recursive: true });
  }

  const fileContent = `// Auto-generated Audio Map
export const AUDIO_MAP = ${JSON.stringify(audioMap, null, 2)};
`;

  fs.writeFileSync(mapPath, fileContent);
  console.log(`[DONE] Wrote audio mapping file to ${mapPath}`);
}

main();
