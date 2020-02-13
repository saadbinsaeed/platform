/* @flow */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { createEvent } from 'app/utils/http/event';
import Label from '../../molecules/Label/Label';
import InputWrapper from '../InputWrapper/InputWrapper';
import Icon from '../Icon/Icon';

const RadioWrapper = styled(InputWrapper)`
    display: flex;
    cursor: pointer;
`;

const RadioInputStyle = styled.div`
    position: relative;
    display: inline-block;
    width: 18px; height: 18px;
`;

const RadioInput = styled.input`
    display: block;
    visibility: hidden;
    width: 18px; height: 18px;
    z-index: 1;
`;

const RadioBase = styled.div`
    position: absolute;
    left: 0;
    top:0;
    width: 18px; height: 18px;
    background: ${ ( { theme } ) => theme.input.background };
    display: block;
    border-radius: 500rem;
    z-index: 0;
    border: solid 1px ${ ( { theme } ) => theme.base.borderColor };
    &:hover, &:focus {
        border: solid 1px ${ ( { theme } ) => theme.base.active.borderColor };
    }
`;

const RadioChecked = styled(RadioBase)`
    background: ${ ( { theme } ) => theme.input.background };
`;

const CheckedIcon = styled(Icon)`
    position: absolute;
    top: -3px;
    left: 0px;
    width: 16px;
    height: 16px;
    &:before {
        line-height: 21px !important;
        margin: 0; padding: 0;
        color: ${ ( { theme } ) => theme.color.primary };
        font-weight: 600;
    }
`;

// We need to take our default label style and overwrite some stuff
const RadioLabel = styled(Label)`
    display: inline-block;
    margin: 0 0 0 .5rem;
    cursor: pointer;
`;

/**
 * Our checkbox component
 */
class Radio extends Component<Object, Object> {

    static propTypes = {
        label: PropTypes.string,
        name: PropTypes.string,
        value: PropTypes.oneOfType([ PropTypes.string, PropTypes.bool]),
        checked: PropTypes.bool,
        onChange: PropTypes.func,
    };

    /**
     * @param props the Component's properties
     */
    constructor(props: Object) {
        super(props);
        (this: Object).onChange = this.onChange.bind(this);
    }

    /**
     * onChange event handler
     *
     * @param event a SyntheticEvent (https://facebook.github.io/react/docs/events.html)
     */
    onChange( event: Event ) {
        event.stopPropagation();
        if ( this.props.onChange ) {
            const { name, value, field } = this.props;
            this.props.onChange(createEvent('change', { name, value, field: field || name }));
        }
    }

    /**
     * Render our checkbox
     */
    render() {
        const { label, checked } = this.props;
        return (
            <RadioWrapper onClick={this.onChange}>
                <RadioInputStyle>
                    <RadioInput
                        type="radio"
                        defaultChecked={!!checked}
                    />
                    { checked ? (<RadioChecked {...this.props} ><CheckedIcon name="checkbox-blank-circle" size="sm" /></RadioChecked>) : (<RadioBase {...this.props} />) }
                </RadioInputStyle>
                { label && <RadioLabel>{label}</RadioLabel> }
            </RadioWrapper>
        );
    }
}

export default Radio;
