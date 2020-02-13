/* @flow */

import Immutable, { set } from 'app/utils/immutable/Immutable';
import { get } from 'app/utils/lo/lo';


/**
 * @private
 *
 * Saves the new value of an input in the Component's state.
 */
const onChange = (component: Object, event: Object, formName: string) => {
    event.preventDefault();
    const { name, value } = event.target;
    const formState = component.state[formName] || Immutable({});
    const newFormState = set(formState, name, value);
    component.setState({
        [formName]: newFormState
    });
};

/**
 * Returns the attributes to store the changes of an input field in the Component's state.
 *
 * @param component the component
 * @param fieldPath the field path in the state (used to read/write the value)
 * @param formName the form name (default: 'form')
 * @param valueFieldName the name of the file that contains the value (default: 'value')
 *
 * @return {{name: *, value: *, onChange: (function(*=))}} the field attributes to handle the changes
 */
const handleChange = (component: Object, fieldPath: string, formName: ?string, valueFieldName: ?string) => {
    const form = component.state[formName || 'form'] || Immutable({});
    const valueField = valueFieldName || 'value';
    return {
        name: fieldPath,
        [valueField]: get(form, fieldPath),
        onChange: (event: Object) => { onChange(component, event, formName || 'form'); },
    };
};

export { handleChange };
