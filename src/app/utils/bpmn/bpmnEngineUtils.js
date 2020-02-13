/* @flow */

const bmpnVariablesToObject = (bpmnVariables: Array<Object>): Object => {
    if (!Array.isArray(bpmnVariables)) {
        return {};
    }
    return bpmnVariables.reduce((variables, variable) => {
        if (!variable) {
            return variables;
        }
        const { type, name, text, long, double, bytearrayId } = variable;
        switch (type) {
            case 'boolean':
                variables[name] = long && !!long;
                break;
            case 'date':
                variables[name] = long && new Date(long);
                break;
            case 'double':
                variables[name] = double;
                break;
            case 'integer':
            case 'long':
                variables[name] = long;
                break;
            case 'json':
                variables[name] = text && JSON.parse(text);
                break;
            case 'longString':
            case 'serializable':
                variables[name] = bytearrayId;
                break;
            case 'string':
                variables[name] = text;
                break;
            default:
                variables[name] = null;
        }
        return variables;
    }, {});
};

export { bmpnVariablesToObject };
