import fs from 'fs';
import path from 'path';

const srcDir = 'C:/Users/Anwesh/.gemini/antigravity-ide/brain/cb8c2a03-7698-4c5d-bcb0-346020456dc5';
const destDir = 'public/assets/story';

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

const files = fs.readdirSync(srcDir).filter(f => f.startsWith('story_') && f.endsWith('.jpg'));
files.forEach(f => {
  const parts = f.split('_');
  const num = parts[1];
  const destPath = path.join(destDir, `story_${num}.png`);
  fs.copyFileSync(path.join(srcDir, f), destPath);
  console.log(`Copied ${f} -> ${destPath}`);
});
