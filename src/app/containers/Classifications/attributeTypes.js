const attributeTypes = {
    text: 'Text',
    int: 'Number',
    float: 'Decimal',
    bool: 'Yes / No',
    timestamp: 'Date / Time',
    enum: 'Enumeration',
    things: 'Things',
    people: 'People',
    custom: 'Custom Entity',
    organisations: 'Organizations',
    directory: 'Directory',
    classification: 'Classification'
};

export default Object.entries(attributeTypes).map(([value, label]) => ({ value, label }));

/**
 * function to get label from type
 * @param type
 * @returns {string}
 */
export function label(type) {
    return attributeTypes[type] || 'Unknown';
}
