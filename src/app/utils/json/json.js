/* @flow */

const _addJsonPaths = (value: ?any, parentPath: ?string, paths: Array<string>, deepIntoArray: ?boolean) => {
    if (!value || typeof value !== 'object') {
        if (parentPath) {
            paths.push(parentPath);
        }
        return;
    }
    if (Array.isArray(value)) {
        if (deepIntoArray) {
            value.forEach((item, index) => {
                const path = parentPath ? `${parentPath}[${index}]` : `[${index}]`;
                _addJsonPaths(item, path, paths);
            });
        } else {
            if (parentPath) {
                paths.push(parentPath);
            }
            return;
        }
    } else {
        Object.entries(value).forEach(([key, item]) => {
            const path = parentPath ? `${parentPath}.${key}` : key;
            _addJsonPaths(item, path, paths, deepIntoArray);
        });
    }
};

export const getProperties = (json: ?Object, deepIntoArray: ?boolean) => {
    const paths = [];
    _addJsonPaths(json, '', paths, deepIntoArray);
    return paths;
};
