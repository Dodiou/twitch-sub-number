const _ = require("lodash");

const bufferDebounce = (func, wait, options) => {
    let argsBuffer = [];
    const debouncedFunc = _.debounce(
        () => {
            func.call(undefined, argsBuffer);
            argsBuffer = [];
        },
        wait,
        options
    );
    return (...args) => {
        argsBuffer.push(...args);
        debouncedFunc();
    }
};
const bufferThrottle = (func, wait, options) => {
    let argsBuffer = [];
    const throttledFunc = _.throttle(
        () => {
            func.call(undefined, argsBuffer);
            argsBuffer = [];
        },
        wait,
        options
    );
    return (...args) => {
        argsBuffer.push(...args);
        throttledFunc();
    }
};

module.exports = {
    bufferDebounce,
    bufferThrottle,
}
