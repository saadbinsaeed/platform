/* @flow */

import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { set } from 'app/utils/immutable/Immutable';
import { get } from 'app/utils/lo/lo';
import { ContactInfo } from 'app/utils/types/interfaces';
import Card from 'app/components/molecules/Card/Card';
import Field from 'app/components/molecules/Field/Field';
import { createEvent } from 'app/utils/http/event';
import ButtonIcon from 'app/components/molecules/ButtonIcon/ButtonIcon';
import LocationForm from '../LocationForm/LocationForm';

const floatRight= { float: 'right' };

/**
 * Collapsable address form
 */
export class CollapsableAddressForm extends Component<Object, Object> {

    static propTypes = {
        value: PropTypes.object,
        name: PropTypes.string,
        onChange: PropTypes.func.isRequired,
        contactInfoIndex: PropTypes.number
    };


    /**
     * @override
     * @param props
     */
    constructor(props: Object) {
        super(props);

        (this: Object).handleChange = this.handleChange.bind(this);
    }

    remove = (e: Object)=> {
        e.preventDefault();
        this.props.removeContactInfo(this.props.contactInfoIndex);
    };

    /**
     * @override
     * @returns {XML}
     */
    render() {
        const contactInfo: ContactInfo = this.props.value;

        const city = String(get(contactInfo, 'address.city') || '');
        const shortAddressName = city ? ` - ${city}` : '';

        // This is a hack because API gives us address not location info - this needs to be changed
        // from backend side because mockups show a map (so we need location_info not address)
        const locationInfo = {
            address: contactInfo.address
        };

        /**
         * Render our page with all the bits and pieces in place
         */
        const iconInfo = { name: 'pin', color: '#c62828'};
        return (
            <Card
                collapsible
                title={`${contactInfo.sub_type || '' } Address${shortAddressName}`}
                titleActions={
                    <Field
                        style={{ float: 'right' }}
                        label=""
                        checked={!!contactInfo.is_primary}
                        onChange={evt => this.handleChange({
                            target: {
                                name: 'is_primary',
                                value: get(evt, 'target.checked')
                            }
                        })}
                        type="radio"
                    />
                }
                description={<div>
                    <ButtonIcon icon="delete" iconColor="white" style={floatRight} onClick={this.remove} />
                    <LocationForm name="address" value={locationInfo} onChange={this.handleChange} addressOnlyFields iconInfo={iconInfo} />
                </div>}
            />
        );
    }

    /**
     * @param evt
     */
    handleChange(evt: Object) {
        if (typeof (this.props.onChange) === 'function') {
            const name = this.props.name;
            let srcValue = evt.target.value;

            if (evt.target.name === 'address') {
                // This is a hack because API gives us address not location info - this needs to be changed
                // from backend side because mockups show a map (so we need location_info not address)
                srcValue = evt.target.value.address;
            }

            const value = set(this.props.value, evt.target.name, srcValue);

            const event = createEvent('change', { name, value });
            this.props.onChange(event);
        }


    }
}
