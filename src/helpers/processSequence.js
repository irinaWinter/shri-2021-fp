import {
    compose,
    curry,
    tap,
    prop,
    tryCatch,
    apply,
    lt,
    allPass,
    gt,
    length,
    ifElse,
    andThen,
    otherwise,
    pick,
    composeP
} from 'ramda';
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
import Api from '../tools/api';

const api = new Api();

/**
 * Я – пример, удали меня
 */
const wait = time => new Promise(resolve => {
    setTimeout(resolve, time);
})

const processSequence1 = ({ value, writeLog, handleSuccess, handleError }) => {
    /**
     * Я – пример, удали меня
     */
    writeLog(value);

    api.get(`https://api.tech/numbers/base`, { from: 10, to: 2, number: value }).then(({ result }) => {
        writeLog(result);
    });

    // wait(2500).then(() => {
    //     writeLog('SecondLog')

    //     return wait(1500);
    // }).then(() => {
    //     writeLog('ThirdLog');

    //     return wait(400);
    // }).then(() => {
    //     handleSuccess('Done');
    // });
}

const log = (str) => {
    console.log(str)
}

// const logErrorMessage = () => console.log('error');

// const createSafeFunction = (fn) => tryCatch(fn, logErrorMessage);

// const readValueSafe = (fn) => createSafeFunction(fn);


const processSequence = ({ value, writeLog, handleSuccess, handleError }) => {
    const getValue = () => value;
    const toNumber = (str) => +str;
    const isLengthLtTen = compose(gt(10), length)
    const isLengthGtTwo = compose(lt(2), length);
    const isGtZero = lt(0)
    const roundNumber = (number) => Math.round(number);

    const convertToBinary = (number) => api.get(`https://api.tech/numbers/base`, { from: 10, to: 2, number: number })
        .then(({ result }) => writeLog(result));


    // const g = () => {
    //     .then(({ result }) => {
    //         writeLog(result);
    //     });
    // }

    const isValidValue = allPass([
        isLengthGtTwo,
        isLengthLtTen,
        isGtZero,
    ]);

    const getErrorMessage = () => 'ValidationError';
    const getSuccessMessage = () => 'Done';

    const validateValue = ifElse(
        isValidValue,
        compose(handleSuccess, getSuccessMessage),
        compose(handleError, getErrorMessage),
    )


    const app = compose(

        convertToBinary,
        roundNumber,
        toNumber,
        getValue,
        writeLog,
        roundNumber,
        toNumber,
        getValue,
        validateValue,
        getValue,
        writeLog,

    );
    app(value)
}

export default processSequence;
