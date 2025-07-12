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
import { allPass, all, propSatisfies, equals, pipe, values, filter, length, gte, __, countBy, identity, any, converge, prop } from "ramda";

const isRed = equals('red');
const isGreen = equals('green');
const isBlue = equals('blue');
const isWhite = equals('white');
const isOrange = equals('orange');

const isNotRed = (color) => color !== 'red';
const isNotWhite = (color) => color !== 'white';


// 1. Красная звезда, зеленый квадрат, все остальные белые.
export const validateFieldN1 = allPass([
  propSatisfies(isRed, 'star'),
  propSatisfies(isGreen, 'square'),
  propSatisfies(isWhite, 'circle'),
  propSatisfies(isWhite, 'triangle'),
])

// 2. Как минимум две фигуры зеленые.
export const validateFieldN2 = pipe(
  values,
  filter(isGreen),
  length,
  gte(__, 2)
)

// 3. Количество красных фигур равно кол-ву синих.
export const validateFieldN3 = converge(equals, [
  pipe(values, filter(isRed), length),
  pipe(values, filter(isBlue), length)
]);

// 4. Синий круг, красная звезда, оранжевый квадрат треугольник любого цвета
export const validateFieldN4 = allPass([
  propSatisfies(isBlue, 'circle'),
  propSatisfies(isRed, 'star'),
  propSatisfies(isOrange, 'square')
])

// 5. Три фигуры одного любого цвета кроме белого (четыре фигуры одного цвета – это тоже true).
export const validateFieldN5 = pipe(
  values,
  filter(isNotWhite),
  countBy(identity),
  values,
  any(gte(__, 3))
)

// 6. Ровно две зеленые фигуры (одна из зелёных – это треугольник), плюс одна красная. Четвёртая оставшаяся любого доступного цвета, но не нарушающая первые два условия
export const validateFieldN6 = allPass([
  pipe(values, countBy(identity), (counts) => (counts.green || 0) === 2),
  propSatisfies(isGreen, 'triangle'),
  pipe(values, countBy(identity), (counts) => (counts.red || 0) === 1)
])

// 7. Все фигуры оранжевые.
export const validateFieldN7 = pipe(
  values,
  all(isOrange)
)

// 8. Не красная и не белая звезда, остальные – любого цвета.
export const validateFieldN8 = allPass([
  propSatisfies(isNotRed, 'star'),
  propSatisfies(isNotWhite, 'star')
])

// 9. Все фигуры зеленые.
export const validateFieldN9 = pipe(
  values,
  all(isGreen)
)

// 10. Треугольник и квадрат одного цвета (не белого), остальные – любого цвета
export const validateFieldN10 = allPass([
  propSatisfies(isNotWhite, 'triangle'),
  propSatisfies(isNotWhite, 'square'),
  converge(equals, [prop('triangle'), prop('square')])
])