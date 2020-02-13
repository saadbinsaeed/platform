/* @flow */

import { isDefined } from 'app/utils/utils';
import validate from 'validate.js';

const isValidType = (value: any, type: string) => {
    switch(type) {
        case 'array': return Array.isArray(value);
        default:
            return typeof value === type;
    }

};

/**
 * Adding custom validators.
 *
 * WARNING: This is global! Add custom validators only here!
 */

validate.validators.type = (value, options, key, attributes) => {
    if (!isDefined(value)) {
        return undefined;
    }
    const type = typeof options === 'object' ? options.type : String(options);
    if (isValidType(value, type)) {
        return undefined;
    }
    const message = typeof options === 'object' ? options.type : `{label} must be a ${String(type)}.`;
    return message;
};

export default validate;
