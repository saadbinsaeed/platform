/* @flow */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { ContactInfo } from 'app/utils/types/interfaces';
import InfoBlock from '../InfoBlock/InfoBlock';

/**
 * Displays email, mobile, twitter, website and home address
 * for a person.
 */
export default class ContactDetails extends Component<Object, Object> {

    static propTypes = {
        contactInfo: PropTypes.arrayOf(
            PropTypes.shape({
                type: PropTypes.string,
                is_primary: PropTypes.bool,
                sub_type: PropTypes.string,
                identifier: PropTypes.string,
            })
        ),
    };


    /**
     * Get primary contact info
     * @returns {*|Array}
     */
    getPrimaryContactInfo() {
        return (this.props.contactInfo || []).filter(contactInfo => contactInfo.is_primary);
    }

    /**
     * Lifecycle hook: Executed on component render.
     * @returns {XML}
     */
    render(): Object {
        const primaryContactInfoFieldData = this.getPrimaryContactInfo();

        if (primaryContactInfoFieldData.length === 0) {
            return <span> There are no primary contact details available. </span>;
        }

        const primaryContactInfoFields = primaryContactInfoFieldData.map(
            (contactInfo, i) => <ContactInfoField
                key={i} contactInfo={contactInfo}
            />
        );

        return <div> { primaryContactInfoFields } </div>;
    }
}

const ContactInfoField: Object = ( props: Object ): ?Object => {
    const labelFieldProps = getContactInfoFieldProps(props.contactInfo);

    return <InfoBlock {...labelFieldProps} />;
};


/**
 * Make properties for a contact info field.
 * Todo: check if it can be moved to a separate file as it's used in other places.
 * @param type
 * @param identifier
 */
export function getContactInfoFieldProps(contactInfo: ContactInfo) {
    const labelFieldProps = {
        label: `${contactInfo.sub_type || '' } `,
        icon: '',
        type: 'mdi',
        text: contactInfo.identifier || '',
    };

    switch (contactInfo.type) {
        case 'email':
            labelFieldProps.label += 'Email';
            labelFieldProps.icon = 'email';
            break;
        case 'phone':
            labelFieldProps.label += 'Phone';
            labelFieldProps.icon = 'phone-in-talk';
            break;
        case 'social':

            switch (contactInfo.sub_type) {
                case 'Facebook':
                    labelFieldProps.icon = 'facebook';
                    break;
                case 'Google+':
                    labelFieldProps.icon = 'google-plus';
                    break;
                case 'Instagram':
                    labelFieldProps.icon = 'instagram';
                    break;
                case 'LinkedIn':
                    labelFieldProps.icon = 'linkedin';
                    break;
                case 'Pinterest':
                    labelFieldProps.icon = 'pinterest';
                    break;
                case 'Reddit':
                    labelFieldProps.icon = 'reddit';
                    break;
                case 'Snapchat':
                    labelFieldProps.icon = 'snapchat';
                    break;
                case 'Tumblr':
                    labelFieldProps.icon = 'tumblr';
                    break;
                case 'Twitter':
                    labelFieldProps.icon = 'twitter';
                    break;
                case 'YouTube':
                    labelFieldProps.icon = 'youtube';
                    break;
                case 'Weibo':
                    labelFieldProps.icon = 'sina-weibo';
                    break;
                case 'Baidu Tieba':
                    labelFieldProps.icon = 'baidu';
                    labelFieldProps.type = 'af';
                    break;
                case 'Gab':
                    labelFieldProps.icon = 'gab';
                    labelFieldProps.type = 'af';
                    break;

                default:
                    break;
            }

            break;
        case 'website':
            labelFieldProps.label = 'Website';
            labelFieldProps.icon = 'web';
            break;
        case 'address':
            labelFieldProps.label = 'Home Address';
            labelFieldProps.icon = 'map-marker';
            labelFieldProps.text = (contactInfo.address || {}).city;
            break;
        default:
    }
    return labelFieldProps;
}

/**
 * Gets sub type for contact info type (because we don't have a dictionary)
 *  Todo: check if it can be moved to a separate file as it's used in other places.
 * @param type
 * @returns {*}
 */
export function getContactInfoSubTypes(type: string): Array<string> {
    switch (type) {
        case 'email':
            return ['Home', 'Work'];
        case 'phone':
            return ['Mobile', 'Work', 'Home', 'Main', 'Work Fax', 'Home Fax', 'Pager', 'Emergency'];
        case 'chat':
            return ['Google', 'Facebook', 'Skype', 'WhatsApp', 'WeChat', 'Viber', 'AIM', 'Yahoo', 'QQ', 'MSN', 'ICQ', 'Jabber'];
        case 'social':
            return ['Baidu Tieba', 'Facebook', 'Gab', 'Google+', 'Instagram', 'LinkedIn', 'Pinterest', 'Reddit', 'Snapchat', 'Tumblr', 'Twitter', 'Weibo', 'YouTube'];
        case 'website':
            return ['Personal', 'Work'];
        case 'address':
            return ['Home', 'Work'];
        default:
            return [];
    }
}
