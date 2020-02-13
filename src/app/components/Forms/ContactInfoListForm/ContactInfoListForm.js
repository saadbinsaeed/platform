/* @flow */
import type { Element } from 'react';

import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';

import Card from 'app/components/molecules/Card/Card';
import PopupMenu from 'app/components/molecules/PopupMenu/PopupMenu';
import MenuItem from 'app/components/molecules/Menu/MenuItem';
import Button from 'app/components/atoms/Button/Button';

import Immutable, { set } from 'app/utils/immutable/Immutable';
import { ContactInfo } from 'app/utils/types/interfaces';
import { createEvent } from 'app/utils/http/event';
import { groupBy, isFunction, map } from 'app/utils/lo/lo';

import { ContactInfoForm } from '../ContactInfoForm/ContactInfoForm';
import { CollapsableAddressForm } from '../CollapsableAddressForm/CollapsableAddressForm';


type ContactInfoFormPropTypes = {
    name: ?string,
    value: ContactInfo[],
    onChange: Function
}

/**
 * Renders a ContactInfo form to allow a user to change a single contact info form.
 */
export class ContactInfoListForm extends PureComponent<Object, ContactInfoFormPropTypes> {

    static propTypes: Object = {
        name: PropTypes.string.isRequired,
        value: PropTypes.array,
        onChange: PropTypes.func,
    };

    /**
     * Get contactinfo
     */
    get contactInfo(): ContactInfo[] {
        return this.props.value || Immutable([]);
    }

    /**
     * Handles a contact info change
     * @param index
     * @param event
     */
    handleContactInfoChange(index: number, event: Object) {
        const value: ContactInfo = event.target.value;
        this.onChange(this.contactInfo.map((contactInfo, i) => {
            if (index === i) {
                return Immutable({ ...value, is_primary: true });
            }

            if (contactInfo.type === value.type) {
                return Immutable({ ...contactInfo, is_primary: false });
            }

            return contactInfo;
        }));
    }


    /**
     * Emit a change to parent.
     * @param locationInfo
     */
    onChange(contactInfoList: ContactInfo[]) {
        if (!this.props.onChange || !this.props.name) {
            return;
        }
        const name = this.props.name;
        const value = contactInfoList;
        const event = createEvent('change', { name, value });
        this.props.onChange(event);
    }


    /**
     * Add a contact info field.
     * @param type
     */
    addContactInfo(type: string) {
        let contactInfoArr: Array<ContactInfo> = this.contactInfo;
        if (!Array.isArray(contactInfoArr)) {
            contactInfoArr = [];
        }

        const newContactInfo: ContactInfo = {
            address: undefined,
            type,
            is_primary: false,
            sub_type: '',
            identifier: ''
        };

        const newContactInfoArr = Immutable([...contactInfoArr, newContactInfo]);
        this.onChange(newContactInfoArr);
    }

    /**
     * Renders a contact info field that can update the state when a value is changed.
     *
     * @param contactInfoIndex
     */
    renderContactInfoField(contactInfoIndex: number): ?Element<any> {
        const contactInformation: ContactInfo = this.contactInfo[contactInfoIndex];

        if ( !contactInformation ) {
            return null;
        }

        const handleContactInfoChangeFn = value => this.handleContactInfoChange(contactInfoIndex, value);

        const formProps = {
            contactInfoIndex: contactInfoIndex,
            value: contactInformation,
            name: undefined, // not sure why we need this - it's marked as optional in ContactInfoFormPropTypes
            onChange: handleContactInfoChangeFn,
            removeContactInfo: this.removeContactInfo
        };

        switch (formProps.value.type){
            case 'address':
                return <CollapsableAddressForm key={contactInfoIndex} {...formProps} />;
            default:
                return <ContactInfoForm key={contactInfoIndex} {...formProps} />;
        }
    }


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
        event.preventDefault();
        const { name, value } = event.target;

        const updatedContactInfo: ContactInfo = set(this.props.value, name, value);
        this.onChangeContactInfo(updatedContactInfo);
    }

    /**
     * Emit a change to parent.
     * @param contactInfo
     */
    onChangeContactInfo(contactInfo: ContactInfo) {
        if (isFunction(this.props.onChange)) {
            // Set default values for the event (not present or visible in the form or ever changed,
            // so no need to represent these within the state).
            const value = { type: 'contactInfo', ...(contactInfo || {}) };
            this.props.onChange(createEvent('change', { name: this.props.name || '', value }));
        }
    }

    removeContactInfo = (key: number) => {
        const contactInformation = this.contactInfo;
        const newContactInfoArr = contactInformation.filter((item, index) => index !== key);
        this.onChange(newContactInfoArr);
    };

    /**
     * Lifecycle hook.
     * @returns {XML}
     */
    render(): Object {

        //console.log('contactInfo', this.contactInfo);
        const contactInformation = this.contactInfo;
        const contactInfoFields = contactInformation.map(
            // We ignore the value of contactInfo, because we need array index to update the value anyway
            // within the contactInfoField.
            (contactInfo, i) => ({ value: contactInfo, elem: this.renderContactInfoField(i) })
        );

        const groupedContactInformation = groupBy(contactInformation, 'type');
        const contactInfoCards = map(groupedContactInformation,
            (group, groupName) => (<Card
                key={groupName}
                collapsible
                collapsed
                title={`Contact Details - ${ groupName}`}
                description={contactInfoFields
                    .filter(cInfo => cInfo.value.type === groupName)
                    .map(cInfo => cInfo.elem)}
            />)
        );

        return (<Fragment>
            { contactInfoCards }
            <PopupMenu width="100%" placement="top left" inline right fluid padding content={
                <Fragment>
                    { <MenuItem name="Email" onClick={event => this.addContactInfo('email')} /> }
                    { <MenuItem name="Phone Number" onClick={event => this.addContactInfo('phone')} />}
                    { <MenuItem name="Social Media Profile" onClick={event => this.addContactInfo('social')}/>}
                    { <MenuItem name="Website" onClick={event => this.addContactInfo('website')}/>}
                    { <MenuItem name="Address" onClick={event => this.addContactInfo('address')}/>}
                </Fragment>
            }>
                <Button fluid rounded={false} color="primary" text="Add Contact Info" />
            </PopupMenu>
        </Fragment>);

    }
}
