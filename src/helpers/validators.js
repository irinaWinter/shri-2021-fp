import {
    useWith as _useWith,
    tap,
    allPass,
    anyPass,
    length,
    all,
    and,
    identity,
    filter,
    lte,
    gte,
    equals,
    pipe,
    prop,
    props,
    not,
    pipeK
} from "ramda";
import compose from "recompose/compose";

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

// Предикаты
const isGreen = (color) => color === 'green';
const isWhite = (color) => color === 'white';
const isRed = (color) => color === 'red';
const isBlue = (color) => color === 'blue';
const isOrange = (color) => color === 'orange';
const isOneColor = (color1, color2) => color1 === color2;

// Геттеры
const getStar = prop('star');
const getSquare = prop('square');
const getTriangle = prop('triangle');
const getCircle = prop('circle')
const getAllFigures = props(['star', 'square', 'triangle', 'circle'])

// Счетчики
const getCountedGreen = (colors) => length(filter(isGreen, colors))
const getCountedRed = (colors) => length(filter(isRed, colors))
const getCountedBlue = (colors) => length(filter(isBlue, colors))
const getCountedWhite = (colors) => length(filter(isWhite, colors))

//TODO 1. Красная звезда, зеленый квадрат, все остальные белые.
export const validateFieldN1 = ({ star, square, triangle, circle }) => allPass([
    lte(2, _useWith(getCountedGreen, [identity])([star, square, triangle, circle]))
])

// + 2. Как минимум две фигуры зеленые.
export const validateFieldN2 = compose(
    lte(2),
    getCountedGreen,
    getAllFigures
)

const log = (ste) => console.log(ste)

// 3. Количество красных фигур равно кол-ву синих.
export const validateFieldN3 = pipeK(
    equals,
    compose(getCountedRed, getAllFigures),
    compose(getCountedBlue, getAllFigures)
)

// 4. Синий круг, красная звезда, оранжевый квадрат
export const validateFieldN4 = ({ star, square, circle }) => {
    return isBlue(circle) && isRed(star) && isOrange(square);
};

// 5. Три фигуры одного любого цвета кроме белого (четыре фигуры одного цвета – это тоже true).
export const validateFieldN5 = ({ star, square, triangle, circle }) => gte(1, getCountedWhite([star, square, triangle, circle]));

// TODO 6. Две зеленые фигуры (одна из них треугольник), еще одна любая красная.
export const validateFieldN6 = ({ star, square, triangle, circle }) => allPass([]);

// + 7. Все фигуры оранжевые.
export const validateFieldN7 = compose(
    all(isOrange),
    getAllFigures
);

// + 8. Не красная и не белая звезда.
export const validateFieldN8 = compose(
    not,
    anyPass([isRed, isWhite]),
    getStar
)

// + 9. Все фигуры зеленые.
export const validateFieldN9 = compose(
    all(isGreen),
    getAllFigures
);

// 10. Треугольник и квадрат одного цвета (не белого)
export const validateFieldN10 = ({ square, triangle }) => and(isOneColor(square, triangle), !isWhite(square));
