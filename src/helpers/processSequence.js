/**
 * @file Домашка по FP ч. 2
 *
 * Подсказки:
 * Метод get у инстанса Api – каррированый
 * GET / https://animals.tech/{id}
 *
 * GET / https://api.tech/numbers/base
 * params:
 * – number [Int] – число
 * – from [Int] – из какой системы счисления
 * – to [Int] – в какую систему счисления
 *
 * Иногда промисы от API будут приходить в состояние rejected, (прямо как и API в реальной жизни)
 * Ответ будет приходить в поле {result}
 */
import {
  allPass,
  pipe,
  length,
  gte,
  lte,
  __,
  gt,
  test,
  multiply,
  modulo,
  ifElse,
  prop,
  converge,
  identity,
} from "ramda";
import Api from "../tools/api";

const api = new Api();

const isPositive = gt(__, 0);
const isValidFormat = test(/^[0-9]+\.?[0-9]*$/);

const isNumValid = allPass([
  pipe(length, gte(__, 3)),
  pipe(length, lte(__, 9)),
  pipe(Number, isPositive),
  isValidFormat,
]);

const roundNumber = pipe(Number, Math.round);
const extractResult = prop("result");
const calculateSquareLength = converge(multiply, [identity, identity]);
const calculateRemainder = modulo(__, 3);

const logAndGoOn = (writeLog) => (value) => {
  writeLog(value);
  return value;
};

const asyncPipe =
  (...fns) =>
  async (value) => {
    return fns.reduce(async (acc, fn) => {
      const result = await acc;
      return result.isLeft ? result : await result.chain(fn);
    }, Either.Right(value));
  };

const Either = {
  Left: (value) => ({
    isLeft: true,
    isRight: false,
    value,
    map: () => Either.Left(value),
    chain: () => Either.Left(value),
    fold: (leftFn, _) => leftFn(value),
  }),
  Right: (value) => ({
    isLeft: false,
    isRight: true,
    value,
    map: (fn) => Either.Right(fn(value)),
    chain: async (fn) => {
      const result = await fn(value);
      return result && result.isLeft !== undefined
        ? result
        : Either.Right(result);
    },
    fold: (_, rightFn) => rightFn(value),
  }),
};

const validateStr = ifElse(isNumValid, Either.Right, () =>
  Either.Left("ValidationError")
);

const safeApiCall = async (apiCall) => {
  try {
    const result = await apiCall();
    return Either.Right(result);
  } catch (error) {
    return Either.Left(error);
  }
};

const getBinaryNumber = (number) =>
  api.get("https://api.tech/numbers/base", { from: 10, to: 2, number });

const getAnimal = (id) => api.get(`https://animals.tech/${id}`, {});

const processSequence = async ({
  value,
  writeLog,
  handleSuccess,
  handleError,
}) => {
  const log = logAndGoOn(writeLog);

  const result = await asyncPipe(
    log,
    validateStr,
    roundNumber,
    log,
    async (number) => safeApiCall(() => getBinaryNumber(number)),
    extractResult,
    log,
    length,
    log,
    
    calculateSquareLength,
    log,
    calculateRemainder,
    log,
    async (remainder) => safeApiCall(() => getAnimal(remainder)),
    extractResult,
  )(value);

  return result.fold(handleError, handleSuccess);
};

export default processSequence;
