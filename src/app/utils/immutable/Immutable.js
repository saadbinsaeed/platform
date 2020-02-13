/* @flow */

import deepFreeze from 'deep-freeze';
import deepMerge from 'deepmerge';
import { isDev } from 'app/utils/env';
import { set as loSet } from 'app/utils/lo/lo';

/*
 * Constructors
 */

/**
 * Freezes the passed value (recursively).
 *
 * @param value the value to freeze.
 * @return the frozen value.
 */

if (isDev) {
    console.log('DEVELOPMENT MODE ENABLED'); // eslint-disable-line no-console
}

const Immutable = (value: any) => {
    if (!isDev || value === null || value === undefined) {
        return value;
    }
    return deepFreeze(value);
};

/**
 * Returns a frozen array.
 *
 * @param array the array to freeze.
 * @return if an array is passed the frozen array otherwise an empty frozen array.
 */
const List = (array: ?any[]) => {
    if (!array) {
        return Immutable([]);
    }
    if (!Array.isArray(array)) {
        throw new Error('the argument is not an array');
    }
    return Immutable(array);
};

/*
 * Object Modifier
 */

/**
 * Returns an immutable object that it is the merge of the passed objects
 *
 * @param objects the objects to merge
 * @return an immutable object
 */
const merge = (a: Object, b: Object, options?: Object) => {
    return Immutable(deepMerge(a, b, options));
};

/*
 * Array Modifier
 */

/**
 * @private
 * Freezes the passed value (not recursively).
 *
 * @param value the value to freeze.
 * @return the frozen value.
 */
const _freeze = (value: any) => {
    if (!isDev) {
        return value;
    }
    return Object.freeze(value);
};

/**
 * @private
 * un-freeze (clone) the passed array (not recursively).
 *
 * @param array the array to thaw.
 * @return the thawed array.
 */
const _thawArray = (array: any[]): any[] => {
    return [ ...array ];
};

const _arrayApply = (array: any[], methodName: string, ...args) => {
    if (!array || !Array.isArray(array)) {
        throw new Error('The first arguments must be an array.');
    }
    const next = _thawArray(array);
    // $FlowFixMe
    next[methodName](...args);
    return _freeze(next);
};


const push = (array: any[], ...args: any) => { return _arrayApply(array, 'push', ...args); };
const pop = (array: any[], ...args: any) => { return _arrayApply(array, 'pop', ...args); };
const shift = (array: any[], ...args: any) => { return _arrayApply(array, 'shift', ...args); };
const unshift = (array: any[], ...args: any) => { return _arrayApply(array, 'unshift', ...args); };
const reverse = (array: any[], ...args: any) => { return _arrayApply(array, 'reverse', ...args); };
const sort = (array: any[], ...args: any) => { return _arrayApply(array, 'sort', ...args); };
const splice = (array: any[], ...args: any) => { return _arrayApply(array, 'splice', ...args); };

/*
 * Immutability Test
 */

/**
 * @private
 *
 * Recursive method used by the public isImmutable method to deeply check the immutability of an object.
 *
 * @param o the object to test.
 * @param recursivityCounter number of recursion.
 *
 * @throw the error 'The object is too deep or there is a cycle' if the number of recursion is greater than 100.
 */
const _isImmutable = (o: Object, recursivityCounter: number) => {
    if (recursivityCounter > 100) {
        throw new Error('The object is too deep or there is a cycle');
    }
    const properties = Object.getOwnPropertyNames(o).filter((prop) => {
        // eslint-disable-next-line no-prototype-builtins
        return o.hasOwnProperty(prop) && o[prop] !== null && (typeof o[prop] === 'object' || typeof o[prop] === 'function');
    });
    const oneIsMutable = properties.find( ( prop ) => {
        return !Object.isFrozen(o[prop]) || !_isImmutable(o[prop], recursivityCounter + 1);
    });
    return !oneIsMutable;
};


/**
 * Checks if an object is immutable.
 *
 * @param object the object to test.
 * @param recursive if true do a deep test, otherwise do a shallow test.
 * @return true if the object is immutable, false otherwise.
 */
const isImmutable = (object: Object, recursive: boolean) => {
    if (!isDev) {
        return true;
    }
    if (!recursive) {
        return Object.isFrozen(object);
    }
    return Object.isFrozen(object) && _isImmutable(object, 0);
};

const set = (object: ?Object, fieldPath: string, value: any) => {
    return Immutable(loSet(object, fieldPath, value));
};

export default Immutable;
export { List, merge, push, pop, shift, unshift, reverse, sort, splice, set, isImmutable };
