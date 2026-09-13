import {
  calcDiameter,
  calcRadius,
  calcCircumference,
  calcCircleArea,
  calcSemicircleArea,
  calcSemicirclePerimeter,
  calcQuarterCircleArea,
  calcQuarterCirclePerimeter,
  calcCompositeAreaAdd,
  calcCompositeAreaSubtract,
  calcCompositePerimeter,
  formatNumber
} from '../geometry/formulas.js';
import { randomChoice, randomInt } from '../rng/seededRng.js';

const WESTERN_NAMES = ['Oliver', 'Maya', 'Leo', 'Emma', 'Sam', 'Lucas', 'Sophia', 'Ethan', 'Chloe', 'Liam'];

export const QUESTION_TEMPLATES = [
  // 1. Radius & Diameter Facts
  {
    id: 'radius-diameter-fact',
    worlds: [1],
    generate: (rng) => {
      const name = randomChoice(WESTERN_NAMES, rng);
      const isFindingDiameter = rng() > 0.5;
      const val = randomInt(3, 25, rng);
      
      if (isFindingDiameter) {
        const r = val;
        const correct = calcDiameter(r);
        const distractors = [r + 2, Math.max(1, r - 2), r * 4].filter(d => d !== correct);
        
        return {
          prompt: `${name} measured a circular clock face with a radius of ${r} cm. What is its diameter?`,
          options: shuffle([`${correct} cm`, `${distractors[0]} cm`, `${distractors[1]} cm`, `${distractors[2]} cm`], rng),
          correctAnswer: `${correct} cm`,
          explanation: `Diameter is double the radius! d = 2 × r = 2 × ${r} = ${correct} cm.`,
          hint: `Remember that diameter = 2 × radius.`,
          visual: 'circle',
          radius: r
        };
      } else {
        const d = val * 2;
        const correct = calcRadius(d);
        const distractors = [d, d + 2, Math.max(1, correct - 2)].filter(d => d !== correct);
        
        return {
          prompt: `${name} has a round tabletop with a diameter of ${d} cm. What is its radius?`,
          options: shuffle([`${correct} cm`, `${distractors[0]} cm`, `${distractors[1]} cm`, `${distractors[2]} cm`], rng),
          correctAnswer: `${correct} cm`,
          explanation: `Radius is half the diameter! r = d ÷ 2 = ${d} ÷ 2 = ${correct} cm.`,
          hint: `Remember that radius = diameter ÷ 2.`,
          visual: 'circle',
          radius: correct
        };
      }
    }
  },

  // 2. Full Circle Circumference
  {
    id: 'circumference-full',
    worlds: [1, 8],
    generate: (rng) => {
      const name = randomChoice(WESTERN_NAMES, rng);
      const useFractionPi = rng() > 0.5;
      const piMode = useFractionPi ? '22/7' : '3.14';
      
      const r = useFractionPi ? randomChoice([7, 14, 21, 28], rng) : randomChoice([5, 10, 15, 20], rng);
      const correct = calcCircumference(r, piMode);
      const formattedCorrect = formatNumber(correct);
      
      // Common mistakes: area instead of circumference, or forgetting factor of 2
      const mistake1 = formatNumber(r * (useFractionPi ? 22/7 : 3.14)); // pi * r
      const mistake2 = formatNumber(calcCircleArea(r, piMode)); // pi * r^2
      const mistake3 = formatNumber(correct * 2);

      return {
        prompt: `${name} is wrapping a ribbon around a circular rug with radius ${r} m. (Use π = ${piMode}). What is the circumference?`,
        options: shuffle([`${formattedCorrect} m`, `${mistake1} m`, `${mistake2} m`, `${mistake3} m`], rng),
        correctAnswer: `${formattedCorrect} m`,
        explanation: `Circumference C = 2 × π × r = 2 × ${piMode} × ${r} = ${formattedCorrect} m.`,
        hint: `Use the formula C = 2 × π × r.`,
        visual: 'circle',
        radius: r
      };
    }
  },

  // 3. Full Circle Area
  {
    id: 'area-full-circle',
    worlds: [2, 8],
    generate: (rng) => {
      const name = randomChoice(WESTERN_NAMES, rng);
      const useFractionPi = rng() > 0.5;
      const piMode = useFractionPi ? '22/7' : '3.14';
      
      const r = useFractionPi ? randomChoice([7, 14, 21], rng) : randomChoice([4, 5, 10, 12], rng);
      const correct = calcCircleArea(r, piMode);
      const formattedCorrect = formatNumber(correct);
      
      // Mistakes: 2*pi*r, pi*d, or r*2 instead of r^2
      const mistake1 = formatNumber(calcCircumference(r, piMode));
      const mistake2 = formatNumber((useFractionPi ? 22/7 : 3.14) * r * 2);
      const mistake3 = formatNumber(correct / 2);

      return {
        prompt: `${name} is painting a circular target with a radius of ${r} cm. (Use π = ${piMode}). What is the area of the circle?`,
        options: shuffle([`${formattedCorrect} cm²`, `${mistake1} cm²`, `${mistake2} cm²`, `${mistake3} cm²`], rng),
        correctAnswer: `${formattedCorrect} cm²`,
        explanation: `Area A = π × r² = ${piMode} × ${r}² = ${formattedCorrect} cm².`,
        hint: `Area formula is A = π × r × r.`,
        visual: 'circle',
        radius: r
      };
    }
  },

  // 4. Semicircle Measures
  {
    id: 'semicircle-measure',
    worlds: [3],
    generate: (rng) => {
      const name = randomChoice(WESTERN_NAMES, rng);
      const isArea = rng() > 0.5;
      const piMode = '3.14';
      const r = randomChoice([6, 8, 10, 12], rng);

      if (isArea) {
        const correct = formatNumber(calcSemicircleArea(r, piMode));
        const fullArea = formatNumber(calcCircleArea(r, piMode));
        const mistake1 = formatNumber(calcSemicirclePerimeter(r, piMode));
        const mistake2 = formatNumber(correct / 2);

        return {
          prompt: `${name} cut a circular watermelon in half. If the radius is ${r} cm, what is the area of one semicircle slice? (Use π = 3.14)`,
          options: shuffle([`${correct} cm²`, `${fullArea} cm²`, `${mistake1} cm²`, `${mistake2} cm²`], rng),
          correctAnswer: `${correct} cm²`,
          explanation: `Semicircle Area = ½ × π × r² = ½ × 3.14 × ${r}² = ${correct} cm².`,
          hint: `Semicircle area is half of the full circle area!`,
          visual: 'semicircle',
          radius: r
        };
      } else {
        const correct = formatNumber(calcSemicirclePerimeter(r, piMode));
        const arcOnly = formatNumber(r * 3.14);
        const fullC = formatNumber(calcCircumference(r, piMode));
        const mistake = formatNumber(correct - 2);

        return {
          prompt: `${name} built a semicircular garden bed with radius ${r} m. What is the total perimeter around the garden (arc + straight base)? (Use π = 3.14)`,
          options: shuffle([`${correct} m`, `${arcOnly} m`, `${fullC} m`, `${mistake} m`], rng),
          correctAnswer: `${correct} m`,
          explanation: `Semicircle Perimeter = Arc (π × r) + Base Diameter (2 × r) = (3.14 × ${r}) + (2 × ${r}) = ${correct} m.`,
          hint: `Don't forget to add the straight diameter edge to the curved arc!`,
          visual: 'semicircle',
          radius: r
        };
      }
    }
  },

  // 5. Quarter Circle Measures
  {
    id: 'quarter-circle-measure',
    worlds: [4],
    generate: (rng) => {
      const name = randomChoice(WESTERN_NAMES, rng);
      const isArea = rng() > 0.5;
      const piMode = '3.14';
      const r = randomChoice([4, 8, 10, 20], rng);

      if (isArea) {
        const correct = formatNumber(calcQuarterCircleArea(r, piMode));
        const fullArea = formatNumber(calcCircleArea(r, piMode));
        const semiArea = formatNumber(calcSemicircleArea(r, piMode));
        const mistake = formatNumber(correct * 1.5);

        return {
          prompt: `${name} ate 1 quarter slice of a round pizza with radius ${r} cm. What is the area of that quarter slice? (Use π = 3.14)`,
          options: shuffle([`${correct} cm²`, `${fullArea} cm²`, `${semiArea} cm²`, `${mistake} cm²`], rng),
          correctAnswer: `${correct} cm²`,
          explanation: `Quarter Circle Area = ¼ × π × r² = ¼ × 3.14 × ${r}² = ${correct} cm².`,
          hint: `Divide full circle area by 4.`,
          visual: 'quarter',
          radius: r
        };
      } else {
        const correct = formatNumber(calcQuarterCirclePerimeter(r, piMode));
        const arcOnly = formatNumber((3.14 * r) / 2);
        const mistake1 = formatNumber(correct - r);
        const mistake2 = formatNumber(correct + 4);

        return {
          prompt: `${name} outlined a quarter-circle fan with radius ${r} cm. What is its perimeter (curved arc + 2 straight radii)? (Use π = 3.14)`,
          options: shuffle([`${correct} cm`, `${arcOnly} cm`, `${mistake1} cm`, `${mistake2} cm`], rng),
          correctAnswer: `${correct} cm`,
          explanation: `Quarter Circle Perimeter = Arc (½ × π × r) + 2 × r = (½ × 3.14 × ${r}) + (2 × ${r}) = ${correct} cm.`,
          hint: `Perimeter = curved arc + radius + radius.`,
          visual: 'quarter',
          radius: r
        };
      }
    }
  },

  // 6. Composite Area (Addition)
  {
    id: 'composite-area-add',
    worlds: [5],
    generate: (rng) => {
      const name = randomChoice(WESTERN_NAMES, rng);
      const rectL = randomChoice([10, 14, 20], rng);
      const rectW = randomChoice([7, 14, 21], rng); // r = rectW / 2
      const r = rectW / 2;
      const piMode = '22/7';

      const rectArea = rectL * rectW;
      const semiArea = calcSemicircleArea(r, piMode);
      const totalArea = formatNumber(calcCompositeAreaAdd(rectArea, semiArea));

      const mistake1 = formatNumber(rectArea + calcCircleArea(r, piMode)); // full circle instead of semi
      const mistake2 = formatNumber(rectArea); // forgot semicircle
      const mistake3 = formatNumber(totalArea - 10);

      return {
        prompt: `${name} designed a stage shaped like a rectangle (${rectL} m by ${rectW} m) with a semicircle attached to one side (radius = ${r} m). What is the total area? (Use π = 22/7)`,
        options: shuffle([`${totalArea} m²`, `${mistake1} m²`, `${mistake2} m²`, `${mistake3} m²`], rng),
        correctAnswer: `${totalArea} m²`,
        explanation: `Total Area = Rectangle Area (${rectL}×${rectW} = ${rectArea}) + Semicircle Area (½ × 22/7 × ${r}² = ${formatNumber(semiArea)}) = ${totalArea} m².`,
        hint: `Split the figure into a rectangle and a semicircle, then add their areas!`,
        visual: 'composite-add',
        length: rectL,
        width: rectW,
        radius: r
      };
    }
  },

  // 7. Composite Area (Subtraction)
  {
    id: 'composite-area-subtract',
    worlds: [6],
    generate: (rng) => {
      const name = randomChoice(WESTERN_NAMES, rng);
      const squareSide = randomChoice([14, 20, 28], rng);
      const r = squareSide / 2;
      const piMode = '22/7';

      const squareArea = squareSide * squareSide;
      const circleArea = calcCircleArea(r, piMode);
      const totalArea = formatNumber(calcCompositeAreaSubtract(squareArea, circleArea));

      const mistake1 = formatNumber(squareArea + circleArea); // added instead of subtracted
      const mistake2 = formatNumber(squareArea - calcSemicircleArea(r, piMode));
      const mistake3 = formatNumber(circleArea);

      return {
        prompt: `${name} cut a circular coin cutout of radius ${r} cm out of a square metal plate (${squareSide} cm by ${squareSide} cm). What is the remaining area? (Use π = 22/7)`,
        options: shuffle([`${totalArea} cm²`, `${mistake1} cm²`, `${mistake2} cm²`, `${mistake3} cm²`], rng),
        correctAnswer: `${totalArea} cm²`,
        explanation: `Remaining Area = Square Area (${squareSide}×${squareSide} = ${squareArea}) − Circle Area (22/7 × ${r}² = ${formatNumber(circleArea)}) = ${totalArea} cm².`,
        hint: `Subtract the area of the circle from the total square area!`,
        visual: 'composite-subtract',
        length: squareSide,
        width: squareSide,
        radius: r
      };
    }
  },

  // 8. Composite Perimeter (No double counting)
  {
    id: 'composite-perimeter',
    worlds: [7],
    generate: (rng) => {
      const name = randomChoice(WESTERN_NAMES, rng);
      const straightL = randomChoice([30, 40, 50], rng);
      const r = randomChoice([7, 14, 21], rng);
      const piMode = '22/7';

      // Track: 2 straight sides + 2 semicircles (= 1 full circumference)
      const fullC = calcCircumference(r, piMode);
      const totalPerimeter = formatNumber(calcCompositePerimeter([straightL, straightL], [fullC]));

      // Mistake: including internal join diameter edges (double counting trap!)
      const doubleCountMistake = formatNumber(totalPerimeter + 4 * r);
      const mistake2 = formatNumber(straightL * 2 + fullC / 2);
      const mistake3 = formatNumber(totalPerimeter - 20);

      return {
        prompt: `${name} is running around a track shaped like a rectangle with two semicircular ends. The straight sides are ${straightL} m long and the semicircles have radius ${r} m. What is the outer perimeter? (Use π = 22/7)`,
        options: shuffle([`${totalPerimeter} m`, `${doubleCountMistake} m`, `${mistake2} m`, `${mistake3} m`], rng),
        correctAnswer: `${totalPerimeter} m`,
        explanation: `Outer Perimeter = 2 Straight Sides (${straightL} + ${straightL}) + Full Circumference (2 × 22/7 × ${r} = ${formatNumber(fullC)}) = ${totalPerimeter} m. (Do NOT add inner join edges!)`,
        hint: `Only sum outer straight sides and outer curves. Never count internal joining lines!`,
        visual: 'composite-track',
        length: straightL,
        radius: r
      };
    }
  },

  // 9. Pi Choice Check
  {
    id: 'pi-choice-check',
    worlds: [8],
    generate: (rng) => {
      const name = randomChoice(WESTERN_NAMES, rng);
      const radius = randomChoice([14, 28, 35, 42], rng);
      
      return {
        prompt: `${name} needs to calculate the circumference of a circular clock tower dial with radius ${radius} cm. Which value of π is most efficient for mental calculation?`,
        options: shuffle(['22/7 because 14 is a multiple of 7', '3.14 because it is always used', '3.14159 to 5 decimals', 'None of the above'], rng),
        correctAnswer: '22/7 because 14 is a multiple of 7',
        explanation: `When radius or diameter is a multiple of 7 (like ${radius}), using π = 22/7 allows 7 to simplify easily!`,
        hint: `Check if ${radius} can be divided cleanly by 7.`,
        visual: 'circle',
        radius: radius
      };
    }
  },

  // 10. Multi-step Word Problems
  {
    id: 'word-problem',
    worlds: [9, 10],
    generate: (rng) => {
      const name = randomChoice(WESTERN_NAMES, rng);
      const trackL = randomChoice([20, 30, 40], rng);
      const trackW = randomChoice([14, 28], rng);
      const r = trackW / 2;
      const piMode = '22/7';

      const rectArea = trackL * trackW;
      const circleArea = calcCircleArea(r, piMode);
      const totalArea = formatNumber(rectArea + circleArea);

      const mistake1 = formatNumber(rectArea + circleArea / 2);
      const mistake2 = formatNumber(rectArea);
      const mistake3 = formatNumber(totalArea + 50);

      return {
        prompt: `${name} is putting artificial turf on a sports field shaped like a central rectangle (${trackL} m × ${trackW} m) plus two semicircular goal areas at the ends (radius = ${r} m). How many square meters of turf are needed in total? (Use π = 22/7)`,
        options: shuffle([`${totalArea} m²`, `${mistake1} m²`, `${mistake2} m²`, `${mistake3} m²`], rng),
        correctAnswer: `${totalArea} m²`,
        explanation: `1. Area of rectangle = ${trackL} × ${trackW} = ${rectArea} m². 2. Two semicircles combine to 1 full circle area = 22/7 × ${r}² = ${formatNumber(circleArea)} m². 3. Total Turf Area = ${rectArea} + ${formatNumber(circleArea)} = ${totalArea} m².`,
        hint: `Step 1: Find rectangle area. Step 2: Combine the two semicircles into 1 circle area. Step 3: Add them together!`,
        visual: 'composite-track',
        length: trackL,
        width: trackW,
        radius: r
      };
    }
  }
];

function shuffle(array, rng) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
