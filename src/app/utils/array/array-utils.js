/* @flow */

/**
 *  This function will take two array and returns those values that are common in both arrays
 */
const findIntersection = (arr1: $ReadOnlyArray<number | string>, arr2: $ReadOnlyArray<number | string>) => {
    return ((arr1 || []).filter(value => -1 !== (arr2 || []).indexOf(value)): Array<string | number>);
};

/**
 * This function will take and array and returns an other array with no duplicate values
 */
const getUnique = (arr: Array<number | string>) => {
    return [ ...new Set(arr)];
};

export { findIntersection, getUnique };
