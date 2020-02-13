/* @flow */

import memoizeOne from 'memoize-one';

import classMethodDecorator from './_classMethodDecorator';

export const bind = classMethodDecorator((target, key, descriptor) => ({
    configurable: true,
    get() {
        const value = descriptor.value.bind(this);
        Object.defineProperty(this, key, { ...descriptor, value });
        return value;
    },

    set(value) {
        if (process.env.NODE_ENV !== 'test') {
            throw new Error('Unable to set new value to decorated method');
        }
        Object.defineProperty(this, key, { ...descriptor, value });
    },
}));

function debounceFunc(fn, delayMs) {
    const delay = (delayMs && delayMs > 0) ? delayMs : 0;
    let timeoutKey;
    return function wrapper(...args) {
        clearTimeout(timeoutKey);
        timeoutKey = setTimeout(() => fn.apply(this, args), delay);
    };
}

export function debounce(delay: number = 300) {
    return classMethodDecorator((target, key, descriptor) => ({
        ...descriptor,
        value: debounceFunc(descriptor.value, delay),
    }));
}

export function memoize(isEqual: ?Function) {
    return classMethodDecorator((target, key, descriptor) => ({
        ...descriptor,
        value: memoizeOne(descriptor.value, isEqual),
    }));
}
