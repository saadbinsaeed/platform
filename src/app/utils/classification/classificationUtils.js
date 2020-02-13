/*  @flow */

const getFormElements = (classes: ?Array<Object>): Array<Object> => {
    if (!classes || !classes.length) {
        return [];
    }
    return classes.reduce((formElements, { form_definitions }) => {
        if (form_definitions && form_definitions.fields && form_definitions.fields.length) {
            formElements.push(...form_definitions.fields);
        }
        return formElements;
    }, []);
};

const getSummaryElements = (classes: ?Array<Object>): Array<Object> => {
    return getFormElements(classes).filter(element => element.summary);
};

export { getSummaryElements };
