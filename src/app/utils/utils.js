/* @flow */

import { get, set } from 'app/utils/lo/lo';

import fastDeepEqual from 'fast-deep-equal';


/**
 * Creates and returns a new debounced version of the passed function.
 * The returned function will postpone its execution when
 * the specified delay is elapsed since the last time it was invoked.
 *
 * @param func the function to debounce.
 * @param dealy the debounce delay in milliseconds.
 */
const debounce = (func: Function, delay: number) => {
    let timeout;
    return (...args: Array<any> ) => {
        timeout && clearTimeout(timeout);
        timeout = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
};

const isDefined = (value: ? any) => value !== null && value !== undefined;

const isObject = (value: ? any) => value && typeof value === 'object' && !Array.isArray(value);

const isBoolean = (value: ? any) => 'boolean' === typeof value;

const isEmptyArray = (array: Array<any> ) => Array.isArray(array) && array.length === 0;
const isEmptyObject = (object: Object) => Object.keys(object).length === 0;

const isEmpty = (value: ?Object | ?Array<any> ) => !value || (Array.isArray(value) ? isEmptyArray(value) : isEmptyObject(value));

const hasOneOf = (set: Set<any> , values: Array<any> ) => values.some(value => set.has(value)); // eslint-disable-line no-shadow

/**
 * Creates an object composed of the picked object properties.
 *
 * @param object The source object.
 * @param fields The property paths to pick.
 * @return the created object.
 */
const pick = (object: Object, fields: Array<string> ) => !object ? {} : fields.reduce((acc, field) => set(acc, field, get(object, field)), {});

/**
 * Performs a shallow equals between the two specified objects.
 * If the fields parameter is specified the equality will be chacked only on the specified fields.
 *
 * @param objA the first object to compare.
 * @param objB the second object to compare.
 * @param fields (optional) the fields to check.
 *
 * @return true if the shallow equality procedure does not find any difference.
 */
const shallowEquals = (objA: Object, objB: Object, fields: ? Array<string> ) => {
    if (!objA && !objB) {
        return true;
    }
    if (!objA || !objB) {
        return false;
    }
    const keys = fields || Object.keys(objA);
    if (!fields && keys.length !== Object.keys(objB).length) {
        return false;
    }
    return !keys.some(key => get(objA, key) !== get(objB, key));
};

const deepEquals = (obj1: Object, obj2: Object): boolean => fastDeepEqual(obj1, obj2);

const capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Safe way to cast a value as string. If the value is not defined null will be returned.
 *
 * @param value The value to cast.
 * @return the value as string on null.
 */
const stringify = (value: ?mixed): ?string => isDefined(value) ? String(value) : null;


/**
 * Safe way to cast a value as number. If the value is not defined or it does not represent a number null will be returned.
 *
 * @param value The value to cast.
 * @return the value as number or null.
 */
const numberify = (value: ?mixed): ?number => {
    const num = isDefined(value) ? Number(value) : null;
    return Number.isNaN(num) ? 0 : num;
};

/**
 * Safe way to cast a value as array. If the value is not defined null will be returned.
 *
 * @param value The value to cast.
 * @return the value as array or null.
 */
const arrayfy = (value: ?mixed): ?any[] => {
    if (!isDefined(value)) {
        return null;
    }
    return Array.isArray(value) ? value : [ value ];
};

/**
 * Safe way to cast a value as date. If the value is not defined null will be returned.
 *
 * @param value The value to cast.
 * @return the value as date or null.
 */
const datefy = (value: ?mixed): ?Date => {
    if (value instanceof Date) {
        return value;
    }
    if (typeof value === 'string' || typeof value === 'number') {
        return new Date(value);
    }
    return null;
};

const sortAscending = (list: Array<Object>, field: string): Array<Object> => {
    const data = list ? list.slice() : [];
    return data.sort((firstObj: Object, secondObj: Object): number => {
        const firstObjLabel = firstObj[field] && firstObj[field].toUpperCase();
        const secondObjLabel = secondObj[field] && secondObj[field].toUpperCase();
        if (firstObjLabel < secondObjLabel) {
            return -1;
        }
        if (firstObjLabel > secondObjLabel) {
            return 1;
        }

        return 0;
    });
};

/**
  * Gets a property value as number. This method is null safe.
  *
  * @param object the object to that contains the value.
  * @param fieldPath the field's path.
  * @param defaultValue the default value.
  * @return the value as number
  */
const getNum = (object: ?Object, fieldPath: string, defaultValue: ?number) => numberify(get(object, fieldPath, defaultValue));

/**
  * Gets a property value as string. This method is null safe.
  *
  * @param object the object to that contains the value.
  * @param fieldPath the field's path.
  * @param defaultValue the default value.
  * @return the value as string
  */
const getStr = (object: ?Object, fieldPath: string, defaultValue: ?string) => stringify(get(object, fieldPath, defaultValue));

/**
  * Gets a property value as array. This method is null safe.
  *
  * @param object the object to that contains the value.
  * @param fieldPath the field's path.
  * @param defaultValue the default value.
  * @return the value as array
  */
const getArray = (object: ?Object, fieldPath: string, defaultValue: ?Array<any>) => arrayfy(get(object, fieldPath, defaultValue));

/**
  * Gets a property value as date. This method is null safe.
  *
  * @param object the object to that contains the value.
  * @param fieldPath the field's path.
  * @param defaultValue the default value.
  * @return the value as Date
  */
const getDate = (object: ?Object, fieldPath: string, defaultValue: ?Date) => datefy(get(object, fieldPath, defaultValue));

/**
 * Executes the functions sequentially (in order).
 *
 * @param list a list of items
 * @param executePromise a function that returns a promise
 */
const serialPromises = (list: Array<any>, executePromise: Function) => {
    list.reduce(async (prevPromise, item) => {
        await prevPromise;
        return executePromise(item);
    }, Promise.resolve());
};


export {
    debounce,
    hasOneOf,
    isDefined,
    isObject,
    isEmpty,
    isEmptyArray,
    isBoolean,
    pick,
    shallowEquals,
    deepEquals,
    capitalizeFirstLetter,
    stringify,
    numberify,
    arrayfy,
    datefy,
    sortAscending,
    getNum,
    getStr,
    getArray,
    getDate,
    serialPromises,
};
