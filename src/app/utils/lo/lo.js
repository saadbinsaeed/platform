/* @flow */

/**
 * Lodash like library that provide immutable support
 */

/**
 * Returns true if the value is not null and it's not undefined.
 * @param value the value to check
 *
 * @returns true if the value is not null and it's not undefined, false otherwise.
 */
const isDefined = (value: ?any) => value !== null && value !== undefined;

const isFunction = (value: ?any) => typeof value === 'function';

/**
  * @private
  * Used internally by the set method.
  */
const _getPath = (accessorString: string): any => {
    let path = [];
    const split = accessorString.split('.');
    split.forEach((field) => {
        const match = field.match(/\[\d+\]/g);
        if (!match) {
            path.push(field);
        } else if (!field.endsWith(']')) {
            throw new Error(`Invalid field name ${field}`);
        } else {
            let name = field;
            const indexes = [];
            match.forEach( (chunk) => {
                name = name.replace(chunk, '');
                const num = chunk.match(/\d+/);
                indexes.push(Number(num && num[0]));
            } );
            if (name.length > 0) {
                path = [ ...path, name, ...indexes ];
            } else {
                path = [ ...path, ...indexes ];
            }
        }
    });
    return path;
};

/**
  * @private
  * Used internally by the set method.
  */
const _set = (object: any, fieldPath: any[], value: any): any => {
    const field = fieldPath.shift();

    if (Number.isInteger(field)) {
        const mutableArray = Array.isArray(object) ? [ ...object ] : [];
        mutableArray[field] = fieldPath.length === 0 ? value : _set(mutableArray[field], fieldPath, value);
        return mutableArray;
    }

    if ( fieldPath.length === 0 ) {
        return { ...object, [field]: value };
    }
    return { ...object, [field]: _set(object[field] || {}, fieldPath, value) };
};

/**
  * Returns an immutable object that it is the updated version of the object passed to this method.
  *
  * @param object the object to update.
  * @param fieldPath the field to set.
  * @param value the value to set.
  * @return an immutable object
  */
const set = (object: any, fieldPath: string, value: any) => {
    return _set(object || {}, _getPath(fieldPath), value);
};

/**
  * @private
  * Gets a property value. This method is null safe.
  *
  * @param object the object to that contains the value.
  * @param fieldPath the field's path.
  * @return the value
  */
const _get = (object: ?Object, fieldPath: string) => {
    const path = _getPath(fieldPath);
    let pivot = object;
    while (path.length > 0) {
        if (!pivot) {
            return path.length > 0 ? undefined : pivot;
        }
        pivot = pivot[path.shift()];
    }
    return pivot;
};

/**
  * Gets a property value. This method is null safe.
  *
  * @param object the object to that contains the value.
  * @param fieldPath the field's path.
  * @param defaultValue the default value.
  * @return the value
  */
const get = (object: ?Object, fieldPath: string, defaultValue: any) => {
    const value = _get(object, fieldPath);
    if (defaultValue === undefined) {
        return value;
    }
    return isDefined(value) ? value : defaultValue;
};

const _toArray = (collection: ? Array<any> | Object) => {
    if (!collection) {
        return [];
    }
    const list = Array.isArray(collection) ? collection : Object.values(collection);
    return [ ...list ];
};

const _compare = (valueA: any, valueB: any) => {
    if (valueA < valueB) return -1;
    if (valueA > valueB) return 1;
    return 0;
};

/**
 * Creates an object that contains the elements in the array using the specified key.
 *
 * e.g.
 * var array = [
 *   { 'dir': 'left', 'code': 97 },
 *   { 'dir': 'right', 'code': 100 }
 * ];
 *
 * keyBy(array, 'dir');
 * // => { 'left': { 'dir': 'left', 'code': 97 }, 'right': { 'dir': 'right', 'code': 100 } }
 */
const keyBy = (collection: ? Array<Object> | Object, key: string): Object => {
    return _toArray(collection).filter(isDefined).reduce((map, element) => {
        // $FlowFixMe
        if (element[key]) {
            map[element[key]] = element;
        }
        return map;
    }, {});
};

const groupBy = (collection: ? Array<Object> | Object, iteratee: Function | string): Object => {
    return _toArray(collection).filter(isDefined).reduce((map, element) => {
        // $FlowFixMe
        const key = isFunction(iteratee) ? String(iteratee(element)) : String(get(element, iteratee));
        if (map[key]) {
            map[key].push(element);
        } else {
            map[key] = [element];
        }
        return map;
    }, {});
};

const map = (collection: ? Array<any> | Object, predicate: Function): Array<any> => {
    if (Array.isArray(collection)) {
        return _toArray(collection).map(predicate);
    }
    const keys = Object.keys(collection || {});
    return _toArray(collection).map((element, index) => predicate(element, keys[index]));
};

const filter = (collection: ? Array<any> | Object, predicate: Function): Array<any> => _toArray(collection).filter(predicate);

const sortBy = (collection: ? Array<Object> | Object, iteratees: Function | Array<string> | string, options: ?Object): Array<any> => {
    const list = _toArray(collection);
    const opts = options || {};
    if (isFunction(iteratees)) {
        // $FlowFixMe
        return list.sort((a, b) => _compare(iteratees(a), iteratees(b)));
    }
    if (typeof iteratees === 'string') {
        return list.sort((a, b) => _compare(
            // $FlowFixMe
            opts.caseInsensitive ? (get(a, iteratees) || '').toLowerCase() : get(a, iteratees),
            // $FlowFixMe
            opts.caseInsensitive ? (get(b, iteratees) || '').toLowerCase() : get(b, iteratees)
        ));
    }
    if (Array.isArray(iteratees)) {
        return list.sort((a, b) => {
            for (let i = 0; i < iteratees.length; ++i) {
                // $FlowFixMe
                const compare = _compare(get(a, iteratees[i]), get(b, iteratees[i]));
                if (compare !== 0) {
                    return compare;
                }
            };
            return 0;
        });
    }
    throw new Error(`Invalid argument ${String(iteratees)}`);
};

/* expose private methods for testing purpose */
set._getPath = _getPath;

export { isDefined, isFunction, get, set, filter, map, groupBy, keyBy, sortBy };
