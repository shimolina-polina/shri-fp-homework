/**
 * @file Домашка по FP ч. 1
 *
 * Основная задача — написать самому, или найти в FP библиотеках функции anyPass/allPass
 * Эти функции/их аналоги есть и в ramda и в lodash
 *
 * allPass — принимает массив функций-предикатов, и возвращает функцию-предикат, которая
 * вернет true для заданного списка аргументов, если каждый из предоставленных предикатов
 * удовлетворяет этим аргументам (возвращает true)
 *
 * anyPass — то же самое, только удовлетворять значению может единственная функция-предикат из массива.
 *
 * Если какие либо функции написаны руками (без использования библиотек) это не является ошибкой
 */

const allPass =
  (predicates) =>
  (...args) =>
    predicates.every((predicate) => predicate(...args));

const anyPass =
  (predicates) =>
  (...args) =>
    predicates.some((predicate) => predicate(...args));

const not =
  (predicate) =>
  (...args) =>
    !predicate(...args);

const isRed = (color) => color === "red";
const isGreen = (color) => color === "green";
const isWhite = (color) => color === "white";
const isBlue = (color) => color === "blue";
const isOrange = (color) => color === "orange";

const isNotWhite = not(isWhite);

const countWhere = (predicate) => (shapes) =>
  Object.values(shapes).filter(predicate).length;

const countRed = countWhere(isRed);
const countGreen = countWhere(isGreen);
const countBlue = countWhere(isBlue);

// 1. Красная звезда, зеленый квадрат, все остальные белые.

export const validateFieldN1 = allPass([
  ({ star }) => isRed(star),
  ({ square }) => isGreen(square),
  ({ triangle }) => isWhite(triangle),
  ({ circle }) => isWhite(circle),
]);

// 2. Как минимум две фигуры зеленые.
const hasAtLeastTwoGreens = (shapes) => countGreen(shapes) >= 2;

export const validateFieldN2 = hasAtLeastTwoGreens;

// 3. Количество красных фигур равно кол-ву синих.
const hasEqualBlueAndRed = (shapes) => countRed(shapes) === countBlue(shapes);

export const validateFieldN3 = hasEqualBlueAndRed;

// 4. Синий круг, красная звезда, оранжевый квадрат треугольник любого цвета
export const validateFieldN4 = allPass([
  ({ star }) => isRed(star),
  ({ square }) => isOrange(square),
  ({ circle }) => isBlue(circle),
]);

// 5. Три фигуры одного любого цвета кроме белого (четыре фигуры одного цвета – это тоже true).
const countColorCounts = (shapes) => {
  const counts = {};
  for (const color of Object.values(shapes)) {
    if (isNotWhite(color)) {
      counts[color] = (counts[color] || 0) + 1;
    }
  }
  return counts;
};

const hasColorWithMinCount = (min) => (colorCounts) =>
  Object.values(colorCounts).some((count) => count >= min);

export const validateFieldN5 = (shapes) =>
  hasColorWithMinCount(3)(countColorCounts(shapes));

// 6. Ровно две зеленые фигуры (одна из зелёных – это треугольник), плюс одна красная. Четвёртая оставшаяся любого доступного цвета, но не нарушающая первые два условия
const hasTwoGreen = (shapes) => countGreen(shapes) === 2;
const hasOneRed = (shapes) => countRed(shapes) === 1;
export const validateFieldN6 = allPass([
  hasTwoGreen,
  hasOneRed,
  ({ triangle }) => isGreen(triangle),
]);

// 7. Все фигуры оранжевые.
export const validateFieldN7 = allPass([
  ({ star }) => isOrange(star),
  ({ square }) => isOrange(square),
  ({ triangle }) => isOrange(triangle),
  ({ circle }) => isOrange(circle),
]);

// 8. Не красная и не белая звезда, остальные – любого цвета.
const isNotRedAndNotWhite = allPass([not(isRed), not(isWhite)]);

export const validateFieldN8 = ({ star }) => isNotRedAndNotWhite(star);

// 9. Все фигуры зеленые.
export const validateFieldN9 = allPass([
  ({ star }) => isGreen(star),
  ({ square }) => isGreen(square),
  ({ triangle }) => isGreen(triangle),
  ({ circle }) => isGreen(circle),
]);

// 10. Треугольник и квадрат одного цвета (не белого), остальные – любого цвета
const areSameColor = (color1, color2) => color1 === color2;

export const validateFieldN10 = allPass([
  ({ square }) => isNotWhite(square),
  ({ triangle }) => isNotWhite(triangle),
  ({ square, triangle }) => areSameColor(square, triangle),
]);
