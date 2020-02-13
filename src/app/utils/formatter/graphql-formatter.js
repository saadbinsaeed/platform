/* @flow */

const formatArray = (array: Array<Object>) => {
    if (!array || array.length === 0) {
        return '[]';
    }
    const objs = array.map((obj) => {
        return Object.entries(obj)
            .map(([key, value]) => `${key}: "${String(value)}"`)
            .join(', ');
    });
    return `[{${objs.join('},{')}}]`;
};


export { formatArray };
