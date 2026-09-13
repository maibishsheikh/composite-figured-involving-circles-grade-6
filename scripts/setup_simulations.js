import fs from 'fs';
import path from 'path';

const targetDir = path.resolve('src/components/simulations');
if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });

// Copy Stations.css from reference
const refStationsCss = 'C:/Users/HP/.gemini/antigravity-ide/brain/01f87285-fca2-40ec-b989-20eb48a390e9/scratch/reference/G2-Money-Money-main/src/components/simulations/Stations.css';
if (fs.existsSync(refStationsCss)) {
  fs.copyFileSync(refStationsCss, path.join(targetDir, 'Stations.css'));
  console.log('Copied Stations.css');
}

// Copy station JSX files and adjust import
const stations = ['ShapeSplitterStation.jsx', 'CircleSlicerStation.jsx', 'PerimeterTracerStation.jsx'];
stations.forEach(file => {
  const srcPath = path.resolve('src/phases/simulate', file);
  if (fs.existsSync(srcPath)) {
    let content = fs.readFileSync(srcPath, 'utf8');
    content = content.replace("../../components/FeedbackOverlay.jsx", "../FeedbackOverlay.jsx");
    fs.writeFileSync(path.join(targetDir, file), content, 'utf8');
    console.log('Copied and updated ' + file);
  }
});
