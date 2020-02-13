/* @flow */

import { set } from 'app/utils/lo/lo';
import { events } from 'app/containers/Designer/Form/components/FormField';

const _eval = (js) => {
    try {
        return eval(js); // eslint-disable-line no-eval
    } catch (e) {
        return null;
    }
};

const normalize = (field) => {
    let normalized = field;
    switch (field.type) {
        case 'typeahead':
            if (field.properties.fetchData) {
                normalized = set(normalized, 'properties.fetchData', _eval(field.properties.fetchData));
            }
            if (field.properties.staticOptions) {
                normalized = set(normalized, 'properties.staticOptions', JSON.parse(field.properties.staticOptions));
            }
            break;
        case 'textarea': {
            const { parseAs, value } = field.properties;
            if (parseAs === 'javascript') {
                normalized = set(normalized, 'properties.value', _eval(value));
            } else if (parseAs === 'HTML')  {
                const div = document.createElement('div');
                div.innerHTML = value;
                normalized = set(normalized, 'properties.value', div);
            }
            break;
        }
        default:
    }

    if (field.properties.help) {
        const div = document.createElement('div');
        div.innerHTML = field.properties.help;
        normalized = set(normalized, 'properties.help', div);
    }

    events.forEach((handler) => {
        if (field.properties[handler]) {
            normalized = set(normalized, `properties.${handler}`, _eval(field.properties[handler]));
        }
    });

    if (field.children) {
        normalized.children = field.children.map(normalize);
    }
    return normalized;
};

export const normalizeFields = (fields: ?Array<any>): ?Array<any> =>
    fields && fields.filter(f => f && f.type === 'react').map((field) => {
        const { miconfig } = field;
        try {
            const meta = miconfig ? JSON.parse(miconfig) : {};
            return normalize(meta);
        } catch (e) {
            console.warn('invalid form field', field); // eslint-disable-line no-console
            return null;
        }
    });

const _stringify = (field) => {
    let stringifiable = field;
    switch (field.type) {
        case 'typeahead':
            if (field.properties.fetchData) {
                stringifiable = set(stringifiable, 'properties.fetchData', String(field.properties.fetchData));
            }
            if (field.properties.staticOptions) {
                stringifiable = set(stringifiable, 'properties.staticOptions', String(field.properties.staticOptions));
            }
            break;
        case 'textarea': {
            const { parseAs, value } = field.properties;
            if (parseAs === 'javascript') {
                stringifiable = set(stringifiable, 'properties.value', String(value));
            } else if (parseAs === 'HTML')  {
                stringifiable = set(stringifiable, 'properties.value', value.innerHtml);
            }
            break;
        }
        default:
    }

    if (field.properties.help) {
        stringifiable = set(stringifiable, 'properties.help', field.properties.help.innerHTML);
    }

    events.forEach((handler) => {
        if (field.properties[handler]) {
            stringifiable = set(stringifiable, `properties.${handler}`, String(field.properties[handler]));
        }
    });

    if (field.children) {
        stringifiable.children = field.children.map(_stringify);
    }
    return stringifiable;
};

const stringify = field => JSON.stringify(_stringify(field));

export const denormalizeFields = (fields: ?Array<any>): ?Array<any> =>
    fields && fields.map((field) => {
        try {
            const miconfig = field && stringify(field);
            return { type: 'react', miconfig };
        } catch (e) {
            console.warn('cannot denormalize field', field); // eslint-disable-line no-console
            return null;
        }
    }).filter(f => f);
