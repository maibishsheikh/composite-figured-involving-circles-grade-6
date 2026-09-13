// Mulberry32 PRNG
export function createSeededRng(seed) {
  let s = seed ^ 0xDEADBEEF;
  return function() {
    let t = (s += 0x6D2B79F5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function randomChoice(arr, rng) {
  return arr[Math.floor(rng() * arr.length)];
}

export function randomInt(min, max, rng) {
  return Math.floor(rng() * (max - min + 1)) + min;
}
