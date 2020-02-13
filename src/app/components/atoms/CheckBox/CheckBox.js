/* @flow */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import InputWrapper from 'app/components/atoms/InputWrapper/InputWrapper';
import Icon from 'app/components/atoms/Icon/Icon';
import Label from 'app/components/molecules/Label/Label';
import { createEvent } from 'app/utils/http/event';

const CheckboxWrapper = styled(InputWrapper)`
    display: flex;
`;

const CheckboxInputStyle = styled.div`
    position: relative;
    display: inline-block;
    width: 18px; height: 18px;
    ${({ disabled }) => disabled ? 'opacity: 0.5;' : ''};
`;

const CheckboxInput = styled.input`
    display: block;
    visibility: hidden;
    width: 18px; height: 18px;
    z-index: 1;
`;

const CheckboxBase = styled.div`
    position: absolute;
    left: 0;
    top:0;
    cursor: pointer;
    width: 18px; height: 18px;
    background: ${ ( { theme } ) => theme.input.background };
    display: block;
    border-radius: .2rem;
    z-index: 0;
    border: solid 1px ${ ( { theme } ) => theme.base.borderColor };
    &:hover, &:focus {
      border: solid 1px ${({ disabled, theme }) => disabled ? theme.base.borderColor : theme.base.active.borderColor};
    }
`;

const CheckboxChecked = styled(CheckboxBase)`
    background: ${ ( { theme } ) => theme.input.background };
`;

const CheckedIcon = styled(Icon)`
    position: absolute;
    top: -3px;
    left: 0px;
    width: 16px;
    height: 16px;
    &:before {
        line-height: 21px;
        margin: 0; padding: 0;
        color: ${ ( { theme, disabled } ) => disabled ? '#ccc' : theme.color.primary };
        font-weight: 600;
    }
`;

// We need to take our default label style and overwrite some stuff
const CheckboxLabel = styled(Label)`
    display: inline-block;
    margin: 0 0 0 .5rem;
    word-break: break-word;
`;

/**
 * Our checkbox component
 */
class Checkbox extends Component<Object, Object> {

    static propTypes = {
        name: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.arrayOf(PropTypes.string),
        ]),
        label: PropTypes.string,
        checked: PropTypes.bool,
        disabled: PropTypes.bool,
        onChange: PropTypes.func,
    };

    /**
     * onChange event handler
     *
     * @param event a SyntheticEvent (https://facebook.github.io/react/docs/events.html)
     */
    onChange = ( event: Event ) => {
        event.stopPropagation();
        if ( this.props.onChange && !this.props.disabled ) {
            const name = this.props.name;
            const value = !this.props.checked;
            this.props.onChange(createEvent('change', { name, value, checked: value }));
        }
    };

    /**
     * Render our checkbox
     */
    render() {
        const { label, checked, disabled } = this.props;
        return (
            <CheckboxWrapper disabled={disabled}>
                <CheckboxInputStyle onClick={this.onChange} disabled={disabled}>
                    <CheckboxInput
                        type="checkbox"
                        checked={!!checked}
                        onChange={() => {}}
                        disabled={disabled}
                    />
                    { checked ? (<CheckboxChecked {...this.props} ><CheckedIcon name="check" size="sm" /></CheckboxChecked>) : (<CheckboxBase {...this.props} />) }
                </CheckboxInputStyle>
                { label && <CheckboxLabel>{label}</CheckboxLabel> }
            </CheckboxWrapper>
        );
    }
}

export default Checkbox;
