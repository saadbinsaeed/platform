/* @flow */

/**
 * Converts object to mutable.
 * @param obj
 * @returns {Object}
 */
export function safeToJS(obj: ?Object) {
    return obj;
}

/**
 * Converts object to a mutable array.
 * @param obj
 * @returns {Object}
 */
export function safeToJsArray(obj: ?any): ?any[] {
    if (!obj) {
        return null;
    }
    return Array.isArray(obj) ? obj : [ obj ];
}
