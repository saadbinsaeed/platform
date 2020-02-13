/* @flow */

import { isEmpty } from 'app/utils/utils';
import { get } from 'app/utils/lo/lo';
import validate from 'app/utils/validator/validate';
import moment from 'moment';

export default class FormValidator {
    components: ?Array<Object>;
    constraints: Object;
    data: Object;
    errors: ?Object;
    nameComponentsMap: {};

    constructor(formComponents: ?Array<Object>) {
        this.nameComponentsMap = {};
        this.components = formComponents;
    }

    _buildFormConstraints(components: ?Array<Object>) {
        if (!components) {
            return {};
        }
        this.nameComponentsMap = {};
        let constraints = {};
        components.forEach((component) => {
            if(component.children) {
                constraints = {
                    ...constraints,
                    ...this._buildFormConstraints(component.children),
                };
                return;
            }
            return this._addComponentConstraints(component, constraints);
        });
      
        return constraints;
    };

    _addComponentConstraints(component: Object, formConstraints: Object) {
        const { type, properties } = component;
        const { name, children } = properties || {};
        if (!name) {
            return;
        }
        this.nameComponentsMap[name] = this.nameComponentsMap[name] || [];
        this.nameComponentsMap[name].push(component);

        let constraints = component.constraints ? { ...component.constraints } : {};

        // dont't need validate if is not visible
        const isVisible = get(component, 'properties.isVisible');
        if(isVisible) {
            // $FlowFixMe
            constraints = isVisible(this.data) ? constraints : {};
        }

        // enance constraints adding type:
        if (type) {
            switch(type) {
                case 'text':
                    constraints.type = 'string';
                    break;
                case 'number': case 'boolean':
                    constraints.type = type;
                    break;
                default:
            }
        }

        if (isEmpty(constraints) && isEmpty(children)) {
            return null;
        }
        if (!isEmpty(constraints) && name) {
            if (formConstraints[name]) {
                console.warn('More than one component is adding constraints to the same property:', name); // eslint-disable-line no-console
            }
            formConstraints[name] = {};
            Object.entries(constraints).forEach(([ constraint, value ]) => {
                let length;
                switch (constraint) {
                    case 'required':
                        formConstraints[name].presence = { allowEmpty: false, message: '{label} is required.' };
                        break;
                    case 'minLength':
                        length = formConstraints[name].length || {};
                        length.minimum = value;
                        length.tooShort = 'Minimum %{count} letters or more.';
                        formConstraints[name].length = length;
                        break;
                    case 'maxLength':
                        length = formConstraints[name].length || {};
                        length.maximum = value;
                        length.tooLong = 'Maximum %{count} letters or less.';
                        formConstraints[name].length = length;
                        break;
                    case 'numericality':
                        formConstraints[name].numericality = value;
                        break;
                    case 'datetime':
                        formConstraints[name].datetime = value;
                        break;
                    case 'email':
                        formConstraints[name].email = { message: '{label} is not a valid email.'};
                        break;
                    case 'noWhiteSpace':
                        formConstraints[name].format = { pattern: /^\S*$/, message: '{label} can\'t contain space(s).'};
                        break;
                    case 'custom':
                        if (typeof value !== 'function') {
                            console.warn('Custom constraint have to be function!'); // eslint-disable-line no-console
                        } else {
                            formConstraints[name] = value(this.data);
                        }
                        break;
                    default:
                        formConstraints[name][constraint] = value;
                }
            });
        }
        if (!isEmpty(children)) {
            children.forEach(child => this._addComponentConstraints(child, formConstraints));
        }
    }

    _validate(): Object {
        validate.extend(validate.validators.datetime, {
            // The value is guaranteed not to be null or undefined but otherwise it
            // could be anything.
            parse: function(value, options) {
                return +moment.utc(value);
            },
            // Input is a unix timestamp
            format: function(value, options) {
                var format = options.dateOnly ? 'YYYY-MM-DD' : 'YYYY-MM-DD hh:mm:ss';
                return moment.utc(value).format(format);
            }
        });
        // $FlowFixMe
        return validate(this.data, this._buildFormConstraints(this.components), { fullMessages: false });
    }

    getErrors(data: Object): ?Object {
        if (this.data !== data || {}) {
            this.data = data || {};
            this.errors = this._validate();
            return this.errors;
        }
        return this.errors;
    }

    isValid(data: Object) {
        return !this.getErrors(data);
    }

    getComponents(name: string) {
        return this.nameComponentsMap[name];
    }

    formatMessage(message: string, component: Object) {
        const { properties } = component;
        const { name, label } = properties || {};
        return message.replace('{label}', label || name);
    }

    formatMessages(name: string, component: Object) {
        const messages = this.errors && this.errors[name];
        if (!messages) {
            return null;
        }
        return messages.map(message => this.formatMessage(message, component));
    }

    getMessages() {
        if (!this.errors) {
            return null;
        }
        const messages = [];
        Object.keys(this.errors).forEach((name) => {
            const components = this.getComponents(name);
            components.forEach(component => messages.push(...(this.formatMessages(name, component)) || []));
        });
        return messages;
    }
}
