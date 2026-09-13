/**
 * Grade 6 Circle Math Formulas
 * Supports pi = 3.14 or pi = 22/7
 */

export function parsePi(piMode) {
  if (piMode === '22/7') return 22 / 7;
  return 3.14;
}

export function formatNumber(num) {
  if (Number.isInteger(num)) return num.toString();
  return Math.round(num * 100) / 100;
}

export function calcDiameter(radius) {
  return radius * 2;
}

export function calcRadius(diameter) {
  return diameter / 2;
}

export function calcCircumference(radius, piMode = '3.14') {
  const pi = parsePi(piMode);
  return 2 * pi * radius;
}

export function calcCircleArea(radius, piMode = '3.14') {
  const pi = parsePi(piMode);
  return pi * radius * radius;
}

export function calcSemicircleArea(radius, piMode = '3.14') {
  return calcCircleArea(radius, piMode) / 2;
}

export function calcSemicircleArc(radius, piMode = '3.14') {
  const pi = parsePi(piMode);
  return pi * radius;
}

export function calcSemicirclePerimeter(radius, piMode = '3.14') {
  return calcSemicircleArc(radius, piMode) + 2 * radius;
}

export function calcQuarterCircleArea(radius, piMode = '3.14') {
  return calcCircleArea(radius, piMode) / 4;
}

export function calcQuarterCircleArc(radius, piMode = '3.14') {
  const pi = parsePi(piMode);
  return (pi * radius) / 2;
}

export function calcQuarterCirclePerimeter(radius, piMode = '3.14') {
  return calcQuarterCircleArc(radius, piMode) + 2 * radius;
}

export function calcCompositeAreaAdd(baseArea, circlePartArea) {
  return baseArea + circlePartArea;
}

export function calcCompositeAreaSubtract(baseArea, circlePartArea) {
  return baseArea - circlePartArea;
}

export function calcCompositePerimeter(straightEdges = [], curvedArcs = []) {
  const sumStraight = straightEdges.reduce((sum, val) => sum + val, 0);
  const sumCurved = curvedArcs.reduce((sum, val) => sum + val, 0);
  return sumStraight + sumCurved;
}
