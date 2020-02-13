/* @flow */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Field from 'app/components/molecules/Field/Field';
import FreeTextSelect from 'app/components/molecules/Autocomplete/FreeTextSelect';
import ButtonIcon from 'app/components/molecules/ButtonIcon/ButtonIcon';
import { createEvent } from 'app/utils/http/event';
import { set } from 'app/utils/immutable/Immutable';
import { get } from 'app/utils/lo/lo';
import { ContactInfo } from 'app/utils/types/interfaces';
import { getContactInfoFieldProps, getContactInfoSubTypes } from 'app/components/molecules/ContactDetails/ContactDetails';
import Radio from 'app/components/atoms/Radio/Radio';

const floatRight= { float: 'right' };

type ContactInfoFormPropTypes = {
    name: ?string,
    value: ContactInfo,
    contactInfoIndex: number,
    onChange: Function
}

/**
 * Renders a contactInfo form to allow a user to change a single contact info form.
 */
export class ContactInfoForm extends Component<Object, ContactInfoFormPropTypes> {

    static propTypes: Object = {
        name: PropTypes.string,
        value: PropTypes.object,
        onChange: PropTypes.func,
        contactInfoIndex: PropTypes.number,
        removeContactInfo: PropTypes.func,
    };

    /**
     * @param props the Component's properties
     */
    constructor(props: ContactInfoFormPropTypes) {
        super(props);

        (this: Object).handleChange = this.handleChange.bind(this);
        (this: Object).onChange = this.onChange.bind(this);
    }

    /**
     * Handle a form change
     * @param event
     */
    handleChange(event: Object) {
        const { name, value } = event.target;
        const updatedContactInfo = set(this.props.value, name, value);
        this.onChange(updatedContactInfo);
    }

    /**
     * Emit a change to parent.
     * @param contactInfo
     */
    onChange(contactInfo: ContactInfo) {
        if (this.props.onChange) {
            // Set default values for the event (not present or visible in the form or ever changed,
            // so no need to represent these within the state).
            const value = { type: 'contactInfo', ...(contactInfo || {}) };
            this.props.onChange(createEvent('change', { name: this.props.name || '', value }));
        }
    }

    remove = (e: Object)=> {
        e.preventDefault();
        this.props.removeContactInfo(this.props.contactInfoIndex);
    };

    onChangeSubType = (event: Object) => this.handleChange({ target: { name: 'sub_type', value: get(event, 'target.value') } });

    /**
     * Lifecycle hook.
     * @returns {XML}
     */
    render(): Object {
        const contactInfo = this.props.value;

        const contactProps = getContactInfoFieldProps(this.props.value);
        let sub_types = getContactInfoSubTypes(contactInfo.type);

        if (contactInfo.sub_type && !sub_types.find(sub_type => sub_type === contactInfo.sub_type)) {
            // This is a custom type. Add it so it's rendered:
            sub_types = [...sub_types, contactInfo.sub_type];
        }
        const selectOptions = sub_types.map(value => ({ value, label: value }));
        return (
            <div key={this.props.contactInfoIndex}>
                <ButtonIcon icon="delete" iconColor="white" style={floatRight} onClick={this.remove} />
                { !contactInfo.sub_type && this.props.value.type === 'social' ? '' : <Field
                    label={contactProps.label}
                    name="identifier"
                    icon={contactProps.icon}
                    iconType={contactProps.type}
                    value={contactProps.text}
                    onChange={this.handleChange}
                    type={contactInfo.type}
                /> }
                <FreeTextSelect
                    creatable
                    label="Type"
                    placeholder="Select or type to create a custom value."
                    name="sub_type"
                    value={contactInfo.sub_type}
                    options={selectOptions}
                    onChange={this.onChangeSubType}
                />
                {/* we are using this Radio as a Checkbox */}
                <Radio label="Primary" name="is_primary" checked={!!contactInfo.is_primary} onChange={() => { this.handleChange(createEvent('change', { name: 'is_primary', value: true })); }} />
            </div>
        );
    }
}
